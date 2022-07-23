import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from "../hooks/http.hook";

// const initialState = {
//     heroes: [],
//     heroesLoadingStatus: 'idle',
// }

const heroesAdapter = createEntityAdapter()

const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle'
})

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    () => {
        const { request } = useHttp();
        return request("http://localhost:3001/heroes")
    }
)

const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        heroCreated: (state, action) => {
            heroesAdapter.addOne(state, action.payload)
        },
        heroDeleted: (state, action) => {
            heroesAdapter.removeOne(state, action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeroes.pending, state => {
                state.heroesLoadingStatus = 'loading'
            })
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = 'idle'
                heroesAdapter.setAll(state, action.payload)
            })
            .addCase(fetchHeroes.rejected, state => {
                state.heroesLoadingStatus = 'error'
            })
            .addDefaultCase(() => {})
    }
});

const {actions, reducer} = heroesSlice;
export { reducer }
export const { selectAll } = heroesAdapter.getSelectors(state => state.heroes)
export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions