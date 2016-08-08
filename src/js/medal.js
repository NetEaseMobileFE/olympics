import 'core-js/fn/promise';
import React, { Component } from 'react';
import { render } from 'react-dom';
import shallowCompare from 'react-addons-shallow-compare';
import 'swiper';
import '../css/widgets/swiper.scss';
import { getScript, getSearch } from './utils/util';
import CSSModules from 'react-css-modules';
import styles from '../css/medal.scss';
import Switcher from './components/medal/switcher';
import Focus from './components/medal/focus';
import CommonList from './components/medal/common-list';
import OrgList from './components/organisation/org-list';
import { api } from './components/medal/config';


const pageSize = 20;
// const updateInterval = 10 * 1000;
const MEDAL = 'medal';
const CHINA = 'china';
const PERSONAL = 'personal';
const DISCIPLINE = 'discipline';
const types = [MEDAL, CHINA, DISCIPLINE, PERSONAL];
const minHeight = window.innerHeight - rem2px(4.88); // 用于保证列表滑动区域
const thresholdScrollY = rem2px(5.1); // 滚动超出首屏，切换tab就回到顶部

@CSSModules(styles)
class Medal extends Component {
	constructor(props) {
		const search = getSearch();
		super(props);
		this.state = {
			currType: search.tab || MEDAL,
			disciplineId: search.did || 'AR'
			
		};
		this.loading = {};
		this.timer = {};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowCompare(this, nextProps, nextState);
	}

	bindScroll() {
		window.addEventListener('scroll', () => {
			let docEl = document.documentElement;
			if ( docEl.scrollHeight - docEl.clientHeight - window.scrollY < 200 ) {
				this.loadMore();
			}
		}, false);
	};

	componentDidMount() {
		this.updateMedalList();
		this.swiper = new Swiper(this.refs.swiper, {
			initialSlide: types.indexOf(this.state.currType),
			autoHeight: true,
			resistanceRatio: .7,
			onSlideChangeStart: (s) => {
				let type = types[s.activeIndex];
				this.setState({
					currType: type
				});
				// if ( this.timer[type] ) {
				// 	clearTimeout(this.timer[type]);
				// 	this.timer[type] = null;
				// }
				if ( !this.state[type] ) {
					this.updateMedalList(type);
				}
			},
			onSlideChangeEnd() {
				if ( window.scrollY > thresholdScrollY ) {
					window.scrollTo(0, 0);
				}
			}
			
		});
		this.bindScroll();
	}

	handleChange = currType => {
		this.swiper.slideTo(types.indexOf(currType));
	};
	
	switchDiscipline = disciplineId => {
		this.setState({ disciplineId });
		setTimeout(() => {
			this.handleChange(DISCIPLINE);
		}, 50);
	};
	
	updateMedalList(type = this.state.currType) {
		if ( this.loading[type] /*|| this.timer[type]*/ ) return ;
		this.loading[type] = true;
		// if ( type !== PERSONAL ) {
		// 	this.timer[type] = setTimeout(() => {
		// 		this.timer[type] = false;
		// 		this.updateMedalList(type);
		// 	}, updateInterval);
		// }
		
		this.fetchList(type).then(data => {
			if ( data ) {
				let noMore, size;
				const list = data.list;
				if ( type == PERSONAL ) {
					noMore = this.personalPageNo == this.personalPageNum;
					size = this.personalTotalMps;
				} else {
					noMore = list.length <= 20;
					size = this.state[type] ? this.state[type].size : pageSize;
				}
				
				let newState = { noMore, size };
				for ( let k in data ) {
					newState[k] = data[k];
				}
				this.setState({
					[type]: newState
				});
				setTimeout(() => {
					this.swiper.update();
					this.loading[type] = false;
				}, 50);
			} else {
				if ( !this.state[type] ) {
					this.setState({
						[type]: {
							list: [],
							noMore: true
						}
					});
					this.loading[type] = false;
				}
			}
		});
	}
	
