import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/schedule/topbar.scss';
import ua from '../../utils/ua';


@CSSModules(styles)
export default class extends Component {
	componentDidMount() {
		if ( !ua.isNewsApp ) {
			let script = document.createElement('script');
			script.async = true;
			script.src = 'http://img1.cache.netease.com/apps/olympics2016/js/topbar.js';
			// script.src = '/src/js/plugins/topbar.js';
			script.onload = function() {
				topbar.render('topbar-wrapper','course');
			};
			document.head.appendChild(script);
		}
	}

	render() {
		return (
			<div id="topbar-wrapper" styleName="topbar">
				{ ua.isNewsApp ? null : <top-bar></top-bar> }
			</div>
		)
	}
}