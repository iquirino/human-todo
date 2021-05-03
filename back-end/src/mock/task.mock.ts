import { TaskEntity } from 'src/task/entity/task.entity';
import { projects } from './project.mock';
import { user } from './user.mock';

export const todos: TaskEntity[] = [
  {
    id: 'b91a5400-3cce-11e9-b210-d663bd873d93',
    description: 'Bring coffee',
    projectId: projects[0].id,
    ownerId: user.id,
    createdOn: new Date(),
  },
  {
    id: 'b91a56c6-3cce-11e9-b210-d663bd873d93',
    description: 'Bring banana',
    projectId: projects[0].id,
    ownerId: user.id,
    createdOn: new Date(),
  },
  {
    id: 'b91a5a90-3cce-11e9-b210-d663bd873d93',
    description: 'Bring chairs',
    projectId: projects[0].id,
    ownerId: user.id,
    createdOn: new Date(),
  },
  {
    id: 'b91a5bf8-3cce-11e9-b210-d663bd873d93',
    description: 'Bring tables',
    projectId: projects[0].id,
    ownerId: user.id,
    createdOn: new Date(),
  },
];
