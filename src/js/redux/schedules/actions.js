export const SELECT_CHINA = 'SELECT_CHINA';
export const SELECT_FINAL = 'SELECT_FINAL';
export const SELECT_EVENT = 'SELECT_EVENT';
export const SELECT_DATE = 'SELECT_DATE';
export const SHOW_DETAIL = 'SHOW_DETAIL';
export const SHOW_FINISHED = 'SHOW_FINISHED';

export function selectChina(checked) {
	return {
		type: SELECT_CHINA,
		checked
	}
}

export function selectFinal(checked) {
	return {
		type: SELECT_FINAL,
		checked
	}
}

export function selectEvent(event) {
	return {
		type: SELECT_EVENT,
		event
	}
}

export function selectDate(date) {
	return {
		type: SELECT_DATE,
		date
	}
}

export function showDetail(date, index) {
	return {
		type: SHOW_DETAIL,
		date,
		index
	}
}

export function showFinished(date) {
	return {
		type: SHOW_FINISHED,
		date
	}
}