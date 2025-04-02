import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async create(createInterestDto: any): Promise<Interest> {
    const user = await this.usersRepository.findOne({
      where: { id: createInterestDto.userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${createInterestDto.userId} not found`);
    }

    const interest = this.interestsRepository.create({
      ...createInterestDto,
      user,
    });

    return this.interestsRepository.save(interest);
  }

  async findAll(): Promise<Interest[]> {
    return this.interestsRepository.find({
      relations: ['user'],
    });
  }

  async findByUser(userId: string): Promise<Interest[]> {
    return this.interestsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Interest> {
    const interest = await this.interestsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!interest) {
      throw new NotFoundException(`Interest with ID ${id} not found`);
    }
    return interest;
  }

  async update(id: string, updateInterestDto: any): Promise<Interest> {
    const interest = await this.findOne(id);
    return this.interestsRepository.save({
      ...interest,
      ...updateInterestDto,
    });
  }

  async remove(id: string): Promise<void> {
    const interest = await this.findOne(id);
    await this.interestsRepository.remove(interest);
  }

  async trackEngagement(interestId: string): Promise<Interest> {
    const interest = await this.findOne(interestId);
    interest.engagementScore += 1;
    return this.interestsRepository.save(interest);
  }

  async getInterestAnalysis(userId: string): Promise<any> {
    const interests = await this.findByUser(userId);
    const analysis = {
      totalInterests: interests.length,
      activeInterests: interests.filter(i => i.isActive).length,
      interestTypes: {
        CARE: interests.filter(i => i.type === 'CARE').length,
        SHARE: interests.filter(i => i.type === 'SHARE').length,
        CREATE: interests.filter(i => i.type === 'CREATE').length,
        EXPERIENCE: interests.filter(i => i.type === 'EXPERIENCE').length,
        WORK: interests.filter(i => i.type === 'WORK').length,
      },
      averageEngagement: interests.reduce((sum, i) => sum + i.engagementScore, 0) / interests.length,
      mostEngagedInterest: interests.reduce((prev, current) => 
        (prev.engagementScore > current.engagementScore) ? prev : current
      ),
      interestTimeline: interests.map(i => ({
        type: i.type,
        createdAt: i.createdAt,
        engagementScore: i.engagementScore
      }))
    };

    return analysis;
  }

  async getCommunityTrends(): Promise<any> {
    const allInterests = await this.findAll();
    const trends = {
      totalUsers: [...new Set(allInterests.map(i => i.user.id))].length,
      interestDistribution: {
        CARE: allInterests.filter(i => i.type === 'CARE').length,
        SHARE: allInterests.filter(i => i.type === 'SHARE').length,
        CREATE: allInterests.filter(i => i.type === 'CREATE').length,
        EXPERIENCE: allInterests.filter(i => i.type === 'EXPERIENCE').length,
        WORK: allInterests.filter(i => i.type === 'WORK').length,
      },
      averageEngagement: allInterests.reduce((sum, i) => sum + i.engagementScore, 0) / allInterests.length,
      mostPopularInterest: Object.entries(trends.interestDistribution).reduce((a, b) => 
        a[1] > b[1] ? a : b
      )[0],
      engagementTimeline: allInterests.reduce((acc, curr) => {
        const date = curr.createdAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + curr.engagementScore;
        return acc;
      }, {})
    };

    return trends;
  }
}