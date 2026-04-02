import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Asset } from '../../assets/entities/asset.entity';
import { Employee } from '../../employees/entities/employee.entity';

export enum AssignmentStatus {
  ACTIVE = 'active',
  RETURNED = 'returned',
}

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Asset, (asset) => asset.assignments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  asset: Asset;

  @ManyToOne(() => Employee, (employee) => employee.assignments, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  employee: Employee;

  @Column({ type: 'timestamptz' })
  assignedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expectedReturnDate: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  returnedAt: Date | null;

  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.ACTIVE,
  })
  status: AssignmentStatus;

  @Column({ type: 'varchar', length: 120, nullable: true })
  assignmentCondition: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  returnCondition: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'text', nullable: true })
  returnNotes: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
