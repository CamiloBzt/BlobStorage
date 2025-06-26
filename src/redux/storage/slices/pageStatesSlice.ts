import { createSlice } from '@reduxjs/toolkit';
import { BreadcrumbItem } from 'pendig-fro-transversal-lib-react/dist/components/Breadcrumb/IBreadcrumb';

export interface PageStateHistory {
  breadcrumbs: BreadcrumbItem[];
}
const initialState: PageStateHistory = {
  breadcrumbs: [],
};

const pageStateSlice = createSlice({
  name: 'pageState',
  initialState,
  reducers: {
    updateBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
  },
});

export const { updateBreadcrumbs } = pageStateSlice.actions;

export default pageStateSlice.reducer;
