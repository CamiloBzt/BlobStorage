import httpAdapter from '@/services/httpAdapter';

export const addCustomHeaders = (headers: Headers): Headers => {
  const customHeaders = httpAdapter.getHeaders();
  Object.entries(customHeaders).forEach(([key, value]) => {
    headers.set(key, value as string);
  });
  return headers;
};
