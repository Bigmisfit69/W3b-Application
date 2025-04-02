import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Entity('interests')
export class Interest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.interests)
  user: User;

  @Column({ type: 'enum', enum: ['CARE', 'SHARE', 'CREATE', 'EXPERIENCE', 'WORK'] })
  type: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'integer', default: 0 })
  engagementScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}