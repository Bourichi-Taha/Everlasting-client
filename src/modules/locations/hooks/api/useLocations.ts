import ApiRoutes from '@common/defs/apiRoutes';
import { Location } from '@modules/locations/defs/types';
import useItems, { UseItems, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';

export interface CreateOneInput {
  country: string;
  city: string;
  address: string;
  stateProvince: string;
  postalCode: string;
}

export interface UpdateOneInput extends CreateOneInput {}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

const useLocations: UseItems<Location, CreateOneInput, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Locations;
  const useItemsHook = useItems<Location, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  return useItemsHook;
};

export default useLocations;
