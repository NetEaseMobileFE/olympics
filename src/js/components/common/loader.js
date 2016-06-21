import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/common/loader.scss';
import Loading from './loading';


@CSSModules(styles)
export default class extends Component {
	shouldComponentUpdate(nextProps) {
		return shallowCompare(this, nextProps);
	}

	componentWillUpdate(nextProps) {
		if ( nextProps.showMore ) {
			this.bindScroll();
		} else {
			this.unbindScroll();
		}
	}

	scrollTo = offsetY => {
		let el = this.refs.loader;
		el.scrollTop = Math.min(el.scrollHeight - el.offsetHeight, offsetY);
	};

	scrollHandler = () => {
		let loader = this.refs.loader;
		if ( loader.scrollHeight - loader.clientHeight - loader.scrollTop < 200 ) {
			this.loadingAgain = true;
			if ( !this.props.loading ) {
				this.props.showMore();
			}
		}
	};

	bindScroll = () => {
		this.refs.loader.addEventListener('scroll', this.scrollHandler, false);
	};

	unbindScroll = () => {
		this.refs.loader.removeEventListener('scroll', this.scrollHandler);
	};

	componentWillUnmount() {
		this.unbindScroll();
	}

	render() {
		let { loading, children } = this.props;
		var newChildren = React.Children.map(children, child => {
			return React.cloneElement(child, { scrollTo: this.scrollTo })
		});
		return (
			<div styleName="loader" className="scrolling-content" ref="loader">
				{ loading && !this.loadingAgain ? <Loading/> : null }
				<div styleName="loader__entity" className={ loading && !this.loadingAgain  ? 'down' : '' }>
					{ newChildren }
					{ loading && this.loadingAgain ? <Loading/> : null }
				</div>
			</div>
		)
	}
}