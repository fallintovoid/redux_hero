
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

import { useDispatch, useSelector } from "react-redux";
import { changeActiveFilter, selectAll } from "../../reducers/filtersSlice";
import store from '../../store/index'
import Spinner from "../spinner/Spinner";

const HeroesFilters = () => {
    const dispatch = useDispatch()
    const {filtersLoadingStatus, activeFilter} = useSelector(state => state.filters)
    const filters = selectAll(store.getState())

    const renderFilters = (filters, filtersLoadingStatus) => {
        let active;
        if (filtersLoadingStatus === 'loading') {
            return <Spinner/>
        } else if (filtersLoadingStatus === 'error') {
            return <h1>Error</h1>
        } else if (filters && filters.length > 0) {
           
            return filters.map(item =>
                (<button 
                    key={item.id}
                    className={`btn ${item.className} `}
                    onClick={() => dispatch(changeActiveFilter(item.name))}
                    >{item.label}</button>)
            )
        }
    }

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {renderFilters(filters, filtersLoadingStatus)}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;