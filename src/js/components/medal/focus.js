import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/medal/focus.scss';
import 'swiper';
import '../../../css/widgets/swiper.scss';
import ua from '../../utils/ua';


@CSSModules(styles)
export default class extends Component {
	componentDidMount() {
		this.swiper = new Swiper(this.refs.swiper, {
			loop: true,
			lazyLoading: true
		});
	}

	render() {
		return (
			<div styleName="focus" className="swiper-container" ref="swiper">
				<div className="swiper-wrapper">
					<a className="swiper-slide" href="http://www.163.com/" target="_blank">1</a>
					<div className="swiper-slide swiper-lazy-preloader">2</div>
				</div>
			</div>
		)
	}
}