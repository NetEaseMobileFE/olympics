import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import shallowCompare from 'react-addons-shallow-compare';
import 'swiper';
import '../../../css/widgets/swiper.scss';
import '../../../css/widgets/nprogress.css';
import CSSModules from 'react-css-modules';
import styles from '../../../css/schedule.scss';
import { createConnect } from '../../utils/util';
import ua from '../../utils/ua';
import Topbar from './topbar';
import Filter from '../common/filter';
import Datepicker from '../common/datepicker';
import Loader from '../common/loader'
import Panel from './panel';
import Empty from '../common/empty';
import Toast from '../common/toast';
import { showTypeAll, showMoreSchedule, toggleToast } from '../../redux/schedule/actions';


const isNewsApp = ua.isNewsApp;
const swiperHeight = window.innerHeight - rem2px(isNewsApp ? 2.89 : 3.25 ) - 1;

@createConnect(['sportsDates', 'hotSchedule', 'mainSchedule', 'toast'])
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
	
	showToast = msg => {
		this.props.dispatch(toggleToast({
			msg
		}));
	};

	showFinished = () => {
		this.props.dispatch(showTypeAll());
	};

	showMore = () => {
		this.props.dispatch(showMoreSchedule());
	};

	render() {
		let { sportsDates, hotSchedule, mainSchedule, toast } = this.props;
		let ToastCmp = toast ? <Toast {...toast}/> : null;

		return (
			<div styleName="page" className={ isNewsApp ? 'bar--app' : 'bar--touch' }>
				<header styleName="page__hd">
					<Topbar/>
					<Filter/>
					<Datepicker/>
				</header>

				<main styleName="page__bd">
					<div ref="swiper" className="swiper-container" style={{ height: swiperHeight }}>
						<div className="swiper-wrapper">
							{
								sportsDates.map((date, i) => {
									let oneDayOfHot = hotSchedule[date] || {};
									let oneDayOfMain = mainSchedule[date] || {};
									let shouldShowMore = oneDayOfMain.list && !oneDayOfMain.noMore;
									
									return (
										<div className="swiper-slide" key={i}>
											<Loader loading={oneDayOfMain.loading} empty={!oneDayOfMain.list} showMore={shouldShowMore && this.showMore}>
												{   // 精选赛程
													oneDayOfHot.list ? <Panel label="精选赛程" events={oneDayOfHot.list} date={date} showToast={this.showToast}/> : null
												}
												{   // 全部赛程
													oneDayOfMain.list ?
														oneDayOfMain.list.length ?
															<Panel label="全部赛程" events={oneDayOfMain.list} date={date}
																   type={oneDayOfMain.type} lastPageNo={oneDayOfMain.lastPageNo}
																   showFinished={this.showFinished}
																   showToast={this.showToast}/> :
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
				</main>
				
				<ReactCSSTransitionGroup transitionName="toast" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
					{ToastCmp}
				</ReactCSSTransitionGroup>
			</div>
		)
	}
}