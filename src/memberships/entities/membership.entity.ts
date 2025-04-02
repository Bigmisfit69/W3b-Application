import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.memberships)
  user: User;

  @Column({ type: 'enum', enum: ['COMMUNITY', 'KEY_ACCESS', 'CREATIVE_WORKSPACE'] })
  type: string;

  @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE', 'EXPIRED'] })
  status: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}