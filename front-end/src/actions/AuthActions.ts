import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { CreateUserModel } from "../models/UserModel";
import { login, register } from "../services/AuthService";

export const registerAction = createAsyncThunk(
  "auth/registrationStatus",
  async (user: CreateUserModel, { rejectWithValue }) => {
    try {
      const response = await register(user);
      return response;
    } catch (err) {
      return rejectWithValue("An error occurred, please try again.");
    }
  }
);
export const loginAction = createAsyncThunk(
  "auth/loginStatus",
  async (data: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await login(data.username, data.password);
      return response;
    } catch (err) {
      const error: AxiosError<any> = err;
      if (error.response?.status === 401)
        return rejectWithValue("Invalid username or password.");
      else return rejectWithValue("An error occurred, please try again.");
    }
  }
);