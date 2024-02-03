import { CrudObject, Id } from '@common/defs/types';
import { ROLE } from '@modules/permissions/defs/types';
import { Upload } from '@modules/uploads/defs/types';

export interface User extends CrudObject {
  email: string;
  rolesNames: ROLE[];
  permissionsNames: string[];
  username: string;
  avatar?: Upload;
  imageId?: Id;
}
