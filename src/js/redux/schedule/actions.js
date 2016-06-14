import { getScript, formatDate } from '../../utils/util';
import * as types from './types';
import { assembleDateUrl, assembleScheduleUrl, sportsDates } from '../../config';


const today = formatDate();

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
		const url = assembleDateUrl(getState());
		let promise = url ? getScript(url) : Promise.resolve(sportsDates);

		return promise.then(json => {
			if ( json.length ) {
				dispatch(emptyHotSchedule());
				dispatch(emptyMainSchedule());

				const dates = json.map(d => {
					return d.replace(/(\d{4})(\d{2})(\d{2})/, (_, $1, $2, $3) => {  // 日期规范化 20160808 => 2016-08-08
						return $1 + '-' + $2 + '-' + $3;
					})
				});
				dispatch({
					type: types.UPDATE_SPORTS_DATES,
					dates
				})
			} else {
				alert('该筛选组合下没有比赛');
			}
		}).catch(error => console.warn(error));
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

		const { selectedDate, mainSchedule } = getState();
		const oneDay = mainSchedule[selectedDate];
		if ( !oneDay || ( selectedDate >= today && Date.now() - oneDay.updateTime > 300000 ) ) { // 缓存5分钟
			dispatch(updateHotSchedule());
			dispatch(updateMainSchedule());
		}
	}
}

// 热门赛程
function updateHotSchedule() {
	return (dispatch, getState) => {
		let state = getState();
		let { selectedDate } = state;
		if ( state.onlyChina || state.onlyGold || state.selectedDiscipline.id ) { return } // 筛选条件下不显示热门
		const url = assembleScheduleUrl('hot', state);

		dispatch(fetchingHotSchedule(selectedDate));

		return getScript(url).then(json => {
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
		}).catch(error => console.warn(error));
	}
}

// 主要赛程，包括 进行中赛程（默认） 和 全部赛程
function updateMainSchedule() {
	return (dispatch, getState) => {
		let state = getState();
		let { selectedDate } = state;
		let oneDay = state.mainSchedule[selectedDate];
		let type = oneDay ? oneDay.type :
			selectedDate == today ? 'active' : 'all';

		const url = assembleScheduleUrl(type, state);
		dispatch(fetchingMainSchedule(selectedDate));


		return getScript(url).then(json => {
			// 进行中赛程为空的话，自动切换到全部赛程
			if ( type == 'active' && ( !json.scheduleList || !json.scheduleList.length ) ) {
				dispatch(showTypeAll());
				return;
			}

			dispatch(fetchingMainSchedule(selectedDate, false));
			dispatch({
				type: types.UPDATE_MAIN_SCHEDULE,
				data: {
					[selectedDate]: {
						type,
						list: unusedEliminate(json.scheduleList),
						lastPageNo: json.pageNo,
						noMore: json.pageNo == json.pageNum
					}
				}
			});
		}).catch(error => {
			// 标记没有数据
			if ( type == 'all' ) {
				dispatch(fetchingMainSchedule(selectedDate, false));
				dispatch({
					type: types.UPDATE_MAIN_SCHEDULE,
					data: {
						[selectedDate]: {
							type,
							list: [],
							lastPageNo: oneDay ? oneDay.lastPageNo + 1 : 1,
							noMore: true
						}
					}
				});
			}
			console.warn(error);
		});
	}
}

/**
 * 切换主要赛程为 全部赛程
 */
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

/**
 * 加载更多主要赛程
 */
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

// 剔除不用的属性，统一赛果 competitors
function unusedEliminate(list) {
	return list.map(schedule => {
		let { organisations, organisationsName, organisationsImgUrl, competitorMapList } = schedule;
		let isFinished = schedule.status == 'FINISHED';
		let competitors = [];

		if ( organisations && organisations.length ) {
			if ( organisations.length == 2 ) {
				organisations.forEach((o, i) => {
					competitors.push({
						code: o,
						name: organisationsName[i],
						flag: organisationsImgUrl[i].replace('90x60', '61x45')
					});
				});
			}

			// 截取赛果长度，团体只看第一名
			if ( isFinished && competitorMapList && competitorMapList.length ) {
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
						flag: tmpCpt.organisationImgUrl.replace('90x60', '61x45')  // todo
						// result: tmpCpt.result,
						// resultType: tmpCpt.resultType,
						// wlt: tmpCpt.wlt
					});
				}
			}
		}

		return {
			disciplineName: schedule.disciplineName,
			scheduleName: schedule.scheduleName,
			withChina: organisations && organisations.length > 0 && organisations.indexOf('CHN') > -1,
			isFinished,
			isFinal: schedule.medal == 1,
			startTime: schedule.startDate.substr(11, 5),
			live: schedule.live,
			roomId: schedule.roomId,
			competitors
		}
	});
}