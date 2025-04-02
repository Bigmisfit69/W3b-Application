import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}