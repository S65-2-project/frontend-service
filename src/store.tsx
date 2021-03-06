import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import auth from './reducers/AuthReducer';
import chat from './reducers/ChatReducer';

/**
 * creates the store with reducers and adds redux logging
 */
const store = createStore(combineReducers({
        auth,
        chat,
    }),
    loadFromLocalStorage(),
    applyMiddleware(thunk)
);

function saveToLocalStorage(state : any) {
    try {
        const serializedState = JSON.stringify(state)
        localStorage.setItem('state', serializedState)
    } catch (e) {
        console.log(e)
    }
}

function loadFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem('state')
        if (serializedState === null) return undefined
        return JSON.parse(serializedState)
    } catch (e) {
        console.log(e)
        return undefined
    }
}

store.subscribe(() => saveToLocalStorage(store.getState()))


export default store