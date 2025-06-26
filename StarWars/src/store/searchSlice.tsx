import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { People } from "./charactersSlice";

type SearchState = {
  searchResults: People[];
  loading: boolean;
  error: string | null;
};

const initialState: SearchState = {
  searchResults: [],
  loading: false,
  error: null,
};

export const fetchSearchCharacters = createAsyncThunk<People[], string>(
  "search/searchCharacters",
  async (query: string) => {
    const res = await fetch(`https://swapi.py4e.com/api/people/?search=${query}`);
    if (!res.ok) {
      throw new Error("Failed to search characters");
    }
    const data = await res.json();
    return data.results;
  }
);

const searchSlice = createSlice({
  name: "searchCharacters", 
  initialState,
  reducers: {
    clearResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchCharacters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchCharacters.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.loading = false;
      })
      .addCase(fetchSearchCharacters.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to search characters";
      });
  },
});


export const { clearResults } = searchSlice.actions;
export default searchSlice.reducer;