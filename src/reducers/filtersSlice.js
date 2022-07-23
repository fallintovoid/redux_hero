import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import { useHttp } from "../hooks/http.hook"

export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    () => {
        const { request } = useHttp();
        return request("http://localhost:3001/filters")
    }
)

const filtersAdapter = createEntityAdapter();

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
})
// const initialState = {
//     filters: [],
//     filtersLoadingStatus: 'idle',
//     activeFilter: 'all'
// }

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        changeActiveFilter: (state, action) => {
            state.activeFilter = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchFilters.pending, state => {
                state.filtersLoadingStatus = 'loading'
            })
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle'
                filtersAdapter.setAll(state, action.payload)
            })
            .addCase(fetchFilters.rejected, state => {
                state.filtersLoadingStatus = 'error'
            })
    }
})

const {actions, reducer} = filterSlice;
export const { selectAll } = filtersAdapter.getSelectors(state => state.filters)
export { reducer }
export const {
    filtersFetched,
    filtersFetching,
    filtersFetchingError,
    changeActiveFilter
} = actions
