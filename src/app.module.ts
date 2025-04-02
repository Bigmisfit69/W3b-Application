import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MembershipsModule } from './memberships/memberships.module';
import { InterestsModule } from './interests/interests.module';

@Module({
  imports: [AuthModule, UsersModule, MembershipsModule, InterestsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
