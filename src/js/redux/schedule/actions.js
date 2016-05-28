import { getScript, formatDate } from '../../utils/util';
import * as types from './types';
import { assembleDateUrl, assembleScheduleUrl } from '../../config';


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
export function selectGold(checked) {
	return dispatch => {
		dispatch({
			type: types.SELECT_GOLD,
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
		let url = assembleDateUrl(getState());

		return getScript(url).then(json => {
			if ( json.length ) {
				dispatch(emptyHotSchedule());
				dispatch(emptyMainSchedule());

				dispatch({
					type: types.UPDATE_SPORTS_DATES,
					dates: json
				})
			} else {
				alert('该筛选组合下没有比赛');
			}
		});
	}
}

/**
 * 选择比赛日期
 */
export function selectDate(date) {
	return (dispatch, getState) => {
		dispatch({
			type: types.SELECT_DATE,
			date
		});

		let { selectedDate, mainSchedule } = getState();
		let oneDay = mainSchedule[selectedDate];
		if ( !oneDay || ( selectedDate >= today && Date.now() - oneDay.updateTime > 300000 ) ) { // 缓存5分钟
			dispatch(updateHotSchedule());
			dispatch(updateMainSchedule());
		}
	}
}

// 更新赛程
let today = formatDate();
function updateHotSchedule() {
	return (dispatch, getState) => {
		let state = getState();
		let { selectedDate } = state;
		if ( state.onlyChina || state.onlyGold || state.selectedDiscipline.id ) { return }
		let url = assembleScheduleUrl('hot', state);

		dispatch(fetchingHotSchedule(selectedDate));

		return getScript(url).then(json => {
			setTimeout(() => {  // todo
				dispatch(fetchingHotSchedule(selectedDate, false));
				dispatch({
					type: types.UPDATE_HOT_SCHEDULE,
					data: {
						[selectedDate]: {
							list: unusedEliminate(json.scheduleList),
							updateTime: Date.now()
						}
					}
				});
			}, Math.random() * 1000)
		}).catch(function(error) {
			console.warn(error);
		});
	}
}

function updateMainSchedule() {
	return (dispatch, getState) => {
		let state = getState();
		let { selectedDate } = state;
		let oneDay = state.mainSchedule[selectedDate];
		let type = oneDay ? oneDay.type : 'active';

		// 往日赛程以及1分钟以内的数据不做重新请求
		let url = assembleScheduleUrl(type, state);
		dispatch(fetchingMainSchedule(selectedDate));


		return getScript(url).then(json => {
			setTimeout(() => {  // todo
				dispatch(fetchingMainSchedule(selectedDate, false));
				dispatch({
					type: types.UPDATE_MAIN_SCHEDULE,
					data: {
						[selectedDate]: {
							type,
							list: unusedEliminate(json.scheduleList),
							updateTime: Date.now(),
							pageNo: json.pageNo
						}
					}
				});
			}, Math.random() * 1000)
		}).catch(function(error) {
			console.warn(error);
		});
	}
}

// 清空赛程
function emptyHotSchedule() {
	return {
		type: types.EMPTY_HOT_SCHEDULE
	}
}

function emptyMainSchedule() {
	return {
		type: types.EMPTY_MAIN_SCHEDULE
	}
}

function fetchingHotSchedule(date, state = true) {
	return {
		type: types.FETCHING_HOT_SCHEDULE,
		date,
		state
	}
}

// 控制赛程请求的 loading 状态
function fetchingMainSchedule(date, state = true) {
	return {
		type: types.FETCHING_MAIN_SCHEDULE,
		date,
		state
	}
}


function unusedEliminate(list) {
	return list.map(s => {
		let competitorMapList = s.competitorMapList;
		if ( s.status == 7 && competitorMapList && competitorMapList.length ) { // 截取赛果长度，团体只看第一名  todo FINISHED
			let end = competitorMapList.length == 2 ? 2 : 1;
			competitorMapList = competitorMapList.slice(end).map(c => {
				return {
					competitorName: c.competitorName,
					result: c.result,
					wlt: c.wlt
				}
			});
		}

		return {
			disciplineName: s.disciplineName,
			scheduleName: s.scheduleName,
			status: s.status,
			medal: s.medal,
			organisationsName: s.organisationsName,
			organisationsImgUrl: s.organisationsImgUrl,
			live: s.live,
			roomId: s.roomId,
			competitorMapList
		}
	});
}