import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { CreateTaskDto } from './dto/task.create.dto';
import { TaskDto } from './dto/task.dto';
import { TaskEntity } from './entity/task.entity';
import { toTaskDto } from '@shared/mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectService } from '@project/project.service';
import { ProjectDto } from '@project/dto/project.dto';
import { UserDto } from '@user/dto/user.dto';
import { UsersService } from '@user/users.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepo: Repository<TaskEntity>,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    private readonly usersService: UsersService,
  ) {}

  async getAllTasks({ username }: UserDto): Promise<TaskDto[]> {
    const owner = await this.usersService.findOne({ where: { username } });
    const tasks = await this.taskRepo.find({ where: { owner } });
    return tasks.map((task) => toTaskDto(task));
  }

  async getTask({ username }: UserDto, id: string): Promise<TaskDto> {
    const owner = await this.usersService.findOne({ where: { username } });
    const task: TaskEntity = await this.taskRepo.findOne({
      where: { id, owner },
    });

    if (!task) {
      throw new HttpException(`Task doesn't exist`, HttpStatus.BAD_REQUEST);
    }

    return toTaskDto(task);
  }

  async getTasksByProjectKey(
    { username }: UserDto,
    key: string,
  ): Promise<TaskDto[]> {
    const owner = await this.usersService.findOne({ where: { username } });
    const tasks: TaskEntity[] = await this.taskRepo.find({
      where: { project: { key }, owner },
      relations: ['project'],
    });

    return tasks.map((task) => toTaskDto(task));
  }

  async createTask(
    user: UserDto,
    projectKey: string,
    taskDto: CreateTaskDto,
  ): Promise<TaskDto> {
    const { description } = taskDto;
    const owner = await this.usersService.findOne({
      where: { username: user.username },
    });

    const project: ProjectDto = await this.projectService.getOneProjectByKey(
      user,
      projectKey,
    );

    const task: TaskEntity = await this.taskRepo.create({
      description,
      project,
      owner,
    });

    await this.taskRepo.save(task);

    return toTaskDto(task);
  }

  async updateTask(
    { username }: UserDto,
    id: string,
    taskDto: TaskDto,
  ): Promise<TaskDto> {
    let {
      description,
      createdOn,
      finished,
      finishedDate,
      plannedFinishDate,
    } = taskDto;
    const owner = await this.usersService.findOne({ where: { username } });

    let task: TaskEntity = await this.taskRepo.findOne({
      where: { id, owner },
    });

    console.log("taskDto", taskDto)
    console.log("task", task);

    if (!task) {
      throw new HttpException(`Task doesn't exist`, HttpStatus.BAD_REQUEST);
    }

    if (!task.finished && finished) finishedDate = new Date();

    await this.taskRepo.update(
      { id },
      {
        id,
        description,
        finished,
        finishedDate,
        plannedFinishDate,
        createdOn: createdOn || new Date(),
        updatedOn: new Date(),
        projectId: task.projectId,
        owner: owner,
      },
    );

    task = await this.taskRepo.findOne({
      where: { id, owner },
    });

    return toTaskDto(task);
  }

  async destoryTask({ username }: UserDto, id: string): Promise<TaskDto> {
    const owner = await this.usersService.findOne({ where: { username } });
    const task: TaskEntity = await this.taskRepo.findOne({
      where: { id, owner },
    });

    if (!task) {
      throw new HttpException(`Task doesn't exist`, HttpStatus.BAD_REQUEST);
    }

    await this.taskRepo.delete({ id });
    return toTaskDto(task);
  }

  async destoryByProjectId(projectId: string) {
    await this.taskRepo.delete({ projectId });
  }
}
