import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { NetworkModel } from "../models/NetworkModel";
import { CreateProjectModel, ProjectModel } from "../models/ProjectModel";
import { actions, AppState } from "../redux/slices";
import {
  addProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../services/ProjectService";
import { sanitizeUrl } from "../shared/utils";

export const syncProjectsAction = createAsyncThunk<
  any,
  void,
  { state: { app: NetworkModel<AppState> } }
>("projects/syncStatus", async (_, { getState, rejectWithValue, dispatch }) => {
  const state = getState();
  if (state?.app?.data?.auth?.user) {
    try {
      const token = state.app.data.auth.user.accessToken;
      const response = await getProjects(token);

      const projectsFromApi: ProjectModel[] = response.data.projects;
      const projectsFromState: ProjectModel[] = state.app.data.projects;

      for (let x = 0; x < projectsFromState.length; x++) {
        const ps = projectsFromState[x];
        if (!ps.syncronized) {
          // Has id
          if (ps.id) {
            const pa = projectsFromApi.find((a) => a.id === ps.id);

            // Triggered to be deleted
            if (ps.deleted && ps.id) {
              await deleteProject(ps.id, token);
              dispatch(actions.projectDeleted(ps));
              continue;
            }

            // Exists on api
            if (pa) {
              // Has newer dates than local
              if (
                pa.createdOn < ps.createdOn ||
                (ps.updatedOn && pa.updatedOn && pa.updatedOn < ps.updatedOn)
              ) {
                const updatedProject = await updateProject(ps, token);

                ps.id = pa.id;
                ps.key = pa.key;
                ps.name = pa.name;
                ps.createdOn = updatedProject.data.createdOn;
                ps.updatedOn = updatedProject.data.updatedOn;
                ps.deleted = false;
                ps.syncronized = true;
                dispatch(actions.projectUpdated(ps));
              }
            }
          } else {
            // Does not have an id -> add a project
            const addedProject = await addProject(ps.name, token);

            dispatch(
              actions.projectAdded({
                oldKey: ps.key,
                data: {
                  id: addedProject.data.id,
                  key: ps.key,
                  name: ps.name,
                  createdOn: addedProject.data.createdOn,
                  updatedOn: addedProject.data.updatedOn,
                  deleted: false,
                  syncronized: true,
                },
              })
            );
          }
        } else {
          // Deletes anything with and id but not on the api
          if (ps.id) {
            const ta = projectsFromApi.find((a) => a.id === ps.id);
            if (!ta) {
              dispatch(actions.projectDeleted(ps));
            }
          }

          // Deletes anything syncronized without id
          if (!ps.id) {
            dispatch(actions.projectDeleted(ps));
          }
        }
      }

      return response.data.projects;
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

export const addProjectAction = createAsyncThunk<
  CreateProjectModel,
  ProjectModel,
  { state: { app: NetworkModel<AppState> } }
>(
  "projects/addStatus",
  async (project: ProjectModel, { rejectWithValue, dispatch, getState }) => {
    const state = getState();
    const projectToAdd: ProjectModel = {
      id: project.id,
      key: project.key,
      name: project.name,
      deleted: project.deleted,
      createdOn: project.createdOn || new Date(),
      updatedOn: project.updatedOn,
      syncronized: false,
    };

    dispatch(actions.addProject(projectToAdd));

    if (state.app.online && state?.app?.data?.auth?.user) {
      try {
        const token = state.app.data.auth.user.accessToken;
        const response = await addProject(projectToAdd.name, token);
        dispatch(
          actions.projectAdded({
            oldKey: projectToAdd.key,
            data: response.data,
          })
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
      return projectToAdd;
    }
  }
);

export const updateProjectAction = createAsyncThunk<
  ProjectModel,
  ProjectModel,
  { state: { app: NetworkModel<AppState> } }
>(
  "projects/updateStatus",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const state = getState();
    if (state.app.online && state?.app?.data?.auth?.user) {
      try {
        const token = state.app.data.auth.user.accessToken;
        const response = await updateProject(data, token);
        dispatch(actions.projectUpdated(response.data));
        return response.data;
      } catch (err) {
        data.key = sanitizeUrl(data.name);
        dispatch(actions.updateProject(data));
        const error: AxiosError<any> = err;
        if (error.response?.status === 401) {
          dispatch(actions.logout());
          return rejectWithValue("You are not logged in.");
        } else return rejectWithValue("An error occurred, please try again.");
      }
    } else {
      data.key = sanitizeUrl(data.name);
      dispatch(actions.updateProject(data));
      return data;
    }
  }
);

export const deleteProjectAction = createAsyncThunk<
  ProjectModel,
  ProjectModel,
  { state: { app: NetworkModel<AppState> } }
>(
  "projects/deleteStatus",
  async (data, { rejectWithValue, dispatch, getState }) => {
    if (!data.id) {
      dispatch(actions.projectDeleted(data));
      return data;
    }
    const state = getState();
    if (state?.app?.data?.auth?.user) {
      try {
        const token = state.app.data.auth.user.accessToken;
        const response = await deleteProject(data.id, token);
        dispatch(actions.projectDeleted(data));
        return response.data;
      } catch (err) {
        dispatch(actions.deleteProject(data));
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
