import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const newEmployee = this.employeeRepository.create(createEmployeeDto);
    return await this.employeeRepository.save(newEmployee);
  }

  async findAll() {
    return await this.employeeRepository.find({
      relations: ['assets'],
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['assets'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with id "${id}" not found`);
    }

    return employee;
  }

  async getCount() {
    const totalEmployees = await this.employeeRepository.count();

    return {
      totalEmployees,
    };
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);

    const updatedEmployee: Employee = {
      ...employee,
      ...updateEmployeeDto,
    };

    return await this.employeeRepository.save(updatedEmployee);
  }

  async remove(id: string) {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);

    return { message: `Employee with id "${id}" deleted successfully` };
  }
}
