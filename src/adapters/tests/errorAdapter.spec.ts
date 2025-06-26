import { transformErrorResponse } from '@/adapters/errorAdapter';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Toast } from 'pendig-fro-transversal-lib-react';

jest.mock('pendig-fro-transversal-lib-react', () => ({
  Toast: { showStatusCode: jest.fn() },
}));

describe('transformErrorResponse', () => {
  it('✔️ Should call Toast.showStatusCode with the error status', () => {
    const mockError: FetchBaseQueryError = { status: 404, data: 'Not Found' };

    const result = transformErrorResponse(mockError);

    expect(Toast.showStatusCode).toHaveBeenCalledWith(404);
    expect(result).toEqual(mockError);
  });

  it('❌ Should throw an error if the input is null or undefined', () => {
    expect(() => transformErrorResponse(null as any)).toThrow();
    expect(() => transformErrorResponse(undefined as any)).toThrow();
  });
});
