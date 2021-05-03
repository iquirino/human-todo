import axios from "axios";
import { CreateTaskModel, TaskModel } from "../models/TaskModel";
export const getTasks = async (token: string) => {
  return await axios.get<{ tasks: TaskModel[] }>(
    `${window.apiUrl}/api/tasks/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const addTask = async (task: CreateTaskModel, token: string) => {
  return await axios.post<TaskModel>(
    `${window.apiUrl}/api/tasks/project/${task.projectKey}`,
    task,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateTask = async (task: TaskModel, token: string) => {
  return await axios.put<TaskModel>(
    `${window.apiUrl}/api/tasks/${task.id}`,
    task,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteTask = async (taskId: string, token: string) => {
  return await axios.delete(`${window.apiUrl}/api/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
