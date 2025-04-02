import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { Membership } from './entities/membership.entity';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Membership]),
    UsersModule,
    ConfigModule,
  ],
  controllers: [MembershipsController],
  providers: [MembershipsService],
  exports: [MembershipsService],
})
export class MembershipsModule {}