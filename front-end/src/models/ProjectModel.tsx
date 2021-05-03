export interface ProjectModel {
  id?:string;
  key: string;
  name: string;
  
  syncronized: boolean;
  deleted: boolean;
  createdOn: Date;
  updatedOn?: Date;
}
export interface CreateProjectModel
  extends Omit<ProjectModel, "key">,
    Pick<Partial<ProjectModel>, "key"> {}
