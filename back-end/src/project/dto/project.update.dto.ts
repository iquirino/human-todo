import { IsNotEmpty } from 'class-validator';
import { UserDto } from '@user/dto/user.dto';

export class UpdatedProjectDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;
  
  updatedOn?: Date;
}
