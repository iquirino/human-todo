import { forwardRef, Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectEntity } from './entity/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@user/entity/user.entity';
import { UsersModule } from '@user/users.module';
import { AuthModule } from '@auth/auth.module';
import { TaskModule } from '@task/task.module';

@Module({
  imports: [
    UsersModule,
    TaskModule,
    AuthModule,
    TypeOrmModule.forFeature([ProjectEntity, UserEntity]),
  ],
  exports: [ProjectService],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
