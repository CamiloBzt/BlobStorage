export interface User {
  id: string;
  name: string;
  doc: string;
}

export interface PageProviderProps {
  user?: User;
  children: React.ReactNode;
}
