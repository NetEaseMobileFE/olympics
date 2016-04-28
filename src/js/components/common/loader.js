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

	scrollTo = offsetY => {
		let el = this.refs.loader;
		el.scrollTop = Math.min(el.scrollHeight - el.offsetHeight, offsetY);
	};

	render() {
		let { loading, children } = this.props;
		var newChildren = React.Children.map(children, child => {
			return React.cloneElement(child, { scrollTo: this.scrollTo })
		});
		return (
			<div styleName="loader" className="scrolling-content" ref="loader">
				{ loading ? <Loading/> : null }
				<div styleName="loader__entity" className={ loading ? 'down' : '' }>
					{ newChildren }
				</div>
			</div>
		)
	}
}