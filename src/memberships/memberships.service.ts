import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './entities/membership.entity';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async create(createMembershipDto: any): Promise<Membership> {
    const user = await this.usersRepository.findOne({
      where: { id: createMembershipDto.userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${createMembershipDto.userId} not found`);
    }

    const membership = this.membershipsRepository.create({
      ...createMembershipDto,
      user,
      status: 'ACTIVE',
      startDate: new Date(),
    });

    return this.membershipsRepository.save(membership);
  }

  async findAll(): Promise<Membership[]> {
    return this.membershipsRepository.find({
      relations: ['user'],
    });
  }

  async findByUser(userId: string): Promise<Membership[]> {
    return this.membershipsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Membership> {
    const membership = await this.membershipsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!membership) {
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }
    return membership;
  }

  async update(id: string, updateMembershipDto: any): Promise<Membership> {
    const membership = await this.findOne(id);
    return this.membershipsRepository.save({
      ...membership,
      ...updateMembershipDto,
    });
  }

  async renewMembership(id: string): Promise<Membership> {
    const membership = await this.findOne(id);
    if (membership.status === 'EXPIRED') {
      membership.status = 'ACTIVE';
      membership.startDate = new Date();
      membership.endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    }
    return this.membershipsRepository.save(membership);
  }

  async cancelMembership(id: string): Promise<Membership> {
    const membership = await this.findOne(id);
    membership.status = 'INACTIVE';
    return this.membershipsRepository.save(membership);
  }

  async getMembershipBenefits(membershipType: string): Promise<any> {
    const benefits = {
      COMMUNITY: {
        access: ['Digital Content Modules', 'Community Events'],
        discounts: ['10% off Workshops', '5% off Creative Spaces'],
        exclusives: ['Community Newsletter', 'Member Directory']
      },
      KEY_ACCESS: {
        access: ['24/7 Building Access', 'Meeting Rooms', 'Event Spaces'],
        discounts: ['20% off Events', '15% off Workshops'],
        exclusives: ['Key Access Card', 'Priority Booking']
      },
      CREATIVE_WORKSPACE: {
        access: ['Dedicated Workspace', 'Creative Tools', 'Production Equipment'],
        discounts: ['30% off Workshops', '25% off Events'],
        exclusives: ['Personal Workspace', 'Equipment Training']
      }
    };

    return benefits[membershipType];
  }
}