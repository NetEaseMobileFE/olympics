import { ajax } from '../../utils/util';

export const SELECT_CHINA = 'SELECT_CHINA';
export const SELECT_FINAL = 'SELECT_FINAL';
export const SELECT_DISCIPLINE = 'SELECT_DISCIPLINE';
export const UPDATE_SPORTS_DATES = 'UPDATE_SPORTS_DATES';
export const SELECT_DATE = 'SELECT_DATE';
export const UPDATE_SCHEDULE = 'UPDATE_SCHEDULE';

export function selectChina(checked) {
	return dispatch => {
		dispatch({
			type: SELECT_CHINA,
			checked
		});
		dispatch(updateSportsDates())
	}
}

export function selectFinal(checked) {
	return dispatch => {
		dispatch({
			type: SELECT_FINAL,
			checked
		});
		dispatch(updateSportsDates())
	}
}

export function selectDiscipline(discipline) {
	return dispatch => {
		dispatch({
			type: SELECT_DISCIPLINE,
			discipline
		});
		dispatch(updateSportsDates())
	}
}

export function updateSportsDates() {
	return (dispatch, getState) => {
		let { onlyChina, onlyFinal, selectedDiscipline } = getState();
		return ajax({
			url: '/mocks/sports-dates.json',
			data: {
				onlyChina, onlyFinal, selectedDiscipline
			}
		}).then(json => dispatch({
			type: UPDATE_SPORTS_DATES,
			dates: json.dates
		}));
	}
}

export function selectDate(date) {
	return dispatch => {
		dispatch({
			type: SELECT_DATE,
			date
		});
		dispatch(updateSchedule());
	}

}

export function updateSchedule() {
	return (dispatch, getState) => {
		let { onlyChina, onlyFinal, selectedDate, selectedDiscipline } = getState();
		// 今日及以后赛程 距离上次请求 超过1分钟 则重新请求
		// 往日赛程不做重新请求
		return ajax({
			url: '/mocks/schedule.json',
			data: {
				onlyChina, onlyFinal, selectedDate, selectedDiscipline
			}
		}).then(json => dispatch({
			type: UPDATE_SCHEDULE,
			data: {
				[selectedDate]: json.data
			}
		}));
	}
}