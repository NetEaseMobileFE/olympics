import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../css/menu.scss';
import Loading from './loading.jsx';


@CSSModules(styles)
export default class extends Component {
	constructor() {
		super();
		this.state = {
			CuisineHN: null,
			CuisineSC: null,
			CuisineGD: null
		};
	}

	componentDidMount() {
		this._getCuisines(800) // 模拟异步模块
			.then((cuisines) => {
				this.setState(cuisines);
			});
	}

	_getCuisines(delay) {
		return new Promise(resolve => {
			setTimeout(() => {
				require.ensure([], require => {
					resolve({
						CuisineHN: require('./cuisineHN.jsx').default,
						CuisineSC: require('./cuisineSC.jsx').default
					});
				});
			}, delay);
		});
	}

	render() {
		let { CuisineHN, CuisineSC } = this.state;
		return (
			<menu>
				<section styleName="menu">
					<h3 styleName="menu__title"><i/>湘菜</h3>
					{ CuisineHN ? <CuisineHN/> : <Loading/> }
				</section>

				<section styleName="menu">
					<h3 styleName="menu__title"><i/>川菜</h3>
					{ CuisineSC ? <CuisineSC/> : <Loading/> }
				</section>
			</menu>
		);
	}
}