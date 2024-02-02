import { CrudRoutes } from '@common/defs/types';

const prefix = '/categories';
const Routes: CrudRoutes = {
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  CreateOne: prefix + '/create',
  UpdateOne: prefix + '/{id}',
};

export default Routes;
