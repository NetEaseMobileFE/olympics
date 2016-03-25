import { combineReducers } from 'redux';
import {
	SELECT_CHINA, SELECT_FINAL, SELECT_EVENT,
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

function selectedEvent(state = null, action) {
	switch ( action.type ) {
		case SELECT_EVENT:
			return action.event;
		default:
			return state;
	}
}

function selectedDate(state = '0802', action) {
	switch ( action.type ) {
		case SELECT_DATE:
			return action.date;
		default:
			return state;
	}
}

const rootReducer = combineReducers({
	onlyChina,
	onlyFinal,
	selectedEvent,
	selectedDate
});

export default rootReducer
