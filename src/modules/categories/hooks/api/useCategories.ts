import ApiRoutes from '@common/defs/apiRoutes';
import { Category } from '@modules/categories/defs/types';
import useItems, { UseItems, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';

export interface CreateOneInput {
  name: string;
}

export interface UpdateOneInput {
  name: string;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

const useCategories: UseItems<Category, CreateOneInput, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Categories;
  const useItemsHook = useItems<Category, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  return useItemsHook;
};

export default useCategories;
