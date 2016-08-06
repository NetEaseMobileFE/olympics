import { getScript, formatDate } from '../../utils/util';
import * as types from './types';
import { assembleDateUrl, assembleScheduleUrl, assembleFragmentUrl, sportsDates } from '../../config';
import NProgress from 'nprogress';


const today = formatDate();
const NO_MATCH = '没有相关赛事';

NProgress.configure({
	showSpinner: false,
	minimum: 0.2
});

/**
 * 切换“中国赛程”
 */
function selectChina(checked, mute = false) {
	return (dispatch, getState) => {
		let prevOnlyChina = getState().onlyChina;

		dispatch({
			type: types.SELECT_CHINA,
			checked
		});

		if ( !mute ) {
			dispatch(updateSportsDates(() => {
				dispatch(selectChina(prevOnlyChina, true))
			}))
		}
	}
}

/**
 * 切换“金牌赛程”
 */
function selectGold(checked, mute = false) {
	return (dispatch, getState) => {
		let prevOnlyGold = getState().onlyGold;

		dispatch({
			type: types.SELECT_GOLD,
			checked
		});

		if ( !mute ) {
			dispatch(updateSportsDates(() => {
				dispatch(selectGold(prevOnlyGold, true))
			}))
		}
	}
}

/**
 * 筛选项目
 */
function selectDiscipline(discipline, mute = false) {
	return (dispatch, getState) => {
		let prevDiscipline = getState().selectedDiscipline;

		dispatch({
			type: types.SELECT_DISCIPLINE,
			discipline
		});

		if ( !mute ) {
			dispatch(updateSportsDates(() => {
				dispatch(selectDiscipline(prevDiscipline, true))
			}))
		}
	}
}

// 请求过滤后的比赛日期
function updateSportsDates(rollBack) {
	return (dispatch, getState) => {
		let state = getState();
		const url = assembleDateUrl(state);
		let promise = url ? getScript(url) : Promise.resolve(sportsDates);
		NProgress.start();
		
		return promise.then(json => {
			NProgress.done();
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
				});
			} else {
				rollBack();
				dispatch(toggleToast({ msg: NO_MATCH }));
			}
		}).catch(error => {
			console.warn(error);
			rollBack();
			dispatch(toggleToast({ msg: NO_MATCH }));
			NProgress.done();
		});
	}
}

/**
 * 选择比赛日期
 */
function selectDate(date) {
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
			return amendResult(json.scheduleList);
		}).then(list => {
			dispatch(fetchingHotSchedule(selectedDate, false));
			dispatch({
				type: types.UPDATE_HOT_SCHEDULE,
				data: {
					[selectedDate]: { list }
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
			amendResult(json.scheduleList).then(list => {
				dispatch(fetchingMainSchedule(selectedDate, false));
				dispatch({
					type: types.UPDATE_MAIN_SCHEDULE,
					data: {
						[selectedDate]: {
							type,
							list,
							lastPageNo: json.pageNo,
							noMore: json.pageNo == json.pageNum
						}
					}
				});
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
			} else {
				dispatch(showTypeAll());
			}
			console.warn(error);
		});
	}
}

/**
 * 切换主要赛程为 全部赛程
 */
function showTypeAll() {
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
function showMoreSchedule() {
	return (dispatch) => {
		dispatch(updateMainSchedule());
	}
}

function updateResult(di) {
	
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

// 修正赛果
function amendResult(list) {
	if ( !list || !list.length ) return Promise.resolve(null);
	return new Promise((resolve, reject) => {
		const needRealResult = list.filter(s => {
			if ( s.organisations && s.organisations.length == 2 ) { // 个人 1v1
				return s.competitionType = 'D'; // duel
			} else if ( s.competitorMapList && s.competitorMapList.length && s.competitorMapList[0].competitorType == 'A' ) { // 多国个人
				return s.competitionType = 'A'; // duel
			}
		}).map(s => s.rsc);
		
		if ( needRealResult.length ) {
			getScript(assembleFragmentUrl(needRealResult)).then(results => {
				if ( results && results.length > 0 ) {
					results.forEach(result => {
						list.forEach((s => {
							if ( result.rsc == s.rsc ) {
								s.competitorMapList = result.competitors;
							}
						}))
					});
				}
				
				resolve(unusedEliminate(list));
			}).catch((error) => {
				console.warn(error);
				resolve(unusedEliminate(list));
			});
		} else {
			resolve(unusedEliminate(list));
		}
	});
}

// 剔除不用的属性，统一赛果 competitors
function unusedEliminate(list) {
	return list.map(schedule => {
		let { organisations, organisationsName, organisationsImgUrl, competitorMapList, competitionType } = schedule;
		let isFinished = schedule.status == 'FINISHED';
		let competitors = [];
		
		if ( organisations && organisations.length ) {
			if ( organisations.length == 2 ) {
				organisations.forEach((o, i) => {
					competitors.push({
						code: o,
						name: organisationsName[i],
						flag: organisationsImgUrl[i]
					});
				});
				
				// 中国优先显示
				if ( competitors[1].code == 'CHN' && competitors[0].code !== 'CHN' ) {
					competitors.reverse();
				}
			}
			
			// 截取赛果长度，团体只看第一名
			if ( competitorMapList && competitorMapList.length ) {
				let tmpCpt;
				if ( competitionType == 'D' ) {
					if ( competitorMapList[0].organisation != competitors[0].code ) { // 按照默认顺序显示结果
						competitorMapList.reverse();
					}
					
					competitors.forEach((c, i) => {
						tmpCpt = competitorMapList[i];
						c.flag = tmpCpt.organisationImgUrl;
						c.name = tmpCpt.competitorName; // 如果是个人名字的话，优先显示个人
						c.result = tmpCpt.result;
						c.wlt = tmpCpt.wlt;
						// c.resultType = tmpCpt.resultType;
						// c.rank = tmpCpt.rank;
					});
				} else if ( isFinished ) {
					tmpCpt = competitorMapList[0];
					competitors.push({
						name: tmpCpt.competitorName,
						code: tmpCpt.organisation,
						flag: tmpCpt.organisationImgUrl,
						record: tmpCpt.recordIndicators && tmpCpt.recordIndicators.map(r => r.recordType)
						// result: tmpCpt.result,
						// resultType: tmpCpt.resultType,
						// wlt: tmpCpt.wlt
					});
				} else if ( competitionType == 'A' ) {
					competitors = competitorMapList.map(tmpCpt => {
						return {
							name: tmpCpt.competitorName,
							code: tmpCpt.organisation,
							flag: tmpCpt.organisationImgUrl
						}
					});
				}
			}
		}
		
		return {
			rsc: schedule.rsc,
			disciplineName: schedule.disciplineName,
			scheduleName: schedule.scheduleName,
			withChina: organisations && organisations.length > 0 && organisations.indexOf('CHN') > -1,
			isFinished,
			isFinal: schedule.medal == 1,
			startTime: schedule.startDate.slice(0, -4),
			// endTime: schedule.endDate.slice(0, -4),
			live: schedule.live,
			roomId: schedule.roomId,
			competitionType,
			competitors
		}
	});
}

/**
 * 切换 toggleToast 显示
 */
function toggleToast(config) {
	return dispatch => {
		dispatch({
			type: types.TOGGLE_TOAST,
			config
		});
	}
}


export {
	selectChina,
	selectGold,
	selectDiscipline,
	selectDate,
	showTypeAll,
	showMoreSchedule,
	toggleToast
}