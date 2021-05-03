import { IsNotEmpty } from 'class-validator';
import { UserDto } from '@user/dto/user.dto';

export class ProjectDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  key: string;

  createdOn: Date;
  updatedOn?: Date;
}
