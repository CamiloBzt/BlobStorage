import store from '@/redux/storage';
import { Provider } from 'react-redux';
import Layout from '../Layout/Layout';
import { PageProviderProps } from './PageProvider.types';

const PageProvider = ({ user, children }: PageProviderProps) => {
  return (
    <Provider store={store}>
      <Layout user={user}>{children}</Layout>
    </Provider>
  );
};

export default PageProvider;
