import { CrudRoutes } from '@common/defs/types';

const prefix = '/users';
const Routes: CrudRoutes = {
  ReadAll: prefix,
  CreateOne: prefix + '/create',
  UpdateOne: prefix + '/{id}',
  UpdateProfile: '/profile/edit',
  Profile: '/profile',
};

export default Routes;
