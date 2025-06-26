import useBreadCrumb from '@/hooks/useBreadCrumb';
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { BreadCrumb } from '../BreadCrumb';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../hooks/useBreadCrumb');

describe('BreadCrumb component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should render nothing if breadcrumbs is empty', () => {
    (useBreadCrumb as jest.Mock).mockReturnValue({
      breadcrumbs: undefined,
    });

    const { container } = render(<BreadCrumb />);
    expect(container.firstChild).toBeNull();
  });

  it('should render breadcrumb items when not empty', () => {
    (useBreadCrumb as jest.Mock).mockReturnValue({
      breadcrumbs: [
        { $label: 'Home' },
        { $label: 'Dashboard', $href: '/dashboard' },
        { $label: 'Profile', $href: '/profile' },
      ],
    });

    render(<BreadCrumb />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Home'));
    expect(mockPush).toHaveBeenCalledWith('/');

    fireEvent.click(screen.getByText('Dashboard'));
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});
