import axios from "axios";
import { ProjectModel } from "../models/ProjectModel";
export const getProjects = async (token: string) => {
  return await axios.get(`${window.apiUrl}/api/projects/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addProject = async (name: string, token: string) => {
  return await axios.post(
    `${window.apiUrl}/api/projects/`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const updateProject = async (project: ProjectModel, token: string) => {
  return await axios.put<ProjectModel>(
    `${window.apiUrl}/api/projects/${project.id}`,
    project,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteProject = async (projectId: string, token: string) => {
  return await axios.delete(
    `${window.apiUrl}/api/projects/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
