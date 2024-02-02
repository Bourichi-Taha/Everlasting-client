import { CrudObject } from '@common/defs/types';

export interface Location extends CrudObject {
  country: string;
  city: string;
  address: string;
  stateProvince: string;
  postalCode: string;
}
