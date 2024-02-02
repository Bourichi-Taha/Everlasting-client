import { useState, useEffect } from 'react';
import useSWRImmutable, { KeyedMutator } from 'swr';
import useApi, { ApiResponse, FetchApiOptions } from '@common/hooks/useApi';
import { Any, CrudApiRoutes, Id } from '@common/defs/types';

export type ItemsData<Item> = { items: Item[] };
export type ItemData<Item> = { item: Item };
export type ItemsResponse<Item> = ApiResponse<ItemsData<Item>>;
export type ItemResponse<Item> = ApiResponse<ItemData<Item>>;

export interface UseItemsHook<Item, CreateOneInput, UpdateOneInput> {
  items: Item[] | null;
  createOne: (_input: CreateOneInput, options?: FetchApiOptions) => Promise<ItemResponse<Item>>;
  readOne: (id: Id, options?: FetchApiOptions) => Promise<ItemResponse<Item>>;
  readAll: (options?: FetchApiOptions) => Promise<ItemsResponse<Item>>;
  updateOne: (
    id: Id,
    _input: UpdateOneInput,
    options?: FetchApiOptions
  ) => Promise<ItemResponse<Item>>;
  deleteOne: (id: Id, options?: FetchApiOptions) => Promise<ItemResponse<Item>>;
  mutate: KeyedMutator<Item[] | null>;
}

export interface UseItemsOptions {
  fetchItems?: boolean;
}
export const defaultOptions = {
  fetchItems: false,
};

export type UseItems<Item, CreateOneInput = Any, UpdateOneInput = Any> = (
  opts?: UseItemsOptions
) => UseItemsHook<Item, CreateOneInput, UpdateOneInput>;

const useItems = <Item, CreateOneInput, UpdateOneInput>(
  apiRoutes: CrudApiRoutes,
  opts: UseItemsOptions = defaultOptions
): UseItemsHook<Item, CreateOneInput, UpdateOneInput> => {
  const fetchApi = useApi();

  const { data, mutate } = useSWRImmutable<Item[] | null>(
    opts.fetchItems ? apiRoutes.ReadAll : null,
    async (_url: string) => {
      const response = await readAll();
      return response.data?.items ?? null;
    }
  );

  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    setItems(data ?? null);
  }, [data]);

  const createOne = async (input: CreateOneInput, options?: FetchApiOptions) => {
    const response = await fetchApi<ItemData<Item>>(apiRoutes.CreateOne, {
      method: 'POST',
      body: input,
      ...options,
    });

    if (response.success) {
      mutate();
    }

    return response;
  };

  const readOne = async (id: Id, options?: FetchApiOptions) => {
    const response = await fetchApi<ItemData<Item>>(
      apiRoutes.ReadOne.replace('{id}', id.toString()),
      options
    );

    return response;
  };

  const readAll = async (options?: FetchApiOptions) => {
    const response = await fetchApi<ItemsData<Item>>(apiRoutes.ReadAll, options);

    if (response.success) {
      setItems(response.data?.items ?? null);
    }

    return response;
  };

  const updateOne = async (id: Id, input: UpdateOneInput, options?: FetchApiOptions) => {
    const response = await fetchApi<ItemData<Item>>(
      apiRoutes.UpdateOne.replace('{id}', id.toString()),
      {
        method: 'PUT',
        body: input,
        ...options,
      }
    );

    if (response.success) {
      mutate();
    }

    return response;
  };

  const deleteOne = async (id: Id, options?: FetchApiOptions) => {
    const response = await fetchApi<ItemData<Item>>(
      apiRoutes.DeleteOne.replace('{id}', id.toString()),
      {
        method: 'DELETE',
        ...options,
      }
    );

    if (response.success) {
      mutate();
    }

    return response;
  };

  return {
    items,
    createOne,
    readOne,
    readAll,
    updateOne,
    deleteOne,
    mutate,
  };
};

export default useItems;
