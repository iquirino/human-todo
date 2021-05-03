import axios from "axios";
import { LoginStatus, RegistrationStatus } from "../models/AuthModel";
import { CreateUserModel } from "../models/UserModel";

export const register = async (
  newUser: CreateUserModel
): Promise<RegistrationStatus> => {
  const ret = await axios.post<RegistrationStatus>(
    `${window.apiUrl}/auth/register`,
    newUser
  );
  return ret.data;
};

export const login = async (
  username: string,
  password: string
): Promise<LoginStatus> => {
  const ret = await axios.post<LoginStatus>(`${window.apiUrl}/auth/login`, {
    username,
    password,
  });
  return ret.data;
};
