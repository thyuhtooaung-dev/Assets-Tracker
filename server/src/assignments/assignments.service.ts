import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Assignment, AssignmentStatus } from './entities/assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { ReturnAssignmentDto } from './dto/return-assignment.dto';
import { Asset, AssetStatus } from '../assets/entities/asset.entity';
import { Employee } from '../employees/entities/employee.entity';

const ASSIGNMENT_RELATIONS = ['asset', 'asset.category', 'employee'] as const;

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private dataSource: DataSource,
  ) {}

  private async findAssignmentOrThrow(
    id: string,
    repository: Repository<Assignment> = this.assignmentRepository,
  ) {
    const assignment = await repository.findOne({
      where: { id },
      relations: [...ASSIGNMENT_RELATIONS],
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with id "${id}" not found`);
    }

    return assignment;
  }

  async create(createAssignmentDto: CreateAssignmentDto) {
    const [asset, employee, activeAssignment] = await Promise.all([
      this.assetRepository.findOne({
        where: { id: createAssignmentDto.assetId },
        relations: ['employee'],
      }),
      this.employeeRepository.findOne({
        where: { id: createAssignmentDto.employeeId },
      }),
      this.assignmentRepository.findOne({
        where: {
          asset: { id: createAssignmentDto.assetId },
          status: AssignmentStatus.ACTIVE,
        },
      }),
    ]);

    if (!asset) {
      throw new NotFoundException(
        `Asset with id "${createAssignmentDto.assetId}" not found`,
      );
    }

    if (!employee) {
      throw new NotFoundException(
        `Employee with id "${createAssignmentDto.employeeId}" not found`,
      );
    }

    if (activeAssignment || asset.employee) {
      throw new ConflictException(
        `Asset "${asset.name}" is already assigned to an employee`,
      );
    }

    if (asset.status !== AssetStatus.AVAILABLE) {
      throw new BadRequestException(
        `Asset "${asset.name}" cannot be assigned while status is "${asset.status}"`,
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const assignmentRepository = manager.getRepository(Assignment);
      const assetRepository = manager.getRepository(Asset);

      const assignment = assignmentRepository.create({
        asset: { id: asset.id } as Assignment['asset'],
        employee: { id: employee.id } as Assignment['employee'],
        assignedAt: createAssignmentDto.assignedAt
          ? new Date(createAssignmentDto.assignedAt)
          : new Date(),
        expectedReturnDate: createAssignmentDto.expectedReturnDate
          ? new Date(createAssignmentDto.expectedReturnDate)
          : null,
        status: AssignmentStatus.ACTIVE,
        assignmentCondition:
          createAssignmentDto.assignmentCondition?.trim() || null,
        notes: createAssignmentDto.notes?.trim() || null,
      });

      const savedAssignment = await assignmentRepository.save(assignment);

      const assetToUpdate = await assetRepository.findOne({
        where: { id: asset.id },
        relations: ['employee'],
      });

      if (!assetToUpdate) {
        throw new NotFoundException(`Asset with id "${asset.id}" not found`);
      }

      assetToUpdate.employee = employee;
      assetToUpdate.status = AssetStatus.ASSIGNED;
      await assetRepository.save(assetToUpdate);

      return this.findAssignmentOrThrow(
        savedAssignment.id,
        assignmentRepository,
      );
    });
  }

  async findAll() {
    return this.assignmentRepository.find({
      relations: [...ASSIGNMENT_RELATIONS],
      order: {
        assignedAt: 'DESC',
      },
    });
  }

  async findActive() {
    return this.assignmentRepository.find({
      where: { status: AssignmentStatus.ACTIVE },
      relations: [...ASSIGNMENT_RELATIONS],
      order: {
        assignedAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    return this.findAssignmentOrThrow(id);
  }

  async returnAssignment(id: string, returnAssignmentDto: ReturnAssignmentDto) {
    const assignment = await this.findOne(id);

    if (assignment.status === AssignmentStatus.RETURNED) {
      throw new ConflictException(
        `Assignment with id "${id}" is already returned`,
      );
    }

    const nextAssetStatus =
      returnAssignmentDto.nextAssetStatus ?? AssetStatus.AVAILABLE;

    if (nextAssetStatus === AssetStatus.ASSIGNED) {
      throw new BadRequestException(
        'Returned assignment cannot leave the asset in "assigned" status',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const assignmentRepository = manager.getRepository(Assignment);
      const assetRepository = manager.getRepository(Asset);

      const assignmentToUpdate = await this.findAssignmentOrThrow(
        id,
        assignmentRepository,
      );

      assignmentToUpdate.returnedAt = returnAssignmentDto.returnedAt
        ? new Date(returnAssignmentDto.returnedAt)
        : new Date();
      assignmentToUpdate.status = AssignmentStatus.RETURNED;
      assignmentToUpdate.returnCondition =
        returnAssignmentDto.returnCondition?.trim() || null;
      assignmentToUpdate.returnNotes =
        returnAssignmentDto.returnNotes?.trim() || null;
      await assignmentRepository.save(assignmentToUpdate);

      const asset = await assetRepository.findOne({
        where: { id: assignmentToUpdate.asset.id },
        relations: ['employee'],
      });

      if (!asset) {
        throw new NotFoundException(
          `Asset with id "${assignmentToUpdate.asset.id}" not found`,
        );
      }

      asset.employee = null;
      asset.status = nextAssetStatus;
      await assetRepository.save(asset);

      return this.findAssignmentOrThrow(id, assignmentRepository);
    });
  }

  async remove(id: string) {
    const assignment = await this.findOne(id);

    if (assignment.status === AssignmentStatus.ACTIVE) {
      throw new BadRequestException(
        'Return the assignment before deleting the assignment record',
      );
    }

    await this.assignmentRepository.remove(assignment);

    return { message: `Assignment with id "${id}" deleted successfully` };
  }
}
