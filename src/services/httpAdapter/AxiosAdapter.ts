import CustomError from '@/utils/Error';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import { v4 as uuidv4 } from 'uuid';
import IHttpAdapter from './IHttpAdapter';

interface Headers {
  'Content-Type': string;
  Accept: string;
  'X-RqUID': string;
  'X-Channel': string;
  'X-IdentSerialNum': string;
  'X-CompanyId': string;
  'X-IPAddr': string;
  'X-GovIssueIdentType': string;
  'X-IdentSerialNumAuthorization': number;
  'X-SessKey': string;
  'X-Languaje': string;
  'X-Version': string;
  'X-KeyAcctId': string;
  'X-UserId': string;
  'X-Agency': string;
  'X-CustLoginId': string;
  Authorization?: string;
}

const INITIALS_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-RqUID': '-',
  'X-Channel': 'PENDIG',
  'X-IdentSerialNum': '-',
  'X-GovIssueIdentType': 'CC',
  'X-CompanyId': 'PORVENIR',
  'X-IPAddr': '127.0.0.1',
  'X-IdentSerialNumAuthorization': 80014,
  'X-SessKey': '121654654656',
  'X-CustLoginId': '-',
  'X-Languaje': 'es',
  'X-Version': '1.0.0',
  'X-KeyAcctId': '800144331',
  'X-UserId': 'oer5g8dfg5gdfg5gdfg5gdfg5gdfg',
  'X-Agency': '10012',
  'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_OCP_APIM_SUBSCRIPTION_KEY,
  'X-Real-IP': '10.227.2.24',
  'X-Original-Forwarded-For': '10.227.1.101,10.227.1.229 58328,10.227.1.101',
};

class AxiosAdapter implements IHttpAdapter {
  private readonly axiosInstance: AxiosInstance;

  private headers: Headers = INITIALS_HEADERS;

  private token: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      headers: this.headers as unknown as AxiosRequestHeaders,
    });
    this.setInteceptor();
  }

  private setInteceptor(): void {
    this.axiosInstance.interceptors.request.use((config) => {
      config.headers = {
        ...this.headers,
        ...config.headers,
      } as unknown as AxiosRequestHeaders;
      config.headers['X-RqUID'] = uuidv4();
      config.headers['Authorization'] = `Bearer ${this.token}`;
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        let customError: CustomError | AxiosError = error;
        if (error.request) {
          customError = new CustomError(error.message, error?.status ?? 500);
        }

        return Promise.reject(customError);
      }
    );
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  setXChannel(value: string): void {
    this.headers['X-Channel'] = value;
  }

  setXIdentSerialNum(value: string): void {
    this.headers['X-IdentSerialNum'] = value;
  }

  setXCompanyId(value: string): void {
    this.headers['X-CompanyId'] = value;
  }

  setXIPAddr(value: string): void {
    this.headers['X-IPAddr'] = value;
  }

  setXGovIssueIdentType(value: string): void {
    this.headers['X-GovIssueIdentType'] = value;
  }

  setXIdentSerialNumAuthorization(value: number): void {
    this.headers['X-IdentSerialNumAuthorization'] = value;
  }

  setXSessKey(value: string): void {
    this.headers['X-SessKey'] = value;
  }

  setXUserId(value: string): void {
    this.headers['X-UserId'] = value;
  }

  setXAgency(value: string): void {
    this.headers['X-Agency'] = value;
  }

  setXCustLoginId(value: string): void {
    this.headers['X-CustLoginId'] = value;
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  getHeaders() {
    this.headers['X-RqUID'] = uuidv4();
    this.headers['Authorization'] = `Bearer ${this.token}`;
    return this.headers;
  }
}

export default AxiosAdapter;
