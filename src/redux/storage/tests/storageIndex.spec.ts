import store from '@/redux/storage';
import { updateBreadcrumbs } from '@/redux/storage/slices/pageStatesSlice';

describe('Redux Store', () => {
  it('should update pageState when updateBreadcrumbs is dispatched', () => {
    store.dispatch(updateBreadcrumbs([]));

    const newState = store.getState().pageState;

    expect(newState.breadcrumbs.length).toBe(0);
  });
});
