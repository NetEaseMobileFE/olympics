import 'core-js/fn/promise';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/schedule/store';
import { sportsDates, disciplines } from './config';
import { getSearch } from './utils/util';
import Schedule from './components/schedule';


const search = getSearch();
const onlyChina = search.c == 1 || false;
const onlyGold = search.g == 1 || false;
const did = search.did && search.did.toUpperCase();
let date = search.d;
if ( date && /\d{4}/.test(date) ) {
	date = [new Date().getFullYear(), date.slice(0, 2), date.slice(2)].join('-');
} else {
	date = null;
}
const selectedDiscipline = did && disciplines.filter(d => d.id == did)[0];
const dates = onlyChina || onlyGold || selectedDiscipline ? null : sportsDates;

const store = configureStore({
	sportsDates: dates,
	disciplines,
	onlyChina,
	onlyGold,
	selectedDiscipline,
	selectedDate: date
});

window.store = store;

render((
	<Provider store={store}>
		<Schedule />
	</Provider>
), document.getElementById('root'));