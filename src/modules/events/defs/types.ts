import { CrudObject, Id } from '@common/defs/types';
import { Location } from '@modules/locations/defs/types';
import { Upload } from '@modules/uploads/defs/types';
import { User } from '@modules/users/defs/types';

export interface Event extends CrudObject {
  name: string;
  location: Location;
  description: string;
  maxNumParticipants: number; // maximum number of registered users
  date: string;
  imageId?: Id;
  image?: Upload;
  owner: User;
  categoryId: Id;
  categoryName: string;
  registeredNumber: number; // number of users registered in an event
  registeredIds: Id[]; // array of ids of registered users
  statusName: STATUS;
  duration: string;
  startTime: string;
  endTime: string;
}

export enum STATUS {
  UPCOMING = 'upcoming',
  PAST = 'past',
  CANCELED = 'canceled',
  TODAY = 'today',
}
