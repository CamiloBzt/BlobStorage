import Layout from '@/components/Layout/Layout';
import store from '@/redux/storage';
import App, { AppContext, AppProps } from 'next/app';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import '../styles/BlobStorageAdmin.scss';
import '../styles/globals.scss';

export const safeRedirect = (url: string, pageProps: AppProps['pageProps']) => {
  const allowedDomains = pageProps.environments.NEXT_PUBLIC_URL_HOST;

  if (!url.includes(allowedDomains)) {
    const regex = /\/blob-storage(\/.*)/;
    const match = url.match(regex);

    if (match && match[1]) {
      const newPath = match[1];
      const newUrl = allowedDomains + newPath;
      window.location.replace(newUrl);
    } else {
      window.location.replace(allowedDomains);
    }
  }
};

function MyApp({ Component, pageProps }: AppProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!isDevelopment) {
      const redirectUrl = window.location.href;
      safeRedirect(redirectUrl, pageProps);
    }
  }, [pageProps]);

  return isDevelopment ? (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  ) : null;
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const NEXT_PUBLIC_URL_HOST = process.env.NEXT_PUBLIC_URL_HOST;
  const NEXT_PUBLIC_URL_BASE_HOST = process.env.NEXT_PUBLIC_URL_BASE_HOST;

  const appProps = await App.getInitialProps(appContext);

  const environments = {
    NEXT_PUBLIC_URL_HOST,
    NEXT_PUBLIC_URL_BASE_HOST,
  };

  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      environments,
    },
  };
};

export default MyApp;
