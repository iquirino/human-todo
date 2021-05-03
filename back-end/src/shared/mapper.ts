import { TaskDto } from '@task/dto/task.dto';
import { ProjectEntity } from '@project/entity/project.entity';
import { ProjectDto } from '@project/dto/project.dto';
import { TaskEntity } from '@task/entity/task.entity';
import { UserEntity } from '@user/entity/user.entity';
import { UserDto } from '@user/dto/user.dto';

export const toProjectDto = (data: ProjectEntity): ProjectDto => {
  const { id, key, name, createdOn, updatedOn } = data;

  let projectDto: ProjectDto = {
    id,
    key,
    name,
    createdOn,
    updatedOn,
  };

  return projectDto;
};

export const toTaskDto = (data: TaskEntity): TaskDto => {
  const {
    id,
    description,
    projectId,
    finished,
    finishedDate,
    plannedFinishDate,
    createdOn,
    updatedOn,
  } = data;

  let taskDto: TaskDto = {
    id,
    description,
    projectId,
    finished,
    finishedDate,
    plannedFinishDate,
    createdOn,
    updatedOn,
  };

  return taskDto;
};

export const toUserDto = (data: UserEntity): UserDto => {
  const { id, username, email, createdOn, updatedOn } = data;

  let userDto: UserDto = {
    id,
    username,
    email,
    createdOn,
    updatedOn,
  };

  return userDto;
};
