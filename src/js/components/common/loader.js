import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/common/loader.scss';
import Loading from './loading';


@CSSModules(styles)
export default class extends Component {
	componentWillUpdate(nextProps) {
		if ( nextProps.loading ) {
			this.refs.loader.scrollTop = 0;
		}
	}

	render() {
		let { loading, children } = this.props;
		return (
			<div styleName="loader" className="scrolling-content" ref="loader">
				{ loading ? <Loading/> : null }
				<div styleName="loader__entity" className={ loading ? 'down' : '' }>
					{ children }
				</div>
			</div>
		)
	}
}