import { createStore, applyMiddleware  } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';


export default initialState => {
	const store = createStore(
		reducers,
		initialState,
		applyMiddleware(thunk)
	);
	
	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('./reducers', () => {
			const nextRootReducer = require('./reducers').default;
			store.replaceReducer(nextRootReducer)
		})
	}
	
	return store;
}
