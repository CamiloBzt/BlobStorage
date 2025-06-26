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

jest.mock('../hooks/useInstanceActionModal', () => ({
  useInstanceActionModal: () => ({
    openModal: jest.fn(),
    closeModal: jest.fn(),
    isOpen: false,
    actionItem: undefined,
    actionType: undefined,
  }),
}));

jest.mock('../hooks/useCancellationReasonModal', () => ({
  useCancellationReasonModal: () => ({
    showReason: jest.fn(),
    hideReason: jest.fn(),
    reasonItem: undefined,
    isOpen: false,
  }),
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

    expect(screen.getByText('Blob Storage')).toBeInTheDocument();
  });
});
