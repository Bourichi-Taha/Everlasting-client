import ApiRoutes from '@common/defs/apiRoutes';
import { Upload } from '@modules/uploads/defs/types';
import useItems, { UseItems, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';

export interface CreateOneInput {
  name?: string;
  file: File;
}

export interface UpdateOneInput extends CreateOneInput {}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

const useUploads: UseItems<Upload, CreateOneInput, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Uploads;
  const useItemsHook = useItems<Upload, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  return useItemsHook;
};

export default useUploads;
