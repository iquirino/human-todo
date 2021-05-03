import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Delete,
  UsePipes,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskListDto } from './dto/task.list.dto';
import { TaskDto } from './dto/task.dto';
import { CreateTaskDto } from './dto/task.create.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from '@user/dto/user.dto';

@Controller('api/tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  @UseGuards(AuthGuard())
  async findAll(@Req() req: any): Promise<TaskListDto> {
    const user = req.user as UserDto;
    const tasks = await this.taskService.getAllTasks(user);
    return { tasks };
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async findOneTask(@Param('id') id: string, @Req() req: any): Promise<TaskDto> {
    const user = req.user as UserDto;
    return await this.taskService.getTask(user, id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateTask(
    @Param('id') id: string,
    @Body() taskDto,
    @Req() req: any,
  ): Promise<TaskDto> {
    const user = req.user as UserDto;
    return await this.taskService.updateTask(user, id, taskDto);
  }

  @Get('project/:key')
  @UseGuards(AuthGuard())
  async findTasksByProjectKey(@Param('key') key: string, @Req() req: any): Promise<TaskListDto> {
    const user = req.user as UserDto;
    const tasks = await this.taskService.getTasksByProjectKey(user, key);
    return { tasks };
  }

  @Post('project/:key')
  @UseGuards(AuthGuard())
  async create(
    @Param('key') key: string,
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: any
  ): Promise<TaskDto> {
    const user = req.user as UserDto;
    return await this.taskService.createTask(user, key, createTaskDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async destory(@Param('id') id: string, @Req() req: any): Promise<TaskDto> {
    const user = req.user as UserDto;
    return await this.taskService.destoryTask(user, id);
  }
}
