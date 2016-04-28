import { ajax, formatDate } from '../../utils/util';
import * as types from './types';
import { api } from '../../components/live/config';


/**
 * 切换“中国赛程”
 */
export function selectChina(checked) {
	return dispatch => {
		dispatch({
			type: types.SELECT_CHINA,
			checked
		});
		dispatch(updateSportsDates())
	}
}

/**
 * 切换“金牌赛程”
 */
export function selectFinal(checked) {
	return dispatch => {
		dispatch({
			type: types.SELECT_FINAL,
			checked
		});
		dispatch(updateSportsDates())
	}
}

/**
 * 筛选项目
 */
export function selectDiscipline(discipline) {
	return dispatch => {
		dispatch({
			type: types.SELECT_DISCIPLINE,
			discipline
		});
		dispatch(updateSportsDates())
	}
}

// 请求过滤后的比赛日期
function updateSportsDates() {
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

/**
 * 选择比赛日期
 */
export function selectDate(date) {
	return dispatch => {
		dispatch({
			type: types.SELECT_DATE,
			date
		});
		dispatch(updateSchedule());
	}

}

// 更新赛程
let today = formatDate();
function updateSchedule() {
	return (dispatch, getState) => {
		let { onlyChina, onlyFinal, selectedDate, selectedDiscipline, schedule } = getState();
		let oneDay = schedule[selectedDate];

		// 往日赛程以及1分钟以内的数据不做重新请求
		if ( oneDay && ( selectedDate < today || Date.now() - oneDay.updateTime < 60000 ) ) return;

		dispatch(fetchingSchedule(selectedDate));

		return ajax({
			url: api.live,
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
							list: json.data,
							updateTime: Date.now()
						}
					}
				});
			}, Math.random() * 1000)
		});
	}
}

// 清空赛程
function emptySchedule() {
	return {
		type: types.EMPTY_SCHEDULE
	}
}

// 控制赛程请求的 loading 状态
function fetchingSchedule(date, state = true) {
	return {
		type: types.FETCHING_SCHEDULE,
		date,
		state
	}
}