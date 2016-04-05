import { ajax } from '../../utils/util';
import types from './types';


export function selectChina(checked) {
	return dispatch => {
		dispatch({
			type: types.SELECT_CHINA,
			checked
		});
		dispatch(updateSportsDates())
	}
}

export function selectFinal(checked) {
	return dispatch => {
		dispatch({
			type: types.SELECT_FINAL,
			checked
		});
		dispatch(updateSportsDates())
	}
}

export function selectDiscipline(discipline) {
	return dispatch => {
		dispatch({
			type: types.SELECT_DISCIPLINE,
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
				onlyChina, onlyFinal,
				disciplineID: selectedDiscipline.id || ''
			}
		}).then(json => dispatch({
			type: types.UPDATE_SPORTS_DATES,
			dates: json.dates
		}));
	}
}

export function selectDate(date) {
	return dispatch => {
		dispatch({
			type: types.SELECT_DATE,
			date
		});
		dispatch(updateSchedule());
	}

}

export function updateSchedule() {
	return (dispatch, getState) => {
		let { onlyChina, onlyFinal, selectedDate, selectedDiscipline } = getState();
		// 今日及以后赛程 距离上次请求 超过1分钟 则重新请求 todo
		// 往日赛程不做重新请求
		return ajax({
			url: '/mocks/schedule.json',
			data: {
				onlyChina, onlyFinal, selectedDate,
				disciplineID: selectedDiscipline.id || ''
			}
		}).then(json => dispatch({
			type: types.UPDATE_SCHEDULE,
			data: {
				[selectedDate]: json.data
			}
		}));
	}
}