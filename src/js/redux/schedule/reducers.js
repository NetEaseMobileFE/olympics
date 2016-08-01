import { combineReducers } from 'redux';
import Immutable from 'seamless-immutable';
import { formatDate } from '../../utils/util';
import * as types from './types';
import { disciplines } from '../../config';


const emptyObject = Immutable({});

function onlyChina(state = false, action) {
	switch ( action.type ) {
		case types.SELECT_CHINA:
			return action.checked;
		default:
			return state;
	}
}

function onlyGold(state = false, action) {
	switch ( action.type ) {
		case types.SELECT_GOLD:
			return action.checked;
		default:
			return state;
	}
}

function selectedDiscipline(state , action) {
	switch ( action.type ) {
		case types.SELECT_DISCIPLINE:
			let { name, id } = action.discipline;
			return {
				name,
				id,
				prev: state
			};
		default:
			return state || Immutable({  // 默认要显示成 “项目筛选”
				name: '项目筛选',
				id: disciplines[0].id
			});
	}
}

function sportsDates(state = null, action) {
	switch ( action.type ) {
		case types.UPDATE_SPORTS_DATES:
			return action.dates;
		default:
			return state;
	}
}

function selectedDate(state = formatDate(), action) {
	switch ( action.type ) {
		case types.SELECT_DATE:
			return action.date;
		default:
			return state
	}
}

function hotSchedule(state = emptyObject, action) {
	switch ( action.type ) {
		case types.EMPTY_HOT_SCHEDULE:
			return emptyObject;
		case types.FETCHING_HOT_SCHEDULE:
			return state.merge({
				[action.date]: {
					loading: action.state
				}
			}, { deep: true });
		case types.UPDATE_HOT_SCHEDULE:
			return state.merge(action.data, { deep: true });
		default:
			return state;
	}
}

function mainSchedule(state = emptyObject, action) {
	switch ( action.type ) {
		case types.EMPTY_MAIN_SCHEDULE:
			return emptyObject;
		case types.FETCHING_MAIN_SCHEDULE:
			return state.merge({
				[action.date]: {
					loading: action.state
				}
			}, { deep: true });
		case types.UPDATE_MAIN_SCHEDULE:
			let data = action.data;
			let date = Object.keys(data)[0];
			let schedule = data[date];

			if ( schedule.list && schedule.lastPageNo !== 1 ) { // list 数据合并
				schedule.list = state[date].list.concat(schedule.list);
			}

			return state.merge(data, { deep: true });
		default:
			return state;
	}
}

function toast(state = false, action) {
	switch ( action.type ) {
		case types.TOGGLE_TOAST:
			return action.config;
		default:
			return state;
	}
}

function doNothing(state = null) {
	return state;
}


export default combineReducers({
	onlyChina,
	onlyGold,
	disciplines: doNothing,
	sportsDates,
	selectedDiscipline,
	selectedDate,
	hotSchedule,
	mainSchedule,
	toast
});