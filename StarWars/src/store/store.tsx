import { configureStore } from '@reduxjs/toolkit'
import moviesReducer from './moviesSlice'
import charactersReducer from './charactersSlice'

export const store = configureStore({
    reducer: {
        movies: moviesReducer,
        characters: charactersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;