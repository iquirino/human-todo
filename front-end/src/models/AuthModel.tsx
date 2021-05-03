import { UserModel } from "./UserModel";

export interface LoginStatus {
  username: string;
  accessToken: any;
  expiresIn: any;
}

export interface RegistrationStatus {
  success: boolean;
  message: string;
}

export interface AuthModel {
  isLoggedIn: boolean;
  user?: UserModel;
}
