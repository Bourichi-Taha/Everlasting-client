import ApiRoutes from '@common/defs/apiRoutes';
import { Id } from '@common/defs/types';
import useApi, { ApiResponse, FetchApiOptions } from '@common/hooks/useApi';
import useItems, { UseItemsHook, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';
import { Event } from '@modules/events/defs/types';
import { Location } from '@modules/locations/defs/types';
import { Upload } from '@modules/uploads/defs/types';
import { Dayjs } from 'dayjs';

export interface CreateOneInput {
  name: string;
  locationId: Id;
  description: string;
  maxNumParticipants: number;
  date: string | Date;
  startTime: string;
  endTime: string;
  imageId: Id;
  categoryId: Id;
  image: File;
  country: string;
  city: string;
  stateProvince: string;
  address: string;
  postalCode: string;
}

export interface UpdateOneInput {
  name: string;
  locationId: Id;
  description: string;
  maxNumParticipants: number;
  date: string | Date | Dayjs;
  imageId?: Id;
  startTime: string;
  endTime: string;
  categoryId: Id;
  image?: File | Upload;
  location?: Location;
}
export interface Subscribe {
  eventId: number;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;
export type EventsData<Event> = { items: Event[] };
export type EventData<Event> = { item: Event };
interface UseEventsHook extends UseItemsHook<Event, CreateOneInput, UpdateOneInput> {
  readAllOwn: (options?: FetchApiOptions) => Promise<ApiResponse<EventsData<Event>>>; // fetch all events created by the user
  readAllRegistered: (options?: FetchApiOptions) => Promise<ApiResponse<EventsData<Event>>>; // fetch all events that the user registered in
  subscribe: (
    input: Subscribe,
    options?: FetchApiOptions
  ) => Promise<ApiResponse<EventsData<Event>>>;
  unsubscribe: (
    input: Subscribe,
    options?: FetchApiOptions
  ) => Promise<ApiResponse<EventsData<Event>>>;
  deleteOne: (id: Id, options?: FetchApiOptions) => Promise<ApiResponse<EventData<Event>>>;
}

const useEvents = (opts: UseItemsOptions = defaultOptions): UseEventsHook => {
  const apiRoutes = ApiRoutes.Events;
  const fetchApi = useApi();
  const useItemsHook = useItems<Event, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  const readAllOwn = async (options?: FetchApiOptions) => {
    const response = await fetchApi<EventsData<Event>>(apiRoutes.ReadAllOwn, options);

    if (response.success) {
      useItemsHook.mutate();
    }

    return response;
  };
  const readAllRegistered = async (options?: FetchApiOptions) => {
    const response = await fetchApi<EventsData<Event>>(apiRoutes.ReadAllRegistered, options);

    if (response.success) {
      useItemsHook.mutate();
    }

    return response;
  };
  const subscribe = async (input: Subscribe, options?: FetchApiOptions) => {
    const response = await fetchApi<EventsData<Event>>(apiRoutes.Subscribe, {
      method: 'POST',
      body: input,
      ...options,
    });

    if (response.success) {
      useItemsHook.mutate();
    }

    return response;
  };
  const unsubscribe = async (input: Subscribe, options?: FetchApiOptions) => {
    const response = await fetchApi<EventsData<Event>>(apiRoutes.Unsubscribe, {
      method: 'POST',
      body: input,
      ...options,
    });

    if (response.success) {
      useItemsHook.mutate();
    }

    return response;
  };
  const deleteOne = async (id: Id, options?: FetchApiOptions) => {
    const response = await fetchApi<EventData<Event>>(
      apiRoutes.Cancel.replace('{id}', id.toString()),
      {
        method: 'PUT',
        ...options,
      }
    );

    if (response.success) {
      useItemsHook.mutate();
    }

    return response;
  };

  return { ...useItemsHook, readAllOwn, readAllRegistered, unsubscribe, subscribe, deleteOne };
};

export default useEvents;
