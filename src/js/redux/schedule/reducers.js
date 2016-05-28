import { combineReducers } from 'redux';
import { formatDate, extend } from '../../utils/util';
import * as types from './types';
import { disciplines } from '../../config';


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
			return action.discipline;
		default:
			return state || {  // 默认要显示成 “项目筛选”
				name: '项目筛选',
				id: disciplines[0].id
			};
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

function hotSchedule(state = {}, action) {
	switch ( action.type ) {
		case types.EMPTY_HOT_SCHEDULE:
			return {};
		case types.FETCHING_HOT_SCHEDULE:
			return extend({}, state, {
				[action.date]: {
					loading: action.state
				}
			});
		case types.UPDATE_HOT_SCHEDULE:
			return extend({}, state, action.data);
		default:
			return state;
	}
}

function mainSchedule(state = {}, action) {
	switch ( action.type ) {
		case types.EMPTY_MAIN_SCHEDULE:
			return {};
		case types.FETCHING_MAIN_SCHEDULE:
			return extend({}, state, {
				[action.date]: {
					loading: action.state
				}
			});
		case types.UPDATE_MAIN_SCHEDULE:
			return extend({}, state, action.data);
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
	mainSchedule
});