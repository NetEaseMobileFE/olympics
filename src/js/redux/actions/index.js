export const SELECT_COUNTRY = 'SELECT_COUNTRY';
export const SELECT_CHINA = 'SELECT_CHINA';
export const SELECT_FINAL = 'SELECT_FINAL';
export const SELECT_DATE = 'SELECT_DATE';
export const SHOW_DETAIL = 'SHOW_DETAIL';
export const SHOW_FINISHED = 'SHOW_FINISHED';


export function selectCountry(country) {
  return {
    type: SELECT_COUNTRY,
	  country
  }
}

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

//
let actions = [
	['select_china', true],
	['select_events', 'football'],
	['select_final', true],
	['select_date', '2016-08-08'],
	['show_detail', ['date', 'index']],
	['show_finished', 'date']
];