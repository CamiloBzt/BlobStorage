import { BlobListResponse, UploadResponse } from '@/types/blobTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = 'http://localhost:3000/service/pendig/transversales/sas/v1';

export const blobStorageApi = createApi({
  reducerPath: 'blobStorageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { endpoint }) => {
      if (endpoint !== 'uploadBlob') {
        headers.set('Content-Type', 'application/json');
      }
      return headers;
    },
  }),
  tagTypes: ['Blob'],
  endpoints: (builder) => ({
    listBlobs: builder.query<
      BlobListResponse,
      { containerName: string; directory?: string }
    >({
      query: (params) => ({
        url: '/blob/list',
        method: 'POST',
        body: params,
      }),
      transformResponse: (response: { data: BlobListResponse }) => response.data,
      providesTags: ['Blob'],
    }),

    uploadBlob: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: '/blob/upload',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: UploadResponse) => response,
      invalidatesTags: ['Blob'],
    }),

    downloadBlob: builder.mutation<
      Blob,
      { containerName: string; directory?: string; blobName: string }
    >({
      query: (params) => ({
        url: '/blob/download',
        method: 'POST',
        body: params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useListBlobsQuery,
  useUploadBlobMutation,
  useDownloadBlobMutation,
} = blobStorageApi;
