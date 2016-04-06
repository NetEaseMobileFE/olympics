import { combineReducers } from 'redux';
import extend from 'lodash.merge';
import { formatDate } from 'js/utils/util';
import types from './types';


function onlyChina(state = false, action) {
	switch ( action.type ) {
		case types.SELECT_CHINA:
			return action.checked;
		default:
			return state;
	}
}

function onlyFinal(state = false, action) {
	switch ( action.type ) {
		case types.SELECT_FINAL:
			return action.checked;
		default:
			return state;
	}
}

function selectedDiscipline(state = {}, action) {
	switch ( action.type ) {
		case types.SELECT_DISCIPLINE:
			return action.discipline;
		default:
			return state;
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

function schedule(state = {}, action) {
	switch ( action.type ) {
		case types.EMPTY_SCHEDULE:
			return {};
		case types.FETCHING_SCHEDULE:
			return extend({}, state, {
				[action.date]: {
					loading: action.state
				}
			});
		case types.UPDATE_SCHEDULE:
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
	onlyFinal,
	disciplines: doNothing,
	sportsDates,
	selectedDiscipline,
	selectedDate,
	schedule
});