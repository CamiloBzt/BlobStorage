import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Toast } from 'pendig-fro-transversal-lib-react';

export const transformErrorResponse = (error: FetchBaseQueryError) => {
  if ('status' in error || 'originalStatus' in error) {
    // Verificar si el status es un string y usar originalStatus si es necesario
    const status =
      typeof (error as { status: unknown }).status === 'string'
        ? (error as { originalStatus: number }).originalStatus
        : (error as { status: number }).status;

    Toast.showStatusCode(status);
  }
  return error;
};
