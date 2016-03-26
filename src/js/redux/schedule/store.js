import { createStore } from 'redux';
import reducers from './reducers';
import { sportsDates, disciplines } from 'js/config';

export default createStore(reducers, {
	sportsDates,
	disciplines
});

/*
let storeStructure  = {
	onlyChina: true,
	selectedEvents: 'football',
	onlyFinal: true,
	selectedDate: '2016-08-08',
	schedules: [
		{
			'0801': {
				events: [
					{
						name: '男子足球决赛',
						event: 'football',
						time: '22:00:00',
						isFinal: true,
						chinaCompeteIn: true,
						detail: {}
					}
				]
			}
		}
	]

};*/

