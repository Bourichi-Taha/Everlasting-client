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

export default Labels;
