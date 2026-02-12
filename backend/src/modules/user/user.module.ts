import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { StreakService } from './streak.service';

@Module({
  controllers: [UserController],
  providers: [UserService, StreakService],
  exports: [UserService, StreakService],
})
export class UserModule {}