	fetchList(type) {
		return new Promise(resolve => {
			let url;
			if ( type == PERSONAL ) {
				let pageNo = this.personalPageNo ? this.personalPageNo + 1 : 1;
				url = api.personal(pageNo);
			} else if ( type == DISCIPLINE ) {
				url = api.discipline(this.state.disciplineId);
			} else {
				url = api[type];
			}
			
			getScript(url, true).then(json => {
				let data;
				
				if ( type == MEDAL ) {
					const list = json.msList.map(st => {
						st = st.medal;
						return {
							rank: st.rank,
							organisation: st.organisation,
							organisationName: st.organisationName,
							flag: st.organisationImgUrl,
							medals: [st.goldTOT, st.silverTOT, st.bronzeTOT, st.totalTOT]
						}
					});
					
					data = { list };
				} else if ( type == CHINA ) {
					const msList = json.mst.msList;
					const list = json.dateCmList.map(st => {
						let currMs = msList.filter(ms => ms.dateText == st.dateText)[0];
						return {
							date: st.dateText,
							medals: [currMs.goldTOT, currMs.silverTOT, currMs.bronzeTOT],
							competitions: st.cm.map(cm => {
								return {
									medalType: cm.medalType,
									recordIndicators: filterRecord(cm.competitorMedal.recordIndicators),
									discipline: cm.discipline,
									disciplineName: cm.disciplineName,
									eventName: cm.eventName,
									scheduleResult: cm.competitorMedal.scheduleResult,
									athletesList: cm.competitorType == 'T' ? cm.competitorMedal.athletesList.map(a => a.name) : [cm.competitorMedal.competitorName]
								}
							})
						}
					});
					
					data = {
						list,
						organisationName: json.organisationName,
						organisationImgUrl: json.organisationImgUrl
						
					}
					
				} else if ( type == DISCIPLINE ) {
					const events = {};
					json.competitorMedalList.forEach(cm => {
						if ( !events[cm.rsc] ) {
							events[cm.rsc] = {
								rsc: cm.rsc,
								eventName: cm.eventName,
								medals: []
							};
						}
						
						events[cm.rsc].medals.push({
							medalType: cm.medalType,
							organisation: cm.organisation,
							organisationName: cm.organisationName,
							organisationImgUrl: cm.organisationImgUrl,
							scheduleResult: cm.scheduleResult,
							recordIndicators: filterRecord(cm.recordIndicators),
							athletesList: cm.competitorType == 'T' ? cm.athletesList.map(a => a.name) : [cm.competitorName]
						});
					});
					
					data = {
						disciplineName: json.disciplineName,
						totalTOT: json.totalTOT,
						list: Object.values(events)
					};
				} else {
					let personal = this.state[PERSONAL];
					this.personalPageNo = json.pageNo;
					this.personalPageNum = json.pageNum;
					this.personalTotalMps = json.totalMps;
					let list = json.mpsList.map(st => {
						return {
							athleteCode: st.athleteCode,
							athleteName: st.athleteName,
							organisationName: st.organisationName || '',
							flag: st.athleteMedalList[0].organisationImgUrl,
							medals: [st.gold, st.silver, st.bronze, st.total]
						}
					});
					
					if ( personal ) {
						list = personal.list.concat(list);
					}
					
					data = { list };
				}
				
				resolve(data);
			}).catch((e) => {
				console.warn(e);
				resolve();
			});
		});
	}
	
	loadMore() {
		let { currType:type } = this.state;
		if ( !this.state[type] || this.state[type].noMore || this.loading[type] ) return;
		
		if ( type == PERSONAL ) {
			this.updateMedalList(type);
		}  else {
			let data = this.state[type];
			let size = data.size + pageSize;
			
			this.loading[type] = true;
			this.setState({
				[type]: {
					list: data.list,
					size,
					noMore: data.list.length <= size
				}
			});
			setTimeout(() => {
				this.swiper.update();
				this.loading[type] = false;
			}, 50);
		}
	}

	render() {
		let { currType } = this.state;
		
		return (
			<div styleName="page">
				<div styleName="page__hd">
					<Switcher type={currType} onTypeChange={this.handleChange}/>
				</div>
				<div styleName="page__bd">
					<Focus />
					<div ref="swiper" className="swiper-container" styleName="main-swiper">
						<div className="swiper-wrapper">
							{
								types.map((type, i) => {
									let state = this.state[type] || {};
									let List = CommonList;
									if ( type == CHINA ) {
										List = OrgList;
									}
									
									return (
										<div className={'swiper-slide ' + type} key={i} style={{ minHeight }}>
											<List type={type}
												  switchToChina={ type == MEDAL ? this.handleChange : null }
												  switchDiscipline={ type == CHINA ? this.switchDiscipline : null }
												  {...state} />
											{
												type == CHINA ? <div styleName="bottom-bar">
													<a href="http://g.163.com/a?__newsapp_target=_blank&CID=44220&Values=689184690&Redirect=http://clickc.admaster.com.cn/c/a72763,b1227619,c369,i0,m101,h
" target="_blank"/>
												</div> : null
											}
										</div>)
								})
							}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

function filterRecord(recordIndicators) {
	return recordIndicators ? recordIndicators
		.filter(r => r.recordType == 'WR' || r.recordType == 'OR')
		.map(r => r.recordType)[0] : null
}


render((
	<Medal />
), document.getElementById('root'));