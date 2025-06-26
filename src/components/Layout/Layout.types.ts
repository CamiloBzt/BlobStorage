import { User } from '../PageProvider/PageProvider.types';

export interface LayoutProps {
  user?: User;
  children: React.ReactNode;
}
