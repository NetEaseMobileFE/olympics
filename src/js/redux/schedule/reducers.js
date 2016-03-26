import { combineReducers } from 'redux';
import {
	SELECT_CHINA, SELECT_FINAL, SELECT_DISCIPLINE,
	SELECT_DATE,
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

function selectedDate(state, action) {
	switch ( action.type ) {
		case SELECT_DATE:
			return action.date;
		default:
			let date = new Date();
			let month = date.getMonth() + 1;
			let day = ('0' + date.getDate()).slice(-2);
			return month + '-' + day;
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
	selectedDate
});