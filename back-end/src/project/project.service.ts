import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { ProjectEntity } from './entity/project.entity';
import { ProjectDto } from './dto/project.dto';
import { toProjectDto } from '@shared/mapper';
import { CreateProjectDto } from './dto/project.create.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserDto } from '@user/dto/user.dto';
import { UsersService } from '@user/users.service';
import { sanitizeUrl } from '@shared/utils';
import { UpdatedProjectDto } from './dto/project.update.dto';
import { TaskService } from '@task/task.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepo: Repository<ProjectEntity>,
    private readonly tasksService: TaskService,
    private readonly usersService: UsersService,
  ) {}

  async getAllProject({ username }: UserDto): Promise<ProjectDto[]> {
    const owner = await this.usersService.findOne({ where: { username } });
    const projects = await this.projectRepo.find({
      where: { owner },
    });
    return projects.map((project) => toProjectDto(project));
  }

  async getOneProject({ username }: UserDto, id: string): Promise<ProjectDto> {
    const owner = await this.usersService.findOne({ where: { username } });
    const project = await this.projectRepo.findOne({
      where: { id, owner },
    });

    if (!project) {
      throw new HttpException(`Project doesn't exist`, HttpStatus.BAD_REQUEST);
    }

    return toProjectDto(project);
  }

  async getOneProjectByKey(
    { username }: UserDto,
    key: string,
  ): Promise<ProjectDto> {
    const owner = await this.usersService.findOne({ where: { username } });
    const project = await this.projectRepo.findOne({
      where: { key, owner },
    });

    if (!project) {
      throw new HttpException(`Project doesn't exist`, HttpStatus.BAD_REQUEST);
    }

    return toProjectDto(project);
  }

  async createProject(
    { username }: UserDto,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectDto> {
    const { name } = createProjectDto;
    const owner = await this.usersService.findOne({ where: { username } });

    const key = sanitizeUrl(name);

    const countProjectKey = await this.projectRepo.count({
      where: { owner, key },
    });

    if (countProjectKey > 0) {
      throw new HttpException(
        `Project key already had been used by you`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const project: ProjectEntity = await this.projectRepo.create({
      name,
      key,
      owner,
    });

    await this.projectRepo.save(project);

    return toProjectDto(project);
  }

  async updateProject(
    { username }: UserDto,
    id: string,
    projectDto: UpdatedProjectDto,
  ): Promise<ProjectDto> {
    let { name, updatedOn } = projectDto;
    const owner = await this.usersService.findOne({ where: { username } });

    let project: ProjectEntity = await this.projectRepo.findOne({
      where: { id, owner },
    });

    if (!project) {
      throw new HttpException(`Project doesn't exist`, HttpStatus.BAD_REQUEST);
    }

    const key = sanitizeUrl(name);

    const countProjectKey = await this.projectRepo.count({
      where: {
        key,
        id: Not(id),
      },
    });

    if (countProjectKey > 0) {
      throw new HttpException(
        `Project key already had been used by you`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!updatedOn) updatedOn = new Date();

    await this.projectRepo.update(
      { id },
      {
        id,
        key,
        name,
        createdOn: project.createdOn,
        updatedOn,
        owner,
      },
    );

    project = await this.projectRepo.findOne({
      where: { id },
    });

    return toProjectDto(project);
  }

  async destoryProject({ username }: UserDto, id: string): Promise<ProjectDto> {
    const project: ProjectEntity = await this.projectRepo.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!project) {
      throw new HttpException(`Project doesn't exist`, HttpStatus.BAD_REQUEST);
    }

    await this.tasksService.destoryByProjectId(project.id);

    await this.projectRepo.delete({ id });

    return toProjectDto(project);
  }
}
