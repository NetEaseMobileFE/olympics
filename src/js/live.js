import 'core-js/fn/promise';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/live/store';
import { sportsDates, disciplines } from './config';
import Live from './components/live';


const store = configureStore({
	sportsDates,
	disciplines
});

render((
	<Provider store={store}>
		<Live />
	</Provider>
), document.getElementById('root'));