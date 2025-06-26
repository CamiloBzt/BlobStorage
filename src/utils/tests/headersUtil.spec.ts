import { addCustomHeaders } from '@/utils/headersUtil';
import httpAdapter from '@/services/httpAdapter';

jest.mock('../../services/httpAdapter');

describe('addCustomHeaders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add custom headers from httpAdapter.getHeaders', () => {
    (httpAdapter.getHeaders as jest.Mock).mockReturnValue({
      'x-custom-header': 'test-value',
      'x-another-header': 'another-value',
    });

    const headers = new Headers();
    headers.set('existing-header', 'existing-value');

    const updatedHeaders = addCustomHeaders(headers);

    expect(updatedHeaders.get('existing-header')).toBe('existing-value');
    expect(updatedHeaders.get('x-custom-header')).toBe('test-value');
    expect(updatedHeaders.get('x-another-header')).toBe('another-value');
  });

  it('should not modify headers if httpAdapter.getHeaders returns an empty object', () => {
    (httpAdapter.getHeaders as jest.Mock).mockReturnValue({});

    const headers = new Headers();
    headers.set('existing-header', 'existing-value');

    const updatedHeaders = addCustomHeaders(headers);

    expect(updatedHeaders.get('existing-header')).toBe('existing-value');

    const headerEntries = Array.from(updatedHeaders.entries());
    expect(headerEntries).toEqual([['existing-header', 'existing-value']]);
  });
});
