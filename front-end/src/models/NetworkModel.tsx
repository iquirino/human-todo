export interface NetworkModel<T> {
  online: boolean;
  data: T;
}

export interface NetworkContainerModel{
  online: boolean;
  trackers: any[];
}