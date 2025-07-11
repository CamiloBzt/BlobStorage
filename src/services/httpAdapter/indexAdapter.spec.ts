import AxiosAdapter from './AxiosAdapter';
import httpAdapter from './index';

jest.mock('./AxiosAdapter');

describe('httpAdapter', () => {
  it('should be an instance of AxiosAdapter', () => {
    expect(httpAdapter).toBeInstanceOf(AxiosAdapter);
  });

  it('should implement IHttpAdapter interface', () => {
    // Verifica que httpAdapter tenga los métodos definidos en IHttpAdapter
    expect(typeof httpAdapter.get).toBe('function');
    expect(typeof httpAdapter.post).toBe('function');
  });
});