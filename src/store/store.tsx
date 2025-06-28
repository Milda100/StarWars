import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./moviesSlice";
import charactersReducer from "./charactersSlice";
import searchReducer from "./searchSlice";
import characterDetailReducer from "./characterDetailSlice";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    characters: charactersReducer,
    search: searchReducer,
    characterDetail: characterDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
