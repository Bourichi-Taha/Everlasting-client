export type Id = number;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

export interface AnyObject {
  [key: string]: Any;
}

export interface CrudObject extends AnyObject {
  id: Id;
  createdAt: string;
  updatedAt: string;
}

export interface CrudRow extends AnyObject {
  id: Id;
}

export interface CrudRoutes {
  ReadAll: string;
  CreateOne: string;
  UpdateOne: string;
  [key: string]: Any;
}

export interface CrudApiRoutes {
  CreateOne: string;
  ReadAll: string;
  ReadOne: string;
  UpdateOne: string;
  DeleteOne: string;
  [key: string]: string;
}

export enum CRUD_ACTION {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export interface CrudLabels {
  CreateNewOne: string;
  NewOne: string;
  ReadAll: string;
  Items: string;
  EditOne: string;
}
