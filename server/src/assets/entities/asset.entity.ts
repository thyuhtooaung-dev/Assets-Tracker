import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { Category } from '../../categories/entities/category.entity';
import { Assignment } from '../../assignments/entities/assignment.entity';

export enum AssetStatus {
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
  REPAIRING = 'repairing',
  BROKEN = 'broken',
}

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  serialNumber: string;

  @Column({ type: 'enum', enum: AssetStatus, default: AssetStatus.AVAILABLE })
  status: AssetStatus;

  @ManyToOne(() => Category, (category) => category.assets)
  category: Category;

  @ManyToOne(() => Employee, (employee) => employee.assets, { nullable: true })
  employee: Employee | null;

  @OneToMany(() => Assignment, (assignment) => assignment.asset)
  assignments: Assignment[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
