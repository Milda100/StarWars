import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export type Film = {
  title: string;
  episode_id: string;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
};

export const fetchMovies = createAsyncThunk<Film[]>(
    'movies/fetchMovies',
    async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const res = await fetch("https://swapi.info/api/films");
        const data: Film[] = await res.json();
        return data;
    }
);

type MovieState = {
    movies: Film[];
    loading: boolean;
    error: string | null;
};

const initialState: MovieState = {
    movies: [],
    loading: false,
    error: null,
}

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
        })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.movies = action.payload;
            })
            .addCase(fetchMovies.rejected, (state) => {
                state.loading = false;
                state.error = 'Ups... Something went wrong';
            });
    },
});

export default moviesSlice.reducer;