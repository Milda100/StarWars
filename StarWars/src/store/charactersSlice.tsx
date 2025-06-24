import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export type People = {
    id: string;
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  url: string;
};

type CharacterState = {
    characters: People[];
    loading: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
};

const initialState: CharacterState = {
    characters: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
}

export const fetchCharacters = createAsyncThunk<{ characters: People[]; page: number }, number>(
    'characters/fetchCharacters',
    async (page: number) => {
        const res = await fetch("https://swapi.info/api/people?page=${page}&limit=5");
        if (!res.ok) {
            throw new Error('Failed to fetch characters');
        }
        const data = await res.json();
        return {
            characters: data,
            page,
        }
    }
);

const charactersSlice = createSlice({
    name: 'characters',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCharacters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCharacters.fulfilled, (state, action) => {
                state.characters.push(...action.payload.characters);
                state.page = action.payload.page;
                state.hasMore = action.payload.characters.length > 0
                state.loading = false;
            })
            .addCase(fetchCharacters.rejected, (state) => {
                state.loading = false;
                state.error = 'Ups... Something went wrong';
            });
    },
});

export default charactersSlice.reducer;