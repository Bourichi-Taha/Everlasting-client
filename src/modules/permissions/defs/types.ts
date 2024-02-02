import { Id } from '@common/defs/types';

export enum ROLE {
  ADMIN = 'admin',
  USER = 'user',
}

export interface Permission {
  entity: string;
  action: string;
  entityId?: Id;
}
