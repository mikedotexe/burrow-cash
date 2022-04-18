import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import assetsReducer from "./assetsSlice";
import accountReducer from "./accountSlice";
import appReducer from "./appSlice";
import feedReducer from "./feedSlice";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["feed"],
};

const rootReducer = combineReducers({
  assets: assetsReducer,
  account: accountReducer,
  app: appReducer,
  feed: feedReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
