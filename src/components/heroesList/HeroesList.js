import {useHttp} from '../../hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect'

import { heroesFetchingError, heroDeleted, fetchHeroes, selectAll } from '../../reducers/heroesSlice'
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

const HeroesList = () => {
    
    const filteredHeroesSelector = createSelector(
        (state) => state.filters.activeFilter,
        selectAll,
        (activeFilter, heroes) => {
            console.log(heroes)
            if (activeFilter === 'all') {
                return heroes
            } else {
                return heroes.filter(item => item.element === activeFilter)
            }
        }
    )

    const filteredHeroes = useSelector(filteredHeroesSelector)
    const {heroesLoadingStatus} = useSelector(state => state.heroes);
    const dispatch = useDispatch();
    const { request } = useHttp();

    const deleteHeroes = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(console.log)
            .then(dispatch(heroDeleted(id)))
            .catch(() => dispatch(heroesFetchingError()))
            // eslint-disable-next-line
    }, [request])

    useEffect(() => {
        dispatch(fetchHeroes())
        // eslint-disable-next-line
    }, []);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map(({id, ...props}) => {
            //eslint-disable-next-line
            return <HeroesListItem key={id} {...props} onClick={() => deleteHeroes(id)}/>
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;