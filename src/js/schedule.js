import 'core-js/fn/promise';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/schedule/store';
import { sportsDates, disciplines } from './config';
import Schedule from './components/schedule';


let store = configureStore({
	sportsDates,
	disciplines,
	onlyChina: true,
	onlyGold: true,
	selectedDiscipline: {
		name: '射箭',
		id: 'AR'
	}
});

window.store = store;

render((
	<Provider store={store}>
		<Schedule />
	</Provider>
), document.getElementById('root'));