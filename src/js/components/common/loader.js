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
		if ( !this.props.showMore && nextProps.showMore ) {
			this.bindScroll();
		} else if ( this.props.showMore && !nextProps.showMore ) {
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
		let { loading, showMore, children, empty } = this.props;
		let newChildren = React.Children.map(children, child => {
			return React.cloneElement(child, { scrollTo: this.scrollTo })
		});
		let topLoadingVisible = empty && loading !== false;
		
		return (
			<div styleName="loader" className="scrolling-content" ref="loader">
				{ topLoadingVisible ? <Loading/> : null }
				<div styleName="loader__entity" className={ topLoadingVisible ? 'down' : '' }>
					{ newChildren }
					{ !topLoadingVisible && showMore ? <Loading/> : null }
				</div>
			</div>
		)
	}
}