import 'core-js/fn/promise';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { getScript, getSearch } from './utils/util';
import CSSModules from 'react-css-modules';
import styles from '../css/medal.scss';
import Switcher from './components/medal/switcher';
import Focus from './components/medal/focus';
import List from './components/medal/list';
import Loading from './components/common/loading';
import { api } from './components/medal/config';


@CSSModules(styles)
class Medal extends Component {
	constructor(props) {
		let expectedTab = getSearch().tab;
		super(props);
		this.state = {
			type: expectedTab || 'medal',
			list: null,
			loading: true
		}
	}

	scrollHandler = () => {
		let docEl = document.documentElement;
		if ( docEl.scrollHeight - docEl.clientHeight - window.scrollY < 200 ) {
			if ( !this.state.loading ) {
				this.setState({
					loading: true
				});
				this.loadMore();
			}
		}
	};

	bindScroll = () => {
		window.addEventListener('scroll', this.scrollHandler, false);
	};

	unbindScroll = () => {
		window.removeEventListener('scroll', this.scrollHandler);
	};

	componentDidMount() {
		this.fetchList();
	}

	handleChange = type => {
		if ( type != 'personal' ) {
			this.unbindScroll();
		} else {
			this.pageNo = 0;
		}

		this.setState({
			list: null,
			loading: true,
			type
		});
		this.fetchList(type);
	};

	fetchList(type = this.state.type) {
		let url;
		if ( type == 'personal' ) {
			let pageNo = this.pageNo ? this.pageNo + 1 : 1;
			url = api.personal(pageNo);
		} else {
			url = api[type];
		}

		getScript(url).then(json => {
			let shouldBind = false;
			let list;
			if ( type == 'medal' ) {
				list = json.msList.map(st => {
					st = st.medal;
					return {
						organisationName: st.organisationName,
						flag: st.organisationImgUrl.replace('90x60', '61x45'),  // todo
						medals: [st.goldTOT, st.silverTOT, st.bronzeTOT, st.totalTOT]
					}
				});
				this.medalList = list;
				shouldBind = list.length > 20;
				list = list.slice(0, Math.min(list.length, 20));
			} else if ( type == 'china' ) {
				list = json.mst.msList.map(st => {
					return {
						disciplineName: st.disciplineName,
						medals: [st.goldTOT, st.silverTOT, st.bronzeTOT, st.totalTOT]
					}
				});
			} else {
				list = json.mpsList.map(st => {
					let flag = st.athleteMedalList[0].organisationImgUrl;
					return {
						athleteName: st.athleteName,
						organisationName: st.organisationName || '',
						flag: flag && flag.replace('90x60', '61x45'),  // todo
						medals: [st.gold, st.silver, st.bronze, st.total]
					}
				});

				if ( this.state.list ) {
					list = this.state.list.concat(list);
				}

				if ( json.pageNo == json.pageNum ) { // 最后一页了
					this.unbindScroll();
				} else {
					shouldBind = json.pageNo == 1 && json.pageNum != 1;
				}

				this.pageNo = json.pageNo;
			}

			this.setState({
				loading: false,
				list
			});

			if ( shouldBind ) {
				this.bindScroll();
			}
		}).catch(error => console.log(error));
	}

	loadMore() {
		let { type, list } = this.state;
		if ( type == 'medal' ) {
			let len = Math.min(list.length + 20, this.medalList.length);
			if ( len == this.medalList.length ) {
				this.unbindScroll();
			}
			this.setState({
				loading: false,
				list: this.medalList.slice(0, len)
			});
		} else if ( type == 'personal' ) {
			this.fetchList(type);
		}
	}

	render() {
		let { list, type, loading } = this.state;
		
		return (
			<div styleName="page">
				<div styleName="page__hd">
					<Switcher type={type} onTypeChange={this.handleChange}/>
				</div>
				<div styleName="page__bd">
					<Focus />
					{ list ? <List list={list} type={type}/> : null }
					{ loading ? <Loading/> : null }
				</div>
			</div>
		)
	}
}


render((
	<Medal />
), document.getElementById('root'));