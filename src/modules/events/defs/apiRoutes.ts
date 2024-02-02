import { CrudApiRoutes } from '@common/defs/types';

const prefix = '/events';
const ApiRoutes: CrudApiRoutes = {
  CreateOne: prefix,
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  ReadAllOwn: prefix + '/my-events',
  ReadAllRegistered: prefix + '/registered',
  Subscribe: prefix + '/subscribe',
  Unsubscribe: prefix + '/unsubscribe',
  Cancel: prefix + '/cancel/{id}',
};

export default ApiRoutes;
