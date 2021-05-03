import { forwardRef, Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskEntity } from './entity/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@user/entity/user.entity';
import { UsersModule } from '@user/users.module';
import { AuthModule } from '@auth/auth.module';
import { ProjectModule } from '@project/project.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    forwardRef(() => ProjectModule),
    TypeOrmModule.forFeature([TaskEntity, UserEntity]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
