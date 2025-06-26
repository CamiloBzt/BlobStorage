import PageProvider from '@/components/PageProvider/PageProvider';
import useBreadCrumb from '@/hooks/useBreadCrumb';
import Home from '@/pages';
import { render, screen } from '@testing-library/react';

jest.mock('../hooks/useBreadCrumb');

jest.mock('../constants', () => ({
  endpoints: {
    breadCrumb: {
      home: '/home',
    },
  },
}));

describe('Home Page', () => {
  const mockUpdatePaths = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useBreadCrumb as jest.Mock).mockReturnValue({
      updatePaths: mockUpdatePaths,
    });
  });

  it('should render the main components', () => {
    render(
      <PageProvider>
        <Home />
      </PageProvider>
    );

    expect(screen.getByText('Administrador de Blob Storage')).toBeInTheDocument();
  });
});
