import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from 'css/modules/common/loader.scss';


@CSSModules(styles)
export default class extends Component {
	render() {
		return (
			<div styleName="loader">
				{ this.props.children }
			</div>
		)
	}
}