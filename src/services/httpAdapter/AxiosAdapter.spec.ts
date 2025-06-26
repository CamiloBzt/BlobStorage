import axios from 'axios';
import AxiosAdapter from './AxiosAdapter';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AxiosAdapter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a GET request and return data', async () => {
    const mockData = { data: 'test data' };
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockData }),
      post: jest.fn(),
      interceptors: {
        request: {
          use: (fn: Function) => {
            let config = { headers: {} };
            config = fn(config);
          },
        },
        response: {
          use: (fn: Function, err: (error: any) => Promise<any>) => {
            const error = {
              request: 'error',
              status: 500,
              message: 'Test error',
            };
            err(error).catch(() => {
              console.log({ error });
            });
            fn();
          },
        },
      },
    } as any);

    const axiosAdapter = new AxiosAdapter();

    const result = await axiosAdapter.get('https://api.example.com/data');

    expect(mockedAxios.create().get).toHaveBeenCalledWith(
      'https://api.example.com/data',
      undefined
    );
    expect(result).toEqual(mockData);
  });

  it('should make a POST request and return data', async () => {
    const mockData = { data: 'test data' };
    mockedAxios.create.mockReturnValue({
      get: jest.fn(),
      post: jest.fn().mockResolvedValue({ data: mockData }),
      interceptors: {
        request: {
          use: (fn: Function) => {
            let config = { headers: {} };
            config = fn(config);
          },
        },
        response: {
          use: (fn: Function, err: (error: any) => Promise<any>) => {
            const error = {
              request: 'error',
              status: 500,
              message: 'Test error',
            };
            err(error).catch(() => {
              console.log({ error });
            });
            fn();
          },
        },
      },
    } as any);

    const axiosAdapter = new AxiosAdapter();

    const result = await axiosAdapter.post('https://api.example.com/data', {});

    expect(mockedAxios.create().post).toHaveBeenCalledWith(
      'https://api.example.com/data',
      {},
      undefined
    );
    expect(result).toEqual(mockData);
  });

  it('should make a POST request and return data', async () => {
    const mockData = { data: 'test data' };
    mockedAxios.create.mockReturnValue({
      get: jest.fn(),
      post: jest.fn().mockResolvedValue({ data: mockData }),
      interceptors: {
        request: {
          use: (fn: Function) => {
            let config = { headers: {} };
            config = fn(config);
          },
        },
        response: {
          use: (fn: Function, err: (error: any) => Promise<any>) => {
            const error = {
              request: 'error',
              message: 'Test error',
            };
            err(error).catch(() => {
              console.log({ error });
            });
            fn();
          },
        },
      },
    } as any);

    const axiosAdapter = new AxiosAdapter();
    axiosAdapter.setXChannel('test');
    axiosAdapter.setXIdentSerialNum('12334434343433434');
    axiosAdapter.setXCompanyId('123');
    axiosAdapter.setXGovIssueIdentType('123');
    axiosAdapter.setXIdentSerialNumAuthorization(123);
    axiosAdapter.setXIPAddr('127.0.0.1');
    axiosAdapter.setToken('sgfgsfgsdfgsdfgsdfgsdf');
    axiosAdapter.setXSessKey('123');
    axiosAdapter.setXAgency('123');
    axiosAdapter.setXUserId('123');
    axiosAdapter.setXCustLoginId('123');

    const result = await axiosAdapter.post('https://api.example.com/data', {});

    expect(mockedAxios.create().post).toHaveBeenCalledWith(
      'https://api.example.com/data',
      {},
      undefined
    );
    expect(result).toEqual(mockData);
  });
  it('✔️ Should return the correct token after setting it', () => {
    const mockToken = 'test-token-123';
    const axiosAdapter = new AxiosAdapter();

    axiosAdapter.setToken(mockToken);
    const token = axiosAdapter.getToken();

    expect(token).toBe(mockToken);
  });
});
