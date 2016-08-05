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
			script.src = 'http://img3.cache.netease.com/f2e/wap/touch_special_olympic/olympic_index_2016/dist/scripts/libs/topbar.c9f9eb7f.js';
			// script.src = '/src/js/plugins/topbar.js';
			script.onload = function() {
				topbar.render('topbar-wrapper','course', 'http://3g.163.com/touch/2016');
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