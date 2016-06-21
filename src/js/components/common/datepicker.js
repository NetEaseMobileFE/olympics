import React, { Component } from 'react';
import 'swiper';
import CSSModules from 'react-css-modules';
import '../../../css/widgets/swiper.scss';
import styles from '../../../css/widgets/datepicker.scss';
import { formatDate, createConnect } from '../../../js/utils/util';
import ua from '../../../js/utils/ua';

const today = formatDate();
const isAndroid = ua.isAndroid;
const BOXSHADOW = '0 1px 2px rgba(0, 0, 0, 0.75)';

@createConnect(['selectedDate', 'sportsDates'])
@CSSModules(styles)
export default class Datepicker extends Component {
	constructor(props) {
		super(props);
		this.currIndex = null; // 可能是 swiper 的BUG，缓慢移动的时候 previousIndex 跟 activeIndex 相等, 自己标记一个
	}

	componentDidMount() {
		const maxScaleX = 130 / 107;
		const maxScaleY = 168 / 146;
		let that = this;
		let initIndex = this.findASuitbleIndex();
		let slideSize;

		this.swiper = new Swiper(this.refs.swiper, {
			slidesPerView: 7,
			initialSlide: initIndex,
			centeredSlides: true,
			roundLengths: true,
			freeMode : true,
			freeModeSticky: true,
			freeModeMomentumRatio:.2,
			freeModeMomentumBounce: false,
			freeModeMinimumVelocity: .1, // 防止龟速
			watchSlidesProgress : true,
			resistanceRatio: 0,
			// 应该是 swiper 组件的BUG，当 initialSlide 刚好是初始默认居中位置（当前设置就是7个中的第4个，也就是index = 3）时不触发 transition，
			// 这里在 init 之后手动添加样式，并触发 changeSlide
			// onInit(s) {
			// 	if ( initIndex == 3 ) {
			// 		let slide = s.slides.eq(3);
			// 		slide.transform(`scale3d(${maxScaleX}, ${maxScaleY}, 1)`);
			// 		if ( !isAndroid ) {
			// 			slide[0].style.boxShadow = BOXSHADOW;
			// 		}
			//
			// 		that.changeSlide(3);
			// 	}
			// },
			onSetTranslate(s) {
				let transform = s.translate;
				let center = -transform + s.width / 2;
				let slide, slideOffset, offsetMultiplier, scaleX, scaleY, slideTransform;
				slideSize = slideSize || s.slidesSizesGrid[0];

				//Each slide offset from center
				for ( var i = 0, length = s.slides.length; i < length; i++ ) {
					slide = s.slides.eq(i);
					slideOffset = slide[0].swiperSlideOffset;
					offsetMultiplier = parseFloat(Math.abs((center - slideOffset - slideSize / 2) / slideSize)).toFixed(2);
					offsetMultiplier = Math.min(offsetMultiplier, 1);

					scaleX = 1 + (1 - offsetMultiplier) * (maxScaleX - 1);
					scaleY = 1 + (1 - offsetMultiplier) * (maxScaleY - 1);

					if ( scaleX < 1.004 ) scaleX = 1;
					if ( scaleY < 1.004 ) scaleY = 1;

					slideTransform = `scale3d(${scaleX}, ${scaleY}, 1)`;
					slide.transform(slideTransform);

					if ( !isAndroid ) { // 安卓有点卡，降级掉阴影
						if ( scaleX > 1 && scaleY > 1 ) {
							slide[0].style.boxShadow = BOXSHADOW;
						} else {
							slide[0].style.boxShadow = '';
						}
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

				that.changeSlide(s.activeIndex);
			}
		});

		window.dateSwiper = this.swiper;
	}

	changeSlide(index) {
		if ( index != this.currIndex ) {
			let { dispatch, selectDate, sportsDates } = this.props;
			this.currIndex = index;
			this.currDate = sportsDates[index];
			dispatch(selectDate(this.currDate));
		}
	}

	/**
	 * 筛选合适的选中日期，优先级依次：选中/今天 > 选中/今天最近的下一个比赛日 > 超出范围就取最早/晚那天
	 */
	findASuitbleIndex() {
		let { sportsDates, selectedDate } = this.props;
		let lastIndex = sportsDates.length - 1;
		let index = null ;

		if ( sportsDates.indexOf(selectedDate) > -1 ) {
			index = sportsDates.indexOf(selectedDate);
		} else if ( sportsDates.indexOf(today) > -1 ) {
			index = sportsDates.indexOf(today);
		} else {
			index = this.findClosestIndex(selectedDate);

			if ( index === null ) {
				index = this.findClosestIndex(today);
			}

			if ( index === null ) {
				if ( selectedDate <= sportsDates[0] ) {
					index = 0;
				} else if ( selectedDate >= sportsDates[lastIndex] ) {
					index = lastIndex;
				}
			}
		}

		return index;
	}

	findClosestIndex(date) {
		let { sportsDates } = this.props;
		let index = null;

		for ( let i = 0, len = sportsDates.length; i < len; i++ ) {
			if ( sportsDates[i] > date ) {
				index = i;
				break;
			}
		}

		return index;
	}

	componentWillReceiveProps(nextProps) {
		if ( nextProps.sportsDates !== this.props.sportsDates ) {
			this.currDate = null;
		}
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.selectedDate !== this.currDate;
	}

	componentDidUpdate() {
		let index = this.findASuitbleIndex();
		this.currIndex = null;

		setTimeout(() => {
			this.swiper.update(true);
			window.mainSwiper.update(true);
			this.swiper.slideTo(index, 0);
			this.changeSlide(index, true);
		}, 10);
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
							if ( today == date ) {
								day = '今日';
							}

							return (
								<div onClick={this.handleClick.bind(this, i)} className="swiper-slide" styleName="tab" key={i}>
									<p styleName="tab__month">{parseInt(month)}月</p>
									<p styleName="tab__day">{day}</p>
								</div>
							)
						})
					}
				</div>
				<div styleName="datepicker__bg" className={ isAndroid ? '' : 'with-shadow' }></div>
			</div>
		)
	}
}