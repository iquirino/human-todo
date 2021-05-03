import { UserDto } from '@user/dto/user.dto';

export interface LoginStatus {
  id: string;
  username: string;
  accessToken: any;
  expiresIn: any;
}
