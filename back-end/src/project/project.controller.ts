import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UsePipes,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProjectListDto } from './dto/project.list.dto';
import { ProjectDto } from './dto/project.dto';
import { CreateProjectDto } from './dto/project.create.dto';
import { ProjectService } from './project.service';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from '@user/dto/user.dto';
import { UpdatedProjectDto } from './dto/project.update.dto';

@Controller('api/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @UseGuards(AuthGuard())
  async findAll(@Req() req: any): Promise<ProjectListDto> {
    const user = req.user as UserDto;
    const projects = await this.projectService.getAllProject(user);
    return { projects };
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async findOne(@Param('id') id: string, @Req() req: any): Promise<ProjectDto> {
    const user = req.user as UserDto;
    return await this.projectService.getOneProject(user, id);
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: any,
  ): Promise<ProjectDto> {
    const user = req.user as UserDto;
    return await this.projectService.createProject(user, createProjectDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async update(
    @Param('id') id: string,
    @Body() projectDto,
    @Req() req: any,
  ): Promise<ProjectDto> {
    const user = req.user as UserDto;
    return await this.projectService.updateProject(user, id, projectDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async destory(@Param('id') id: string, @Req() req: any): Promise<ProjectDto> {
    const user = req.user as UserDto;
    return await this.projectService.destoryProject(user, id);
  }
}
