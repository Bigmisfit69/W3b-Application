import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';
import { Interest } from './entities/interest.entity';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interest]),
    UsersModule,
    ConfigModule,
  ],
  controllers: [InterestsController],
  providers: [InterestsService],
  exports: [InterestsService],
})
export class InterestsModule {}