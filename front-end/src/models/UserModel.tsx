export interface UserModel {
  username: string;
  accessToken: any;
  expiresIn: any;
}

export interface CreateUserModel {
  username: string;
  password: string;
  email: string;
}
