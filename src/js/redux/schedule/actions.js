import { ajax, formatDate } from '../../utils/util';
import types from './types';
import { api } from '../../config';


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
		dispatch(emptySchedule());

		return ajax({
			url: api.sportsDates,
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

let today = formatDate();
export function updateSchedule() {
	return (dispatch, getState) => {
		let { onlyChina, onlyFinal, selectedDate, selectedDiscipline, schedule } = getState();
		let oneDay = schedule[selectedDate];

		// 往日赛程不做重新请求
		// 今日及以后赛程 距离上次请求 超过1分钟 则重新请求
		if ( oneDay && ( selectedDate < today || Date.now() - oneDay.updateTime < 60000 ) ) return;

		dispatch(fetchingSchedule(selectedDate));

		return ajax({
			url: api.schedule,
			cache: false,
			data: {
				onlyChina, onlyFinal, selectedDate,
				disciplineID: selectedDiscipline.id || ''
			}
		}).then(json => {
			setTimeout(() => {  // todo
				dispatch(fetchingSchedule(selectedDate, false));
				dispatch({
					type: types.UPDATE_SCHEDULE,
					data: {
						[selectedDate]: {
							sets: json.data,
							updateTime: Date.now()
						}
					}
				});
			}, Math.random() * 1000)
		});
	}
}

export function emptySchedule() {
	return {
		type: types.EMPTY_SCHEDULE
	}
}

export function fetchingSchedule(date, state = true) {
	// console.log(state); // todo
	return {
		type: types.FETCHING_SCHEDULE,
		date,
		state
	}
}