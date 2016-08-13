import 'core-js/fn/promise';
import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import shallowCompare from 'react-addons-shallow-compare';
import 'swiper';
import '../css/widgets/swiper.scss';
import { getScript, getSearch, getIn } from './utils/util';
import CSSModules from 'react-css-modules';
import styles from '../css/medal.scss';
import Switcher from './components/medal/switcher';
import Focus from './components/medal/focus';
import CommonList from './components/medal/common-list';
import OrgList from './components/medal/organisation-list';
import DisList from './components/medal/discipline-list';
import { api, disciplines } from './components/medal/config';
import DP from './components/common/discipline-picker';
import ua from './utils/ua';


const pageSize = 20;
// const updateInterval = 10 * 1000;
const MEDAL = 'medal';
const CHINA = 'china';
const PERSONAL = 'personal';
const DISCIPLINE = 'discipline';
const types = [MEDAL, CHINA, DISCIPLINE, PERSONAL];
const minHeight = window.innerHeight - rem2px(4.88); // 用于保证列表滑动区域
const thresholdScrollY = rem2px(5.1); // 滚动超出首屏，切换tab就回到顶部
const iframeEl = ua.isNewsApp && document.getElementById('iframe');


@CSSModules(styles)
class Medal extends Component {
	constructor(props) {
		const search = getSearch();
		super(props);
		this.state = {
			currType: search.tab || MEDAL,
			showDP: false,
			filterBy: 'medal'
		};
		this.disciplineId = search.did;
		this.disciplineName = getDisciplineName(this.disciplineId);
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
	
	toggleDP = () => {
		this.setState({
			showDP: !this.state.showDP
		});
	};
	
	switchFilter = mode => {
		const data = this.state[CHINA];
		data.list = null;
		
		this.setState({
			[CHINA]: data,
			filterBy: mode
		});
		setTimeout(() => {
			this.updateMedalList(CHINA);
		}, 100)
	};
	
	handleDisciplineChange = value => {
		if ( value ) {
			this.disciplineId = value.id;
			this.setState({
				[DISCIPLINE]: null
			});
			this.updateMedalList(DISCIPLINE);
			window.scrollTo(0, 0);
		}
	};
	
	switchDiscipline = disciplineId => {
		if ( this.disciplineId != disciplineId ) {
			this.disciplineId = disciplineId;
			this.setState({
				[DISCIPLINE]: null
			});
			this.updateMedalList(DISCIPLINE);
		}
		
		this.handleChange(DISCIPLINE);
	};
	
	switchOrganisation = organisationId => {
		if ( organisationId == 'CHN' ) {
			this.handleChange(CHINA);
		} else {
			location.href = 'organisation.html?oid=' + organisationId;
		}
	};
	
	navigateTo = ({ rsc, report }) => {
		let docid;
		if ( typeof report == 'string' ) {
			let matches = report.match(/\/([A-Z0-9]{16})\.html/);
			docid = matches && matches.length ? matches[1] : null;
		}
		
		if ( docid ) {
			if ( iframeEl ) {
				iframeEl.src = `newsapp://doc/${docid}`;
			} else {
				location.href = `http://c.m.163.com/news/a/${docid}.html`;
			}
		} else if ( rsc ) {
			location.href = `http://3g.163.com/ntes/special/0034073A/olympic2016_live.html?rsc=${rsc}#!/doc`;
		}
	};
	
	searchDisciplineId() {
		return new Promise(resolve => {
			let url = api.china('date');
			getScript(url).then(json => {
				if ( json.mst ) {
					const latestDate = json.mst.msList.filter(ms => ms.totalTOT > 0).sort((a, b) => a.dateText > b.dateText ? -1 : 1)[0].dateText;
					const cm = json.dateCmList.filter(cm => cm.dateText == latestDate)[0].cm;
					const discipline = cm.sort((a, b) => a.scheduleEndDate > b.scheduleEndDate ? -1 : 1)[0].discipline;
					resolve(discipline);
				}
			}).catch(e => {
				console.log(e);
				resolve('AR');
			});
		});
	}
	
	updateMedalList(type = this.state.currType) {
		if ( this.loading[type] /*|| this.timer[type]*/ ) return ;
		if ( type == DISCIPLINE && !this.disciplineId ) {
			this.searchDisciplineId().then(did => {
				this.disciplineId = did;
				this.disciplineName = getDisciplineName(did);
				this.updateMedalList(DISCIPLINE);
			});
			return;
		}
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
					noMore = list.length <= pageSize;
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
				} else if ( type == CHINA ) {
					const chinaData = this.state[CHINA];
					this.setState({
						[type]: {
							list: [],
							organisationName: chinaData.organisationName,
							organisationImgUrl: chinaData.organisationImgUrl,
							medals: chinaData.medals,
							noMore: true
						}
					});
				}
				this.loading[type] = false;
			}
		});
	}
	
	fetchList(type) {
		return new Promise(resolve => {
			let filterBy = this.state.filterBy;
			let url;
			if ( type == PERSONAL ) {
				let pageNo = this.personalPageNo ? this.personalPageNo + 1 : 1;
				url = api.personal(pageNo);
			} else if ( type == DISCIPLINE ) {
				url = api.discipline(this.disciplineId);
			} else if ( type == CHINA ) {
				url = api.china(filterBy);
			} else {
				url = api[type];
			}
			
			getScript(url).then(json => {
				let data;
				
				if ( type == MEDAL && json.msList ) {
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
					if ( filterBy == 'date' ) {
						if ( getIn(json, 'dateCmList') && getIn(json, 'mst.msList') ) {
							const msList = getIn(json, 'mst.msList');
							const list = json.dateCmList.map(st => {
								let currMs = msList.filter(ms => ms.dateText == st.dateText)[0];
								return {
									date: st.dateText,
									medals: [currMs.goldTOT, currMs.silverTOT, currMs.bronzeTOT],
									competitions: st.cm.map(cm => getCompetitorData(cm))
								}
							});
							
							list.sort((a, b) => a.date > b.date ? -1 : 1);
							data = {
								list,
								organisationName: json.organisationName,
								organisationImgUrl: json.organisationImgUrl,
								medals: json.mst ? [json.mst.goldTOT, json.mst.silverTOT, json.mst.bronzeTOT] : [0,0,0]
							};
						}
					} else if ( filterBy =='medal' ) {
						if ( json.medalTypeCmMap && json.mst ) {
							const list = [json.medalTypeCmMap.ME_GOLD, json.medalTypeCmMap.ME_SILVER, json.medalTypeCmMap.ME_BRONZE].map(medals => {
								return medals ? {
									competitions: medals.map(medal => getCompetitorData(medal))
								} : medals;
							});
							
							data = {
								list,
								organisationName: json.organisationName,
								organisationImgUrl: json.organisationImgUrl,
								medals: json.mst ? [json.mst.goldTOT, json.mst.silverTOT, json.mst.bronzeTOT] : [0,0,0]
							};
						}
					} else {
						const list = [];
						let item;
						for ( let key in json ) {
							item = json[key];
							if ( key != 'updata' ) {
								if( item.gold.length || item.silver.length || item.bronze.length ) {
									list.push({
										name: item.name,
										medals: [item.gold, item.silver, item.bronze]
									});
								}
							}
						}
						
						let aNum, bNum;
						list.sort((a, b) => {
							if ( a.medals[0].length > b.medals[0].length ) {
								return -1;
							} else if ( a.medals[0].length == b.medals[0].length ) {
								aNum = a.medals.reduce((p, c) => p + c.length, 0);
								bNum = b.medals.reduce((p, c) => p + c.length, 0);
								if ( aNum > bNum ) {
									return -1
								} else if ( aNum == bNum && a.medals[1].length > b.medals[1].length) {
									return -1;
								}
								return 1
							}
							return 1;
						});
						
						const chinaData = this.state[CHINA];
						data = {
							list,
							organisationName: chinaData.organisationName,
							organisationImgUrl: chinaData.organisationImgUrl,
							medals: chinaData.medals
						}
					}
				} else if ( type == DISCIPLINE && json.competitorMedalList ) {
					const events = {};
					json.competitorMedalList.forEach(cm => {
						if ( !events[cm.scheduleRsc] ) {
							events[cm.scheduleRsc] = {
								rsc: cm.scheduleRsc,
								eventName: cm.eventName,
								startTime: cm.scheduleStartDate,
								medals: []
							};
						}
						
						events[cm.scheduleRsc].medals.push({
							report: cm.report,
							rsc: cm.scheduleRsc,
							medalType: cm.medalType,
							organisation: cm.organisation,
							organisationName: cm.organisationName,
							organisationImgUrl: cm.organisationImgUrl,
							scheduleResult: cm.scheduleResult,
							recordIndicators: filterRecord(cm.recordIndicators),
							athletesList: cm.competitorType == 'T' ? cm.athletesList.map(a => a.name) : [cm.competitorName]
						});
					});
					
					const list = [];
					for ( let k in events ) {
						events[k].medals.sort((a, b) => { // 纠正奖牌顺序
							return a.medalType == 'ME_GOLD' ? -1 : a.medalType == 'ME_SILVER' && b.medalType != 'ME_GOLD' ? -1 : 1
						});
						list.push(events[k]);
					}
					
					data = {
						disciplineName: json.disciplineName,
						goldTOT: json.mst.goldTOT,
						list
					};
				} else if ( json.mpsList ) {
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
				} else {
					resolve();
					return;
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
		let { currType, showDP } = this.state;
		let disciplineName, dp = null;
		if ( this.disciplineId ) {
			disciplineName = getDisciplineName(this.disciplineId);
			dp = showDP ?
				<DP key={1} disciplines={disciplines} disciplineName={disciplineName} cover
					hide={this.toggleDP} onChange={this.handleDisciplineChange}/>
				: null;
		}
		
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
									
									switch ( type ) {
										case MEDAL:
											List = <CommonList type={type} switchToChina={this.handleChange.bind(null, CHINA)}
												   switchOrganisation={this.switchOrganisation} {...state}/>;
											break;
										case CHINA:
											List = <OrgList switchDiscipline={this.switchDiscipline} navigateTo={this.navigateTo}
													switchFilter={this.switchFilter} filterBy={this.state.filterBy} {...state}/>;
											break;
										case DISCIPLINE:
											List = <DisList switchOrganisation={this.switchOrganisation} toggleDP={this.toggleDP}
													navigateTo={this.navigateTo} disciplineName={disciplineName} {...state}/>;
											break;
										case PERSONAL:
											List = <CommonList type={type} {...state}/>;
											break;
										default:
											List = null;
									}
									
									return (
										<div className={'swiper-slide ' + type} key={i} style={{ minHeight }}>
											{List}
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
				
				<ReactCSSTransitionGroup transitionName="dpm" transitionEnterTimeout={300} transitionLeaveTimeout={250}>
					{dp}
				</ReactCSSTransitionGroup>
			</div>
		)
	}
}

function filterRecord(recordIndicators) {
	return recordIndicators ? recordIndicators
		.filter(r => r.recordType == 'WR' || r.recordType == 'OR')
		.map(r => r.recordType)[0] : null
}

function getDisciplineName(did) {
	return did && disciplines.filter(d => d.id == did)[0].name
}

function getCompetitorData(cm) {
	return {
		rsc: getIn(cm, 'competitorMedal.scheduleRsc'),
		report: getIn(cm, 'competitorMedal.report'),
		medalType: cm.medalType,
		recordIndicators: filterRecord(getIn(cm, 'competitorMedal.recordIndicators')),
		discipline: cm.discipline,
		disciplineName: cm.disciplineName,
		eventName: cm.eventName,
		scheduleResult: getIn(cm, 'competitorMedal.scheduleResult'),
		athletesList: cm.competitorType == 'T' && getIn(cm, 'competitorMedal.athletesList') ?
			cm.competitorMedal.athletesList.map(a => a.name) :
			[getIn(cm, 'competitorMedal.competitorName')]
	}
}

render((
	<Medal />
), document.getElementById('root'));