import React, { Component } from 'react';
import 'js/plugins/swiper.js';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import 'css/widgets/swiper.scss';
import styles from 'css/widgets/datepicker.scss';
import util from 'js/utils/util';
import { selectDate } from '../../redux/schedule/actions';


function createConnect(mix) {
	if ( typeof mix == 'function' ) {
		return connect(mix);
	} else {
		return connect(state => {
			let props = {};
			for ( let i = 0; i < mix.length; i++ ) {
				let k = mix[i];
				props[k] = state[k];
			}

			return props;
		});
	}
}


@createConnect(['selectedDate', 'sportsDates'])
@CSSModules(styles)
export default class Datepicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showDP: false
		};
	}

	componentDidMount() {
		let maxScaleX = 130 / 107;
		let maxScaleY = 168 / 146;
		let { selectedDate, sportsDates } = this.props;
		let lastIndex = sportsDates.length - 1;
		let that = this;
		let initIndex;
		let slideSize;
		
		// 计算初始日期，超出范围就取最早/晚那天
		if ( !selectedDate || selectedDate <= sportsDates[0] ) {
			initIndex = 0;
		} else if ( selectedDate >= sportsDates[lastIndex] ){
			initIndex = lastIndex;
		} else {
			initIndex = sportsDates.indexOf(selectedDate);
		}
		
		this.swiper = new Swiper(this.refs.swiper, {
			slidesPerView: 7,
			initialSlide: initIndex,
			centeredSlides: true,
			freeMode : true,
			freeModeSticky: true,
			freeModeMomentumRatio:.2,
			freeModeMomentumBounce: false,
			freeModeMinimumVelocity: .1, // 防止龟速
			watchSlidesProgress : true,
			resistanceRatio: 0,
			onSetTranslate(s) {
				let transform = s.translate;
				let center = -transform + s.width / 2;
				let slide, slideOffset, offsetMultiplier, scaleX, scaleY, slideTransform;
				let BOXSHADOW = '0 1px 2px rgba(0, 0, 0, 0.75)';
				slideSize = slideSize || s.slidesSizesGrid[0];
				
				//Each slide offset from center
				for ( var i = 0, length = s.slides.length; i < length; i++ ) {
					slide = s.slides.eq(i);
					slideOffset = slide[0].swiperSlideOffset;
					offsetMultiplier = Math.abs((center - slideOffset - slideSize / 2) / slideSize);
					offsetMultiplier = Math.min(util.round(offsetMultiplier, 2), 1);
					
					scaleX = 1 + (1 - offsetMultiplier) * (maxScaleX - 1);
					scaleY = 1 + (1 - offsetMultiplier) * (maxScaleY - 1);
					
					if ( scaleX < 1.004 ) scaleX = 1;
					if ( scaleY < 1.004 ) scaleY = 1;
					
					slideTransform = 'scale3d(' + scaleX + ', ' + scaleY + ', 1)';
					slide.transform(slideTransform);
					
					if ( scaleX > 1 && scaleY > 1 ) {
						slide[0].style.boxShadow = BOXSHADOW;
					} else {
						slide[0].style.boxShadow = '';
					}
				}
			},
			onSetTransition(s, transition) {
           		// s.slides.transition(transition);
				let start = Math.min(s.activeIndex, s.previousIndex);
				let end = Math.max(s.activeIndex, s.previousIndex);
				let transSlides = s.$([]);
				let others = s.$([]);

				for ( let i = 0, len = s.slides.length; i < len; i++ ) {
					if ( i >= start && i <= end ) {
						transSlides.add(s.slides.eq(i));
					} else {
						others.add(s.slides.eq(i))
					}
				}

				transSlides.transition(transition);
				others.transition(0);
			},
			onTransitionEnd(s) {
				if ( window.mainSwiper && mainSwiper.activeIndex != s.activeIndex ) {
					mainSwiper.slideTo(s.activeIndex, 0, false);
				}
			},
			onSlideChangeEnd(s) {
				that.props.dispatch(selectDate(that.props.sportsDates[s.activeIndex]));
			}
		});
		
		window.dateSwiper = this.swiper;
	}

	shouldComponentUpdate() {
		return false;
	}
	
	handleClick = (index) => {
		this.swiper.slideTo(index);
	};
	
	render() {
		return (
			<div ref="swiper" className="swiper-container" styleName="datepicker">
				<div className="swiper-wrapper" styleName="datepicker__rail">
					{
						this.props.sportsDates.map((date, i) => {
							let [, month, day] = date.split('-');
							return (
								<div onClick={this.handleClick.bind(this, i)} className="swiper-slide" styleName="tab" key={i}>
									<p styleName="tab__month">{month}月</p>
									<p styleName="tab__day">{day}</p>
								</div>
							)
						})
					}
				</div>
				<div styleName="datepicker__bg"></div>
			</div>
		)
	}
}