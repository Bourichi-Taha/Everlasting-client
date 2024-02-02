import { CrudRoutes } from '@common/defs/types';

const prefix = '/events';
const Routes: CrudRoutes = {
  ReadAll: prefix,
  CreateOne: prefix + '/create',
  ViewOne: prefix + '/view/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  ReadAllOwn: prefix + '/my-events',
};

export default Routes;
