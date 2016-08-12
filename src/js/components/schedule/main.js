import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/schedule.scss';
import ua from '../../utils/ua';
import Loader from '../common/loader'
import Panel from './panel';
import Empty from '../common/empty';


const isNewsApp = ua.isNewsApp;
const isSkoy = window.location.href.indexOf('qd=skoy') > -1;
const topHeight = isSkoy && !isNewsApp ? 2.27 : ( isNewsApp ? 2.89 : 3.25 );
const swiperHeight = window.innerHeight - rem2px(topHeight) - 1;

@CSSModules(styles)
export default class extends Component {
	shouldComponentUpdate(nextProps) {
		return shallowCompare(this, nextProps);
	}

	componentDidMount() {
		window.mainSwiper = this.swiper = new Swiper(this.refs.swiper, {
			initialSlide: window.dateSwiper.activeIndex,
			resistanceRatio: .7
		});
		this.swiper.params.control = window.dateSwiper;
	}
	
	render() {
		let { sportsDates, hotSchedule, mainSchedule, showMore, showToast, showFinished } = this.props;

		return (
			<div ref="swiper" className="swiper-container" style={{ height: swiperHeight }}>
				<div className="swiper-wrapper">
					{
						sportsDates.map((date, i) => {
							let oneDayOfHot = hotSchedule[date] || {};
							let oneDayOfMain = mainSchedule[date] || {};
							let shouldShowMore = oneDayOfMain.list && !oneDayOfMain.noMore;
							
							return (
								<div className="swiper-slide" key={i}>
									<Loader loading={oneDayOfMain.loading} empty={!oneDayOfMain.list} showMore={shouldShowMore && showMore}>
										{   // 精选赛程
											oneDayOfHot.list ? <Panel label="精选赛程" events={oneDayOfHot.list} showToast={showToast}/> : null
										}
										{   // 全部赛程
											oneDayOfMain.list ?
												oneDayOfMain.list.length ?
													<Panel label="全部赛程" events={oneDayOfMain.list}
														   type={oneDayOfMain.type} lastPageNo={oneDayOfMain.lastPageNo}
														   showFinished={showFinished}
														   showToast={showToast}/> :
													<Empty>相关赛程为空</Empty> :
												null
											
										}
									</Loader>
								</div>
							)
						})
					}
				</div>
			</div>
		)
	}
}