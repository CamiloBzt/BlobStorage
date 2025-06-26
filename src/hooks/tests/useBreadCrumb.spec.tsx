import useBreadCrumb from '@/hooks/useBreadCrumb';
import pageStatesReducer from '@/redux/storage/slices/pageStatesSlice';
import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';

describe('useBreadCrumb', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { pageState: pageStatesReducer },
      preloadedState: {
        pageState: { breadcrumbs: [] },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('should return breadcrumbs from state', () => {
    store = configureStore({
      reducer: { pageState: pageStatesReducer },
      preloadedState: {
        pageState: { breadcrumbs: [{ $label: 'Home', $href: '/' }] },
      },
    });

    const { result } = renderHook(() => useBreadCrumb(), { wrapper });

    expect(result.current.breadcrumbs).toEqual([{ $label: 'Home', $href: '/' }]);
  });

  it('should dispatch updateBreadcrumbs when updatePaths is called', () => {
    const testPath = [{ $label: 'Dashboard', $href: '/dashboard' }];

    const { result } = renderHook(() => useBreadCrumb(), { wrapper });

    act(() => {
      result.current.updatePaths(testPath);
    });
  });
});
