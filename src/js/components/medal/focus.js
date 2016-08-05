import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/medal/focus.scss';
import 'swiper';
import '../../../css/widgets/swiper.scss';
import { ads } from '../medal/config';
import ua from '../../utils/ua';


const now = new Date();
const zero = +new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 零点
const currTime = +now;
let frames;

if ( currTime >= +new Date('2016/08/06') && currTime <= +new Date('2016/08/22') &&  // 8.6 - 8.22
	( currTime >= zero + 10 * 60 * 60 * 1000 && currTime <= zero + 12 * 60 * 60 * 1000 // 10:00 - 12:00
	|| currTime >= zero + 17 * 60 * 60 * 1000 && currTime <= zero + 18 * 60 * 60 * 1000 // 17:00 - 18:00
	|| currTime >= zero + 20 * 60 * 60 * 1000 && currTime <= zero + 21 * 60 * 60 * 1000 // 20:00 - 21:00
	)
) {
	frames = [ads[0], ads[2]];
} else {
	frames = [ads[1], ads[2]];
}

@CSSModules(styles)
export default class extends Component {
	shouldComponentUpdate() {
		return false;
	}
	
	componentDidMount() {
		this.swiper = new Swiper(this.refs.swiper, {
			loop: true,
			lazyLoading: true,
			pagination : '.swiper-pagination'
		});
	}

	render() {
		return (
			<div styleName="focus" className="swiper-container" ref="swiper">
				<div className="swiper-wrapper">
					{
						frames.map((frame, i) => {
							return (
								<a className="swiper-slide" styleName="focus-link" href={frame.href} target="_blank" key={i}>
									<img data-src={frame.src} className="swiper-lazy"/>
									<span className="swiper-lazy-preloader"/>
								</a>
							)
						})
					}
				</div>
				<div className="swiper-pagination"></div>
			</div>
		)
	}
}