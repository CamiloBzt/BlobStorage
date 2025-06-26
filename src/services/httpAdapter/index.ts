import IHttpAdapter from './IHttpAdapter';
import AxiosAdapter from './AxiosAdapter';

const httpAdapter: IHttpAdapter = new AxiosAdapter();

export default httpAdapter;
