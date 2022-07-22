import { heroesFetched, heroesFetching, heroesFetchingError } from "../reducers/heroesSlice"
import { filtersFetched, filtersFetching, filtersFetchingError } from "../reducers/filtersSlice"

export const filtersStartFetch = (request) => (dispatch) => {
    dispatch(filtersFetching())
    request("http://localhost:3001/filters")
        .then(data => dispatch(filtersFetched(data)))
        .catch(dispatch(filtersFetchingError()))
}

export const heroesStartFetch = (request) => (dispatch) => {
    dispatch(heroesFetching());
    request("http://localhost:3001/heroes")
        .then(data => dispatch(heroesFetched(data)))
        .catch(() => dispatch(heroesFetchingError()))
}
