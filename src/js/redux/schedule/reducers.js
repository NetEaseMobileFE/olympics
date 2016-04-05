import { combineReducers } from 'redux';
import extend from 'lodash.assign';
import { formatDate } from '../../utils/util';
import {
	SELECT_CHINA, SELECT_FINAL, SELECT_DISCIPLINE,
	SELECT_DATE, UPDATE_SCHEDULE,
	UPDATE_SPORTS_DATES
} from './actions';


function onlyChina(state = false, action) {
	switch ( action.type ) {
		case SELECT_CHINA:
			return action.checked;
		default:
			return state;
	}
}

function onlyFinal(state = false, action) {
	switch ( action.type ) {
		case SELECT_FINAL:
			return action.checked;
		default:
			return state;
	}
}

function selectedDiscipline(state = null, action) {
	switch ( action.type ) {
		case SELECT_DISCIPLINE:
			return action.discipline;
		default:
			return state;
	}
}

function sportsDates(state = null, action) {
	switch ( action.type ) {
		case UPDATE_SPORTS_DATES:
			return action.dates;
		default:
			return state;
	}
}

function selectedDate(state = formatDate(), action) {
	switch ( action.type ) {
		case SELECT_DATE:
			return action.date;
		default:
			return state
	}
}

function schedule(state = {}, action) {
	switch ( action.type ) {
		case UPDATE_SCHEDULE:
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