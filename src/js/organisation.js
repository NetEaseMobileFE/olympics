import 'core-js/fn/promise';
import React, { Component } from 'react';
import { render } from 'react-dom';
import shallowCompare from 'react-addons-shallow-compare';
import 'swiper';
import '../css/widgets/swiper.scss';
import { getScript, getSearch, getIn } from './utils/util';
import CSSModules from 'react-css-modules';
import styles from '../css/organisation.scss';
import OrgList from './components/medal/organisation-list';
import Focus from './components/medal/focus';
import ua from './utils/ua';


const pageSize = 3;
const apiBaseUrl = `http://data.2016.163.com/`;
// const apiBaseUrl = `http://220.181.98.148/`;
const iframeEl = ua.isNewsApp && document.querySelector('#iframe');

@CSSModules(styles)
class Organisation extends Component {
   constructor(props) {
     super(props);
	   const search = getSearch();
	   super(props);
	   this.organisation = search.oid || 'CHN';
	   this.state = {
	   		filterBy: 'medal'
	   };
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
		this.bindScroll();
	}

	switchDiscipline = disciplineId => {
		location.href = 'medal.html?tab=discipline&did=' + disciplineId;
	};

	switchFilter = mode => {
		this.setState({
			filterBy: mode,
			list: null
		});
		this.updateMedalList(mode);
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

	updateMedalList(mode = this.state.filterBy) {
		if ( this.loading ) return ;
		this.loading = true;

		this.fetchList(mode).then(data => {
			if ( data ) {
				let noMore, size;
				const list = data.list;
				noMore = list.length <= pageSize;
				size = this.state.size ? this.state.size : pageSize;

				let newState = { noMore, size };
				for ( let k in data ) {
					newState[k] = data[k];
				}

				this.setState(newState);
				this.loading = false;

				setTimeout(function() {
					const title = data.organisationName + '奖牌榜';
					if ( iframeEl ) {
						iframeEl.src = 'docmode://modifytitle/' + encodeURIComponent(title);
					} else {
						document.title = title;
					}
				}, 200);
			} else {
				if ( !this.state.list ) {
					this.setState({
						list: [],
						noMore: true
					});
					this.loading = false;
				}
			}
		});
	}

	fetchList(mode) {
		return new Promise(resolve => {
			const url = mode == 'province' ? 'http://2016.163.com/special/00050IV6/rioprovincerank.js?callback=rankcallback' : `${apiBaseUrl}medal/organisation/${this.organisation}/${ mode == 'date' ? 'dm' : 'tm' }.json?callback=me${ mode == 'date' ? 'e' : 'd' }&source=app`;

			getScript(url).then(json => {
				let data;
				if ( mode == 'date' ) {
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
				} else if ( mode =='medal') {
					if(json.medalTypeCmMap && json.mst ) {
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

					data = {
						list,
						organisationName: this.state.organisationName,
						organisationImgUrl: this.state.organisationImgUrl,
						medals: this.state.medals
					}
				}

				resolve(data);
			}).catch((e) => {
				console.warn(e);
				resolve();
			});
		});
	}

	loadMore() {
		if ( !this.state.list || this.state.noMore || this.loading ) return;

		let size = this.state.size + pageSize;
		this.loading = true;
		this.setState({
			size,
			noMore: this.state.list.length <= size
		});
		this.loading= false;
	}

   render() {
      return (
		  <div styleName="page">
			  <div styleName="page__bd">
				  <Focus />
					<OrgList switchDiscipline={this.switchDiscipline} switchFilter={this.switchFilter} navigateTo={this.navigateTo} {...this.state}/>
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
   <Organisation />
), document.getElementById('root'));