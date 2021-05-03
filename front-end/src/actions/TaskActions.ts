import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { NetworkModel } from "../models/NetworkModel";
import { CreateTaskModel, TaskModel } from "../models/TaskModel";
import { actions, AppState } from "../redux/slices";
import {
  addTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/TaskService";

export const syncTasksAction = createAsyncThunk<
  any,
  void,
  { state: { app: NetworkModel<AppState> } }
>("tasks/syncStatus", async (_, { getState, rejectWithValue, dispatch }) => {
  const state = getState();
  if (state?.app?.data?.auth?.user) {
    try {
      const token = state.app.data.auth.user.accessToken;
      const response = await getTasks(token);

      const tasksFromApi: TaskModel[] = response.data.tasks;
      const tasksFromState: TaskModel[] = state.app.data.tasks;

      for (let x = 0; x < tasksFromState.length; x++) {
        const ts = tasksFromState[x];
        if (!ts.syncronized) {
          // Has id
          if (ts.id) {
            const ta = tasksFromApi.find((a) => a.id === ts.id);

            // Triggered to be deleted
            if (ts.deleted && ts.id) {
              await deleteTask(ts.id, token);
              dispatch(actions.taskDeleted(ts));
              continue;
            }

            // Exists on api
            if (ta) {
              // Has newer dates than local
              if (
                ta.createdOn < ts.createdOn ||
                (ts.updatedOn && ta.updatedOn && ta.updatedOn < ts.updatedOn)
              ) {
                const updatedTask = await updateTask(ts, token);

                const project = state.app.data.projects.find(
                  (p) => p.id === updatedTask.data.projectId
                );
                if (project) ts.projectKey = project.key;

                ts.id = ta.id;
                ts.projectId = ta.projectId;
                ts.key = ts.projectKey + "_" + ts.id;
                ts.finished = updatedTask.data.finished;
                ts.plannedFinishDate = updatedTask.data.plannedFinishDate;
                ts.createdOn = updatedTask.data.createdOn;
                ts.updatedOn = updatedTask.data.updatedOn;
                ts.syncronized = true;
                dispatch(actions.taskUpdated(ts));
              }
            }
          } else {
            // Does not have an id -> add a task
            const addedTask = await addTask(ts, token);

            const project = state.app.data.projects.find(
              (p) => p.id === addedTask.data.projectId
            );

            dispatch(
              actions.taskAdded({
                oldKey: ts.key,
                data: {
                  projectKey: project ? project.key : ts.projectKey,
                  id: addedTask.data.id,
                  description: ts.description,
                  key:
                    (project ? project.key : ts.projectKey) +
                    "_" +
                    addedTask.data.id,
                  finished: addedTask.data.finished,
                  plannedFinishDate: addedTask.data.plannedFinishDate,
                  createdOn: addedTask.data.createdOn,
                  updatedOn: addedTask.data.updatedOn,
                  deleted: false,
                  syncronized: true,
                },
              })
            );
          }
        } else {
          // Deletes anything with and id but not on the api
          if (ts.id) {
            const ta = tasksFromApi.find((a) => a.id === ts.id);
            if (!ta) {
              dispatch(actions.taskDeleted(ts));
            }
          }

          // Deletes anything syncronized without id
          if (!ts.id) {
            dispatch(actions.taskDeleted(ts));
          }
        }
      }

      return response.data.tasks;
    } catch (err) {
      const error: AxiosError<any> = err;
      if (error.response?.status === 401) {
        dispatch(actions.logout());
        return rejectWithValue("You are not logged in.");
      } else return rejectWithValue("An error occurred, please try again.");
    }
  } else {
    dispatch(actions.logout());
    return rejectWithValue("You are not logged in");
  }
});

export const addTaskAction = createAsyncThunk<
  CreateTaskModel,
  TaskModel,
  { state: { app: NetworkModel<AppState> } }
>(
  "tasks/addStatus",
  async (task: CreateTaskModel, { rejectWithValue, dispatch, getState }) => {
    const state = getState();
    const taskToAdd = {
      key: task.projectKey + "_" + Math.floor(Math.random() * 100000000),
      id: task.id,
      projectId: task.projectId,
      projectKey: task.projectKey,
      description: task.description,
      finishedDate: task.finishedDate,
      plannedFinishDate: task.plannedFinishDate,
      finished: task.finished,
      deleted: task.deleted,
      createdOn: task.createdOn || new Date(),
      updatedOn: task.updatedOn,
      syncronized: false,
    };

    dispatch(actions.addTask(taskToAdd));

    if (state.app.online && state?.app?.data?.auth?.user) {
      try {
        const token = state.app.data.auth.user.accessToken;
        const response = await addTask(taskToAdd, token);
        dispatch(
          actions.taskAdded({ oldKey: taskToAdd.key, data: response.data })
        );
        return response.data;
      } catch (err) {
        const error: AxiosError<any> = err;
        if (error.response?.status === 401) {
          dispatch(actions.logout());
          return rejectWithValue("You are not logged in.");
        } else return rejectWithValue("An error occurred, please try again.");
      }
    } else {
      return taskToAdd;
    }
  }
);

export const updateTaskAction = createAsyncThunk<
  TaskModel,
  TaskModel,
  { state: { app: NetworkModel<AppState> } }
>(
  "tasks/updateStatus",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const state = getState();
    if (state.app.online && state?.app?.data?.auth?.user) {
      try {
        const token = state.app.data.auth.user.accessToken;
        const response = await updateTask(data, token);
        debugger;
        dispatch(actions.taskUpdated(response.data));
        return response.data;
      } catch (err) {
        dispatch(actions.updateTask(data));
        const error: AxiosError<any> = err;
        if (error.response?.status === 401) {
          dispatch(actions.logout());
          return rejectWithValue("You are not logged in.");
        } else return rejectWithValue("An error occurred, please try again.");
      }
    } else {
      dispatch(actions.updateTask(data));
      return data;
    }
  }
);

export const deleteTaskAction = createAsyncThunk<
  TaskModel,
  TaskModel,
  { state: { app: NetworkModel<AppState> } }
>(
  "tasks/deleteStatus",
  async (data, { rejectWithValue, dispatch, getState }) => {
    if (!data.id) 
    {
      dispatch(actions.taskDeleted(data));
      return data;
    };
    const state = getState();
    if (state?.app?.data?.auth?.user) {
      try {
        const token = state.app.data.auth.user.accessToken;
        const response = await deleteTask(data.id, token);
        dispatch(actions.taskDeleted(data));
        return response.data;
      } catch (err) {
        dispatch(actions.deleteTask(data));
        const error: AxiosError<any> = err;
        if (error.response?.status === 401) {
          dispatch(actions.logout());
          return rejectWithValue("You are not logged in.");
        } else return rejectWithValue("An error occurred, please try again.");
      }
    } else {
      dispatch(actions.logout());
      return rejectWithValue("You are not logged in");
    }
  }
);
