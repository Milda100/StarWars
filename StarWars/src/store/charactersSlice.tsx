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


export const fetchCharacters = createAsyncThunk<People[]>(
    'characters/fetchCharacters',
    async () => {
        const res = await fetch("https://swapi.info/api/people");
        const data: People[] = await res.json();
        return data;
    }
);

type CharacterState = {
    characters: People[];
    loading: boolean;
    error: string | null;
};

const initialState: CharacterState = {
    characters: [],
    loading: false,
    error: null,
}

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
                state.loading = false;
                state.characters = action.payload;
            })
            .addCase(fetchCharacters.rejected, (state) => {
                state.loading = false;
                state.error = 'Ups... Something went wrong';
            });
    },
});

export default charactersSlice.reducer;