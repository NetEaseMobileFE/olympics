import { combineReducers } from 'redux';
import extend from 'lodash.assign';
import {
	SELECT_CHINA, SELECT_FINAL, SELECT_DISCIPLINE,
	SELECT_DATE, UPDATE_SCHEDULE,
	SHOW_DETAIL,
	SHOW_FINISHED
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

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
let day = ('0' + date.getDate()).slice(-2);
let defaultDate = year + '-' + month + '-' + day;

function selectedDate(state = defaultDate, action) {
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
	selectedDiscipline,
	sportsDates: doNothing,
	selectedDate,
	schedule
});