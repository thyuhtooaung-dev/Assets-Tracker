import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Asset } from '../../assets/entities/asset.entity';

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
}
