export interface TaskModel {
  id?: string;
  projectId?: string;
  
  description: string;
  finished: boolean;
  plannedFinishDate?: Date;
  finishedDate?: Date;
  createdOn: Date;
  updatedOn?: Date;

  key: string;
  projectKey: string;
  syncronized: boolean;
  deleted: boolean;
}

export interface CreateTaskModel
  extends Omit<TaskModel, "id" | "key">,
    Pick<Partial<TaskModel>, "id" | "key"> {}
