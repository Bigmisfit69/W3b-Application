import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Membership } from '../../memberships/entities/membership.entity';;
import { Interest } from '../../interests/entities/interest.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['ADMIN', 'MEMBER'], default: 'MEMBER' })
  role: string;

  @Column({ type: 'enum', enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  status: string;

  @Column({ type: 'enum', enum: ['COMMUNITY', 'KEY_ACCESS', 'CREATIVE_WORKSPACE'] })
  membershipType: string;

  @OneToMany(() => Membership, membership => membership.user)
  memberships: Membership[];

  @OneToMany(() => Interest, interest => interest.user)
  interests: Interest[];

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  bio: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}