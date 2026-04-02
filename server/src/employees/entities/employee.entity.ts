import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Asset } from '../../assets/entities/asset.entity';
import { Assignment } from '../../assignments/entities/assignment.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  department: string;

  @OneToMany(() => Asset, (asset) => asset.employee)
  assets: Asset[];

  @OneToMany(() => Assignment, (assignment) => assignment.employee)
  assignments: Assignment[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
