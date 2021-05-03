import { ProjectEntity } from 'src/project/entity/project.entity';
import { user } from './user.mock';

export const projects: ProjectEntity[] = [
  {
    id: 'eac400ba-3c78-11e9-b210-d663bd873d93',
    name: 'Supermarket Todo list',
    key: 'key-01',
    ownerId: user.id,
    createdOn: new Date(),
  },
  {
    id: 'eac40736-3c78-11e9-b210-d663bd873d93',
    name: 'Office Todo list',
    key: 'key-02',
    ownerId: user.id,
    createdOn: new Date(),
  },
  {
    id: 'eac408d0-3c78-11e9-b210-d663bd873d93',
    name: 'Traveling Todo  list',
    key: 'key-03',
    ownerId: user.id,
    createdOn: new Date(),
  },
  {
    id: 'eac40a7e-3c78-11e9-b210-d663bd873d93',
    name: 'Studying Todo list',
    key: 'key-04',
    ownerId: user.id,
    createdOn: new Date(),
  },
  {
    id: 'eac40c90-3c78-11e9-b210-d663bd873d93',
    name: 'Monday Todo list',
    key: 'key-05',
    ownerId: user.id,
    createdOn: new Date(),
  },
  {
    id: '5ea5f9ed-dd64-4e08-bdb6-d3d5-354fe48',
    name: 'My awesome todo list',
    key: 'key-06',
    ownerId: user.id,
    createdOn: new Date(),
  },
];
