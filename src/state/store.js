import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux-immutable';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import restMiddleware from './middleware/rest';
import { reducers, StoreRecord } from './modules/index';

export const history = createHistory();

export const configureStore = (initialState = StoreRecord()) => {
  const enhancers = [];
  const middleware = [restMiddleware, thunkMiddleware, routerMiddleware(history)];

  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    } else {
      middleware.push(loggerMiddleware);
    }
  }

  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers,
  );

  const rootReducer = combineReducers(reducers, StoreRecord);

  return createStore(rootReducer, initialState, composedEnhancers);
};

export default configureStore();
