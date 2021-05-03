import { ProjectDto } from '@project/dto/project.dto';
import { UserDto } from '@user/dto/user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class TaskDto {
  @IsNotEmpty()
  id: string;
  projectId: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  finished: boolean;
  plannedFinishDate?: Date;
  finishedDate?: Date;
  createdOn?: Date;
  updatedOn?: Date;
}
