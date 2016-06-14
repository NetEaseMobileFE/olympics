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
		if ( !nextProps.showMore ) {
			this.unbindScroll();
		}
	}

	scrollTo = offsetY => {
		let el = this.refs.loader;
		el.scrollTop = Math.min(el.scrollHeight - el.offsetHeight, offsetY);
	};

	scrollHandler = () => {
		let loader = this.refs.loader;
		if ( loader.scrollHeight - loader.clientHeight - loader.scrollTop < 100 ) {
			this.timer && clearTimeout(this.timer);
			this.loadingAgain = true;
			this.timer = setTimeout(() => {
				this.props.showMore();
			}, 100);
		}
	};

	unbindScroll = () => {
		this.refs.loader.removeEventListener('scroll', this.scrollHandler);
	};

	componentDidMount() {
		this.props.showMore && this.refs.loader.addEventListener('scroll', this.scrollHandler, false);
	}

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