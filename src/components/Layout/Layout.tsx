import useEvents from '@/hooks/useEvents';
import httpAdapter from '@/services/httpAdapter';
import { useEffect } from 'react';
import styles from './Layout.module.scss';
import { LayoutProps } from './Layout.types';

const Layout = ({ user, children }: LayoutProps) => {
  const { id, name, doc } = user || { id: '', name: '', doc: '' };
  useEvents();

  useEffect(() => {
    if (id) {
      httpAdapter.setXUserId(id);
      httpAdapter.setXCustLoginId(name);
      httpAdapter.setXIdentSerialNum(doc);
    }
  }, [id]);
  return <div className={styles.layout_container}>{children}</div>;
};

export default Layout;
