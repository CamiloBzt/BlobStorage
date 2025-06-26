interface IHttpAdapter {
  get<T>(url: string, config?: any): Promise<T>;
  post<T>(url: string, data: any, config?: any): Promise<T>;
  setToken(token: string): void;
  getToken: () => string | null;
  getHeaders: () => any;
  setXChannel(value: string): void;
  setXIdentSerialNum(value: string): void;
  setXCompanyId(value: string): void;
  setXIPAddr(value: string): void;
  setXGovIssueIdentType(value: string): void;
  setXIdentSerialNumAuthorization(value: number): void;
  setXSessKey(value: string): void;
  setXUserId(value: string): void;
  setXAgency(value: string): void;
  setXCustLoginId(value: string): void;
}

export default IHttpAdapter;
