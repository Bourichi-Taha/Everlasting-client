import { CrudLabels } from '@common/defs/types';

interface EventsLabels extends CrudLabels {
  ViewOne: string;
}
const Labels: EventsLabels = {
  CreateNewOne: 'Créer un nouvel événement',
  NewOne: 'Nouvel événement',
  ReadAll: 'Liste des événements',
  Items: 'Événements',
  EditOne: "Éditer l'événement",
  ViewOne: "Voir l'événement",
};
export const EventsInputLabels = {
  category: 'Catégorie',
  endTime: 'Heure de Fin',
  startTime: 'Heure de Début',
  date: 'Date',
  maxNumParticipants: 'Maximum Participants',
  description: 'Description',
  address: 'Adresse',
  postalCode: 'Code Postal',
  city: 'Ville',
  stateProvince: 'État Province',
  country: 'Pays',
  name: 'Titre',
};

export default Labels;
