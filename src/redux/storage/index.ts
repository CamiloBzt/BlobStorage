import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { blobStorageApi } from './api/blobStorageApi';
import { checkPointApi } from './api/checkPointApi';
import pageStateReducer from './slices/pageStatesSlice';

const staticReducers = {
  pageState: pageStateReducer,
  [checkPointApi.reducerPath]: checkPointApi.reducer,
  [blobStorageApi.reducerPath]: blobStorageApi.reducer,
};

const apiMiddlewares = {
  [checkPointApi.reducerPath]: checkPointApi.middleware,
  [blobStorageApi.reducerPath]: blobStorageApi.middleware,
};

let store = null;
let injectReducer:
  | ((key: string, reducer: any, middleware?: any) => void)
  | null = null;

try {
  store = require('contenedor/store').default;
  injectReducer = require('contenedor/store').injectReducer;
} catch (error) {
  store = null;
}

// Estamos dentro del contenedor, inyectamos dinámicamente los reducers y sus middlewares
if (store && injectReducer) {
  Object.entries(staticReducers).forEach(([key, reducer]) => {
    const middleware = apiMiddlewares[key as keyof typeof apiMiddlewares] || null;
    injectReducer(key, reducer, middleware);
  });
} else {
  // Si no estamos en el contenedor, creamos una store local
  store = configureStore({
    reducer: combineReducers(staticReducers),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(...Object.values(apiMiddlewares)),
  });
}

export default store as ReturnType<typeof configureStore>;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
