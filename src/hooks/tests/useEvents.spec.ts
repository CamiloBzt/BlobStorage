import { renderHook } from '@testing-library/react';
import useEvents from '../useEvents';
import httpAdapter from '@/services/httpAdapter';

jest.mock('../../services/httpAdapter');

describe('useEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set token when SET_TOKEN event is dispatched', () => {
    const token = 'test-token';
    const event = new CustomEvent('set-token', { detail: token });

    renderHook(() => useEvents());

    window.dispatchEvent(event);

    expect(httpAdapter.setToken).toHaveBeenCalledWith(token);
  });

  it('should remove event listener on unmount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useEvents());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'set-token',
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'set-token',
      expect.any(Function)
    );
  });
});
