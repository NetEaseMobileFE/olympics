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
import List from './components/medal/list';
import { api } from './components/medal/config';


const MEDAL = 'medal';
const CHINA = 'china';
const PERSONAL = 'personal';
const types = [MEDAL, CHINA, PERSONAL];
const minHeight = window.innerHeight - rem2px(4.68); // 用于保证列表滑动区域

@CSSModules(styles)
class Medal extends Component {
	constructor(props) {
		let expectedTab = getSearch().tab;
		super(props);
		this.state = {
			currType: expectedTab || MEDAL
		};
		this.loading = {};
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

	// unbindScroll() {
	// 	this.refs.loader.removeEventListener('scroll', this.scrollHandler);
	// };

	componentDidMount() {
		this.fetchList();
		this.swiper = new Swiper(this.refs.swiper, {
			autoHeight: true,
			resistanceRatio: .7,
			onSlideChangeStart: (s) => {
				let type = types[s.activeIndex];
				if ( type !== this.state.currType ) {
					this.setState({
						currType: type
					});
					this.fetchList(type, true);
				}
			}
			
		});
		this.bindScroll();
	}

	handleChange = currType => {
		this.setState({
			currType
		});
		this.swiper.slideTo(types.indexOf(currType));
		this.fetchList(currType, true);
	};

	fetchList(type = this.state.currType, first) {
		if ( this.loading[type] || ( first && this.state[type] ) ) return;
		let url;
		if ( type == PERSONAL ) {
			let pageNo = this.personalPageNo ? this.personalPageNo + 1 : 1;
			url = api.personal(pageNo);
		} else {
			url = api[type];
		}
		
		this.loading[type] = true;
		getScript(url).then(json => {
			let data, noMore;
			
			if ( type == MEDAL ) {
				data = json.msList.map(st => {
					st = st.medal;
					return {
						organisationName: st.organisationName,
						flag: st.organisationImgUrl,
						medals: [st.goldTOT, st.silverTOT, st.bronzeTOT, st.totalTOT]
					}
				});
				this.medalList = data;
				data = data.slice(0, Math.min(data.length, 20));
				noMore = this.medalList.length <= 20;
			} else if ( type == CHINA ) {
				data = json.mst.msList.map(st => {
					return {
						disciplineName: st.disciplineName,
						medals: [st.goldTOT, st.silverTOT, st.bronzeTOT, st.totalTOT]
					}
				});
				this.chinaList = data;
				data = data.slice(0, Math.min(data.length, 20));
				noMore = this.chinaList.length <= 20;
			} else {
				let personal = this.state[PERSONAL];
				this.personalPageNo = json.pageNo;
				data = json.mpsList.map(st => {
					return {
						athleteName: st.athleteName,
						organisationName: st.organisationName || '',
						flag: st.athleteMedalList[0].organisationImgUrl,
						medals: [st.gold, st.silver, st.bronze, st.total]
					}
				});
				
				if ( personal ) {
					data = personal.data.concat(data);
				}
				noMore = json.pageNo == json.pageNum;
			}
			
			this.setState({
				[type]: {
					data,
					noMore
				}
			});
			
			setTimeout(() => {
				this.swiper.update();
				this.loading[type] = false;
			}, 50);
		}).catch(() => {
			if ( !this.state[type] ) {
				this.setState({
					[type]: {
						data: [],
						noMore: true
					}
				});
			}
		});
	}

	loadMore() {
		let { currType } = this.state;
		if ( this.state[currType].noMore || this.loading[currType] ) return;
		
		if ( currType == PERSONAL ) {
			this.fetchList(currType);
		}  else {
			let list = currType == CHINA ? this.chinaList : this.medalList;
			let len = Math.min(this.state[currType].data.length + 20, list.length);
			
			this.loading[currType] = true;
			this.setState({
				[currType]: {
					data: list.slice(0, len),
					noMore: len == list.length
				}
			});
			setTimeout(() => {
				this.swiper.update();
				this.loading[currType] = false;
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
									return (
										<div className="swiper-slide" key={i} style={{ minHeight }}>
											<List list={state.data}
												  switchToChina={ type == MEDAL ? this.handleChange : null }
												  noMore={state.noMore} type={type}/>
											{
												type == CHINA ? <div styleName="bottom-bar" className={ state.data && state.data.length ? '' : 'is--sticky' }>
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


render((
	<Medal />
), document.getElementById('root'));