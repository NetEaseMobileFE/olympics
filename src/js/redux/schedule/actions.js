import { ajax } from '../../utils/util';

export const SELECT_CHINA = 'SELECT_CHINA';
export const SELECT_FINAL = 'SELECT_FINAL';
export const SELECT_DISCIPLINE = 'SELECT_DISCIPLINE';
export const SELECT_DATE = 'SELECT_DATE';
export const UPDATE_SCHEDULE = 'UPDATE_SCHEDULE';
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

export function selectDiscipline(discipline) {
	return {
		type: SELECT_DISCIPLINE,
		discipline
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