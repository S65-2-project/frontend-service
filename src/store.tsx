import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import auth from './reducers/AuthReducer';

/**
 * creates the store with reducers and adds redux logging
 */
export default createStore(combineReducers({
        auth
    }),
    {},
    applyMiddleware(createLogger(), thunk)
);