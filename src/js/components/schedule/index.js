import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import 'swiper';
import '../../../css/widgets/swiper.scss';
import CSSModules from 'react-css-modules';
import styles from '../../../css/schedule.scss';
import { createConnect } from '../../utils/util';
import Filter from '../common/filter';
import Datepicker from '../common/datepicker';
import Loader from '../common/loader'
import Panel from './panel';
import Empty from '../common/empty';
import { selectChina, selectGold, selectDiscipline, selectDate, showTypeAll, showMoreSchedule } from '../../redux/schedule/actions';


const swiperHeight = window.innerHeight - rem2px(2.26) - 1;

@createConnect(['sportsDates', 'hotSchedule', 'mainSchedule'])
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

	showFinished = () => {
		this.props.dispatch(showTypeAll());
	};

	showMore = () => {
		this.props.dispatch(showMoreSchedule());
	};

	render() {
		let { sportsDates, hotSchedule, mainSchedule } = this.props;
		let filterActions = { selectChina, selectGold, selectDiscipline };

		return (
			<div styleName="page">
				<header styleName="page__hd">
					<Filter {...filterActions}/>
					<Datepicker selectDate={selectDate}/>
				</header>

				<main styleName="page__bd">
					<div ref="swiper" className="swiper-container">
						<div className="swiper-wrapper">
							{
								sportsDates.map((date, i) => {
									let oneDayOfHot = hotSchedule[date] || {};
									let oneDayOfMain = mainSchedule[date] || {};
									let visible = oneDayOfHot.list || oneDayOfMain.list;
									let shouldShowMore = oneDayOfMain.list && !oneDayOfMain.noMore;

									return (
										<div className="swiper-slide" style={{ height: swiperHeight }} key={i}>
											{
												visible ? <Loader loading={oneDayOfMain.loading} showMore={ shouldShowMore ? this.showMore : null }>
													{
														oneDayOfHot.list ? <Panel label="精选赛程" events={oneDayOfHot.list} date={date}/> : null
													}
													{
														oneDayOfMain.list ?
															oneDayOfMain.list.length ?
																<Panel label="全部赛程" events={oneDayOfMain.list} date={date}
																	   type={oneDayOfMain.type} showFinished={this.showFinished}/> :
																<Empty>相关赛程为空</Empty> :
															null

													}
												</Loader> : null
											}
										</div>
									)
								})
							}
						</div>
					</div>
				</main>
			</div>
		)
	}
}