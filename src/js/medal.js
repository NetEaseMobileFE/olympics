import 'core-js/fn/promise';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { ajax, getSearch } from './utils/util';
import CSSModules from 'react-css-modules';
import styles from '../css/medal.scss';
import Switcher from './components/medal/switcher';
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
			list: null
		}
	}

	componentDidMount() {
		this.updateList();
	}

	handleChange = type => {
		this.setState({
			list: null,
			type
		});
		this.updateList(type);
	};

	updateList(type = this.state.type) {
		ajax({
			url: api[type]
		}).then(json => {
			this.setState({
				list: json.data
			})
		});
	}

	render() {
		let { list, type } = this.state;
		
		return (
			<div styleName="page">
				<div styleName="page__hd">
					<Switcher type={type} onTypeChange={this.handleChange}/>
				</div>
				<div styleName="page__bd">
					<div styleName="focus"></div>
					{ list ? <List list={list} type={type}/> : <Loading/> }
				</div>
			</div>
		)
	}
}


render((
	<Medal />
), document.getElementById('root'));