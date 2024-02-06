import { STATUS } from './types';

export const STATUS_OPTIONS = [
  { value: STATUS.CANCELED, label: 'Annulé' },
  { value: STATUS.PAST, label: 'Passé' },
  { value: STATUS.UPCOMING, label: 'Avenir' },
  { value: STATUS.TODAY, label: "Aujourd'hui" },
];
