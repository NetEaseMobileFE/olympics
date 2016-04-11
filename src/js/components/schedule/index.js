import React, { Component, PropTypes } from 'react';
import 'swiper';
import '../../../css/widgets/swiper.scss';
import CSSModules from 'react-css-modules';
import styles from '../../../css/schedule.scss';
import { createConnect } from '../../utils/util';
import Filter from '../common/filter';
import Datepicker from '../common/datepicker';
import Loader from '../common/loader'
import Panel from './panel';

const swiperHeight = window.innerHeight - rem2px(2.26) - 1;


@createConnect(['sportsDates', 'schedule'])
@CSSModules(styles)
export default class extends Component {
	componentDidMount() {
		this.swiper = new Swiper(this.refs.swiper, {
			initialSlide: window.dateSwiper.activeIndex,
			resistanceRatio: .7
		});
		this.swiper.params.control = window.dateSwiper;
		window.mainSwiper = this.swiper;
	}

	render() {
		let { sportsDates, schedule } = this.props;

		return (
			<div styleName="page">
				<header styleName="page__hd">
					<Filter/>
					<Datepicker/>
				</header>

				<main styleName="page__bd">
					<div ref="swiper" className="swiper-container">
						<div className="swiper-wrapper">
							{
								sportsDates.map((date, i) => {
									let oneDay = schedule[date] || {};
									let sets = oneDay.sets;
									let label, events;

									return (
										<div className="swiper-slide" style={{ height: swiperHeight }} key={i}>
											<Loader loading={oneDay.loading}>
												{
													sets ? Object.keys(sets).map((k, i) => {
														label = ( k == 'hot' ? '精选' : '全部') + '赛程';
														events = sets[k];

														return <Panel key={i} label={label} events={events}
																	  date={date}/>
													}) : null
												}
											</Loader>
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