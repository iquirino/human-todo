import { createSlice } from "@reduxjs/toolkit";
import { AuthModel } from "../models/AuthModel";
import { NetworkModel } from "../models/NetworkModel";
import { ProjectModel } from "../models/ProjectModel";
import { TaskModel } from "../models/TaskModel";
import { sanitizeUrl } from "../shared/utils";

export interface AppState {
  auth: AuthModel;
  projects: ProjectModel[];
  tasks: TaskModel[];
}

const initialState: NetworkModel<AppState> = {
  online: true,
  data: {
    auth: { isLoggedIn: false },
    projects: [],
    tasks: [],
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // Network producers
    updateNetwork(state, action) {
      state.online = action.payload;
    },
    // Auth reducers
    logout(state) {
      state.data.auth.isLoggedIn = false;
      state.data.auth.user = undefined;
      state.data.projects = [];
      state.data.tasks = [];
    },
    // Project reducers
    addProject(state, action: { payload: ProjectModel; type: string }) {
      state.data.projects.push(action.payload);
    },
    projectAdded(
      state,
      action: { payload: { oldKey: string; data: ProjectModel }; type: string }
    ) {
      const {
        id,
        name,
        createdOn,
        updatedOn,
      }: ProjectModel = action.payload.data;

      const existingProject = state.data.projects.find(
        (t) => t.key === action.payload.oldKey
      );
      if (existingProject) {
        existingProject.id = id;
        existingProject.name = name;
        existingProject.createdOn = createdOn;
        existingProject.updatedOn = updatedOn;
        existingProject.syncronized = true;
      }
    },
    updateProject(state, action: { payload: ProjectModel; type: string }) {
      const {
        id,
        name,
        key,
        createdOn,
        deleted,
        updatedOn,
      }: ProjectModel = action.payload;
      const newKey = sanitizeUrl(action.payload.name);
      const existingProject = state.data.projects.find(
        (t) => (id && t.id === id) || (!id && t.key === key)
      );
      if (existingProject) {
        existingProject.id = id;
        existingProject.name = name;
        existingProject.key = newKey;
        existingProject.deleted = deleted;
        existingProject.createdOn = createdOn;
        existingProject.updatedOn = updatedOn;
        existingProject.syncronized = false;
      }

      state.data.tasks
        .filter((t) => t.projectId === id || t.projectKey === key)
        .forEach((t) => {
          t.projectId = id;
          t.projectKey = newKey;
        });
    },
    projectUpdated(state, action: { payload: ProjectModel; type: string }) {
      const {
        id,
        key,
        name,
        createdOn,
        deleted,
        updatedOn,
      }: ProjectModel = action.payload;
      const newKey = sanitizeUrl(action.payload.name);

      const existingProject = state.data.projects.find(
        (t) => (id && t.id === id) || (!id && t.key === key)
      );
      if (existingProject) {
        existingProject.id = id;
        existingProject.key = newKey;
        existingProject.name = name;
        existingProject.deleted = deleted;
        existingProject.createdOn = createdOn;
        existingProject.updatedOn = updatedOn;
        existingProject.syncronized = true;
      }

      state.data.tasks
        .filter((t) => t.projectId === id || t.projectKey === key)
        .forEach((t) => {
          t.projectId = id;
          t.projectKey = newKey;
        });
    },
    deleteProject(state, action: { payload: ProjectModel; type: string }) {
      const { id, key: projectKey } = action.payload;
      const existingProject = state.data.projects.find(
        (t) => t.id === id && t.key === projectKey
      );
      if (existingProject) {
        existingProject.deleted = true;
        existingProject.updatedOn = new Date();
        existingProject.syncronized = false;
      }
    },
    projectDeleted(state, action: { payload: ProjectModel; type: string }) {
      state.data.projects = state.data.projects.filter(
        (t) => t.key !== action.payload.key
      );
    },
    //Task reducers
    addTask(state, action: { payload: TaskModel; type: string }) {
      state.data.tasks.push(action.payload);
    },
    taskAdded(
      state,
      action: { payload: { oldKey: string; data: TaskModel }; type: string }
    ) {
      const {
        id,
        description,
        finished,
        projectKey,
        createdOn,
        deleted,
        finishedDate,
        plannedFinishDate,
        projectId,
        updatedOn,
      }: TaskModel = action.payload.data;

      const existingTask = state.data.tasks.find(
        (t) => t.key === action.payload.oldKey
      );
      if (existingTask) {
        existingTask.id = id;
        existingTask.projectId = projectId;
        existingTask.projectKey = projectKey;
        existingTask.description = description;
        existingTask.finishedDate = finishedDate;
        existingTask.plannedFinishDate = plannedFinishDate;
        existingTask.finished = finished;
        existingTask.deleted = deleted;
        existingTask.createdOn = createdOn;
        existingTask.updatedOn = updatedOn;
        existingTask.syncronized = true;
      }
    },
    updateTask(state, action: { payload: TaskModel; type: string }) {
      const {
        id,
        key,
        description,
        finished,
        projectKey,
        createdOn,
        deleted,
        finishedDate,
        plannedFinishDate,
        projectId,
        updatedOn,
      }: TaskModel = action.payload;
      const existingTask = state.data.tasks.find(
        (t) => (id && t.id === id) || (!id && t.key === key)
      );
      if (existingTask) {
        existingTask.id = id;
        existingTask.projectId = projectId;
        existingTask.projectKey = projectKey;
        existingTask.description = description;
        existingTask.finishedDate = finishedDate;
        existingTask.plannedFinishDate = plannedFinishDate;
        existingTask.finished = finished;
        existingTask.deleted = deleted;
        existingTask.createdOn = createdOn;
        existingTask.updatedOn = new Date();
        existingTask.syncronized = false;
      }
    },
    taskUpdated(state, action: { payload: TaskModel; type: string }) {
      const {
        id,
        key,
        description,
        finished,
        projectKey,
        createdOn,
        deleted,
        finishedDate,
        plannedFinishDate,
        projectId,
        updatedOn,
      }: TaskModel = action.payload;

      const existingTask = state.data.tasks.find(
        (t) => (id && t.id === id) || (!id && t.key === key)
      );
      if (existingTask) {
        existingTask.id = id;
        existingTask.projectId = projectId;
        existingTask.projectKey = projectKey;
        existingTask.description = description;
        existingTask.finishedDate = finishedDate;
        existingTask.plannedFinishDate = plannedFinishDate;
        existingTask.finished = finished;
        existingTask.deleted = deleted;
        existingTask.createdOn = createdOn;
        existingTask.updatedOn = updatedOn;
        existingTask.syncronized = true;
      }
    },
    deleteTask(state, action: { payload: TaskModel; type: string }) {
      const { id, key } = action.payload;
      const existingTask = state.data.tasks.find(
        (t) => t.id === id && t.key === key
      );
      if (existingTask) {
        existingTask.deleted = true;
        existingTask.updatedOn = new Date();
        existingTask.syncronized = false;
      }
    },
    taskDeleted(state, action: { payload: TaskModel; type: string }) {
      state.data.tasks = state.data.tasks.filter(
        (t) => t.id !== action.payload.id || t.key !== action.payload.key
      );
    },
  },
  extraReducers: {
    // Auth actions
    "auth/loginStatus/fulfilled": (state, action) => {
      state.data.auth.isLoggedIn = true;
      state.data.auth.user = action.payload;
    },
    // Project actions
    "projects/syncStatus/fulfilled": (
      state,
      action: { payload: ProjectModel[]; type: string }
    ) => {
      if (!action.payload) return state;

      const projectsFromApi: ProjectModel[] = action.payload;
      projectsFromApi.forEach((t) => {
        let projectFromStore = state.data.projects.find(
          (s) => s.id && t.id && s.id === t.id
        );

        // Remotely updated
        if (projectFromStore) {
          if (
            t.updatedOn &&
            projectFromStore.updatedOn &&
            projectFromStore.updatedOn < t.updatedOn
          ) {
            projectFromStore.id = t.id;
            projectFromStore.key = t.key;
            projectFromStore.name = t.name;
            projectFromStore.deleted = t.deleted;
            projectFromStore.createdOn = t.createdOn;
            projectFromStore.updatedOn = t.updatedOn;
            projectFromStore.syncronized = true;
          }
        } else {
          // Remotely added
          state.data.projects.push({
            id: t.id,
            key: t.key,
            name: t.name,
            deleted: t.deleted,
            createdOn: t.createdOn,
            updatedOn: t.updatedOn,
            syncronized: true,
          });
        }
      });

      return state;
    },
    // Task actions
    "tasks/syncStatus/fulfilled": (
      state,
      action: { payload: TaskModel[]; type: string }
    ) => {
      if (!action.payload) return state;

      const tasksFromApi: TaskModel[] = action.payload;
      tasksFromApi.forEach((t) => {
        let taskFromStore = state.data.tasks.find(
          (s) => s.id && t.id && s.id === t.id
        );

        // Remotely updated
        if (taskFromStore) {
          if (
            t.updatedOn &&
            taskFromStore.updatedOn &&
            taskFromStore.updatedOn < t.updatedOn
          ) {
            taskFromStore.id = t.id;
            taskFromStore.key = t.key;
            taskFromStore.projectId = t.projectId;
            taskFromStore.projectKey = t.projectKey;
            taskFromStore.description = t.description;
            taskFromStore.finishedDate = t.finishedDate;
            taskFromStore.plannedFinishDate = t.plannedFinishDate;
            taskFromStore.finished = t.finished;
            taskFromStore.deleted = t.deleted;
            taskFromStore.createdOn = t.createdOn;
            taskFromStore.updatedOn = t.updatedOn;
            taskFromStore.syncronized = true;
          }
        } else {
          // Remotely added
          const project = state.data.projects.find((p) => p.id === t.projectId);
          if (project) t.projectKey = project.key;
          state.data.tasks.push({
            id: t.id,
            key: t.key,
            projectId: t.projectId,
            projectKey: t.projectKey,
            description: t.description,
            finishedDate: t.finishedDate,
            plannedFinishDate: t.plannedFinishDate,
            finished: t.finished,
            deleted: t.deleted,
            createdOn: t.createdOn,
            updatedOn: t.updatedOn,
            syncronized: true,
          });
        }
      });

      return state;
    },
  },
});

export const actions = { ...appSlice.actions };

export const appReducer = appSlice.reducer;
