import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { People } from './charactersSlice';

interface CharacterDetailState {
  character: People | null;
  loading: boolean;
  error: string | null;
}

const initialState: CharacterDetailState = {
  character: null,
  loading: false,
  error: null,
};

// Async thunk to fetch character details by ID
export const fetchCharacterById = createAsyncThunk(
  'characterDetail/fetchCharacterById',
  async (id: string, thunkAPI) => {
    try {
      const response = await fetch(`https://swapi.py4e.com/api/people/${id}/`);
      if (!response.ok) {
        throw new Error('Character not found');
      }
      const data = await response.json();
      return {
        ...data,
        id, // attach the ID manually
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const characterDetailSlice = createSlice({
  name: 'characterDetail',
  initialState,
  reducers: {
    clearCharacter: (state) => {
      state.character = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacterById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.character = null;
      })
      .addCase(fetchCharacterById.fulfilled, (state, action) => {
        state.loading = false;
        state.character = action.payload;
      })
      .addCase(fetchCharacterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.character = null;
      });
  },
});

export const { clearCharacter } = characterDetailSlice.actions;
export default characterDetailSlice.reducer;
