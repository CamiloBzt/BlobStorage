import {
    CheckPointQueryResponse,
    CheckPointUploadResponse,
} from '@/types/checkPointTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const CHECKPOINT_API_KEY = 'TE_API_KEY_17217630134527ef9f59b39cb4e85a2bf3591636';

export const checkPointApi = createApi({
  reducerPath: 'checkPointApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://te.checkpoint.com/tecloud/api/v1',
    prepareHeaders: (headers) => {
      headers.set('Authorization', CHECKPOINT_API_KEY);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    uploadToCheckPoint: builder.mutation<CheckPointUploadResponse, FormData>({
      query: (formData) => ({
        url: '/file/upload',
        method: 'POST',
        body: formData,
      }),
    }),

    queryCheckPoint: builder.mutation<
      CheckPointQueryResponse,
      { md5: string; features: string[]; file_name: string }
    >({
      query: (params) => ({
        url: '/file/query',
        method: 'POST',
        body: {
          request: params,
        },
      }),
    }),
  }),
});

export const { useUploadToCheckPointMutation, useQueryCheckPointMutation } =
  checkPointApi;
