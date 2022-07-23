import { useEffect, useState } from "react";
import {v4 as uuidv4} from 'uuid'
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from './../../hooks/http.hook'
import { fetchFilters, selectAll } from "../../reducers/filtersSlice";
import { heroCreated } from "../../reducers/heroesSlice";
import store from '../../store/index'

const HeroesAddForm = () => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [element, setElem] = useState('');

    const {request} = useHttp()

    const dispatch = useDispatch()
    const {filtersFetchingStatus} = useSelector(state => state.filters)
    const filters = selectAll(store.getState());


    useEffect(() => {
        dispatch(fetchFilters())
    }, [])

    const onSubmitHandler = (e) => {
        e.preventDefault();

        const newHero = {
            id: uuidv4(),
            name,
            description,
            element
        }
        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(dispatch(heroCreated(newHero)))
        
        setName('')
        setDescription('')
        setElem('')
    }
    
    const renderOptions = (filter, filtersFetchingStatus) => {
        if (filtersFetchingStatus === 'loading') {
            return <option>Loading...</option>
        } else if (filtersFetchingStatus === 'error') {
            return <option>Error</option>
        } else if (filter && filter.length > 0) {
            // eslint-disable-next-line
            return (filter.map(item => {
                if (item.name === 'all') {
                    return;
                }
                return <option value={item.name} key={item.id}>{item.label}</option>
            }))
        }
            
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={(e) => onSubmitHandler(e)}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    onChange={(e) => setElem(e.target.value)}
                    value={element}>
                        <option >Я владею элементом...</option>
                        {renderOptions(filters, filtersFetchingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;