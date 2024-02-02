import { CrudObject } from '@common/defs/types';
import { Location } from '@modules/locations/defs/types';
import { Upload } from '@modules/uploads/defs/types';
import { User } from '@modules/users/defs/types';

export interface Event extends CrudObject {
  name: string;
  location: Location;
  description: string;
  maxNumParticipants: number; // maximum number of registered users
  date: string;
  imageId?: number | undefined;
  image?: Upload | undefined;
  owner: User;
  categoryId: number;
  statusId: number;
  categoryName: string;
  registeredNumber: number; // number of users registered in an event
  registeredIds: number[]; // array of ids of registered users
  statusName: STATUS;
  duration: string;
  startTime: string;
  endTime: string;
}

export enum STATUS {
  UPCOMING = 'Upcoming',
  PAST = 'Past',
  CANCELED = 'Canceled',
  TODAY = 'Today',
}
