import 'core-js/fn/promise';
import React, { Component } from 'react';
import { render } from 'react-dom';
import shallowCompare from 'react-addons-shallow-compare';
import 'swiper';
import '../css/widgets/swiper.scss';
import { getScript, getSearch } from './utils/util';
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
	   		filter: null
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
	
	setFilter = index => {
		this.setState({
			filter: index
		});
	}

	updateMedalList() {
		if ( this.loading ) return ;
		this.loading = true;

		this.fetchList().then(data => {
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
				}, 200)
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

	fetchList() {
		return new Promise(resolve => {
			const url = `${apiBaseUrl}medal/organisation/${this.organisation}/dm.json?callback=mee&source=app`;

			getScript(url, true).then(json => {
				let data;

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
				
				list.sort((a, b) => a.date > b.date ? -1 : 1);
				data = {
					list,
					organisationName: json.organisationName,
					organisationImgUrl: json.organisationImgUrl,
					medals: json.mst ? [json.mst.goldTOT, json.mst.silverTOT, json.mst.bronzeTOT] : []
				};

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
					<OrgList switchDiscipline={this.switchDiscipline} setFilter={this.setFilter} {...this.state}/>
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
   <Organisation />
), document.getElementById('root'));