import { Any } from '@common/defs/types';
import useProgressBar from '@common/hooks/useProgressBar';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  errors?: string[];
  data?: T;
}

export interface FetchApiOptions {
  verbose?: boolean;
  displaySuccess?: boolean;
  displayProgress?: boolean;
  softDelete?: boolean;
}

export interface ApiOptions extends FetchApiOptions {
  headers?: HeadersInit;
  body?: Any;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  formData?: boolean;
}

const useApi = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { start, stop } = useProgressBar();

  const fetchApi = useCallback(
    async <T>(endpoint: string, options?: ApiOptions): Promise<ApiResponse<T>> => {
      const displayProgress = options?.displayProgress ?? false;
      if (displayProgress) {
        start();
      }
      const authToken = localStorage.getItem('authToken');
      const headers: Headers = new Headers();
      headers.set('Accept', 'application/json');
      if (!options?.formData) {
        headers.set('Content-Type', 'application/json');
      }
      if (authToken) {
        headers.set('Authorization', `Bearer ${authToken}`);
      }
      if (options?.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          headers.set(key, value as string);
        });
      }

      const method = options?.method ?? (options?.body ? 'POST' : 'GET');
      const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
      const verbose = options?.verbose ?? false;

      if (verbose) {
        console.log(`useApi: requesting ${url}`, options);
      }
      let body;
      if (options?.body) {
        if (options.formData) {
          body = options.body;
        } else {
          body = JSON.stringify(options.body);
        }
      }
      const response = await fetch(url, {
        method,
        headers,
        body,
      });
      const jsonResponse: ApiResponse<T> = await response.json();
      if (verbose) {
        console.log(`useApi: response`, response);
      }
      if (!jsonResponse.success && !jsonResponse.errors) {
        jsonResponse.success = false;
        jsonResponse.errors = ['Une erreur est survenue'];
      }
      const displaySuccess = options?.displaySuccess ?? false;
      if (!jsonResponse.success) {
        if (jsonResponse.errors) {
          for (let i = 0; i < jsonResponse.errors.length; i++) {
            enqueueSnackbar(jsonResponse.errors[i], { variant: 'error' });
          }
        } else {
          enqueueSnackbar('Une erreur est survenue', { variant: 'error' });
        }
      } else if (displaySuccess && jsonResponse.message) {
        enqueueSnackbar(jsonResponse.message, { variant: 'success' });
      }
      if (displayProgress) {
        stop();
      }
      return jsonResponse;
    },
    [enqueueSnackbar]
  );

  return fetchApi;
};

export default useApi;
