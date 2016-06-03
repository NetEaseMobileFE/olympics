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
		let type = oneDay ? oneDay.type :
			selectedDate < today ? 'all' : 'active';

		console.log(selectedDate, today); // todo
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
							lastPageNo: json.pageNo,
							noMore: json.pageNo == json.pageNum
						}
					}
				});
			}, Math.random() * 1000)
		}).catch(function(error) {
			console.warn(error);
		});
	}
}

export function showTypeAll() {
	return (dispatch, getState) => {
		let { selectedDate } = getState();
		dispatch({
			type: types.UPDATE_MAIN_SCHEDULE,
			data: {
				[selectedDate]: {
					type: 'all',
					lastPageNo: 0
				}
			}
		});
		dispatch(updateMainSchedule());
	}
}

export function showMoreSchedule() {
	return (dispatch) => {
		dispatch(updateMainSchedule());
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
	return list.map(schedule => {
		let { organisations, organisationsName, organisationsImgUrl, competitorMapList } = schedule;
		let isFinished = schedule.status == 7; //  todo FINISHED
		let competitors = [];

		if ( organisations.length == 2 ) {
			organisations.forEach((o, i) => {
				competitors.push({
					code: o,
					name: organisationsName[i],
					flag: organisationsImgUrl[i].replace('90x60', '61x45')
				});
			});
		}

		if ( isFinished && competitorMapList && competitorMapList.length ) { // 截取赛果长度，团体只看第一名
			let tmpCpt;
			if ( organisations.length == 2 ) {
				if ( competitorMapList[0].organisation != competitors[0].code ) { // 按照默认顺序显示结果
					competitorMapList.reverse();
				}

				competitorMapList.forEach((c, i) => {
					tmpCpt = competitors[i];
					tmpCpt.name = c.competitorName; // 如果是个人名字的话，优先显示个人
					tmpCpt.result = c.result;
					tmpCpt.resultType = c.resultType;
					tmpCpt.rank = c.rank;
				});
			} else {
				tmpCpt = competitorMapList[0];
				competitors.push({
					name: tmpCpt.competitorName,
					code: tmpCpt.organisation,
					flag: tmpCpt.organisationImgUrl.replace('90x60', '61x45')
					// result: tmpCpt.result,
					// resultType: tmpCpt.resultType,
					// wlt: tmpCpt.wlt
				});
			}
		}

		return {
			disciplineName: schedule.disciplineName,
			scheduleName: schedule.scheduleName,
			withChina: organisations.indexOf('CHN') > -1,
			isFinished,
			isFinal: schedule.medal == 1,
			startTime: schedule.startDate.substr(11, 5),
			live: schedule.live,
			roomId: schedule.roomId,
			competitors
		}
	});
}