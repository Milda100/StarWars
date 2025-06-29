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
	  films: string[];

	};
	type CharacterState = {
	    characters: People[];
	    loading: boolean;
	    error: string | null;
	    page: number;
	    hasMore: boolean;
	    fetchedPages: number[];
        totalCount?: number;

	};
	const initialState: CharacterState = {
	    characters: [],
	    loading: false,
	    error: null,
	    page: 1,
	    hasMore: true,
	    fetchedPages: [] as number[],
        totalCount: undefined,
	}
	export const fetchCharacters = createAsyncThunk<{ characters: People[]; page: number; totalCount?: number }, number>(
	    'characters/fetchCharacters',
	    async (page: number) => {
	        const res = await fetch(`https://swapi.py4e.com/api/people/?page=${page}`);
	        if (!res.ok) {
	            throw new Error('Failed to fetch characters');
	        }
	        const data = await res.json();
	        return {
	            characters: data.results,
	            page,
                totalCount: page === 1 ? data.count : undefined, // only on first fetch
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
                    const { characters, page, totalCount } = action.payload;
                    if (!state.fetchedPages.includes(page)) {
                        state.characters.push(...characters);
                        state.fetchedPages.push(page);
                        state.page = page;
                    }

                    // Store total count only once
                    if (totalCount) {
                        state.totalCount = totalCount;
                    }

                    // If we've fetched all characters, stop
                    if (state.totalCount && state.characters.length >= state.totalCount) {
                        state.hasMore = false;
                    } else {
                        state.hasMore = characters.length > 0;
                    }

                    state.loading = false;
                    })
	            .addCase(fetchCharacters.rejected, (state) => {
	                state.loading = false;
	                state.error = 'Ups... Something went wrong';
	            });
	    },
	});
export default charactersSlice.reducer;