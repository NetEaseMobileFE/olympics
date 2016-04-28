import React, { Component } from 'react';
import 'swiper';
import '../../../css/widgets/swiper.scss';
import CSSModules from 'react-css-modules';
import styles from '../../../css/live.scss';
import { createConnect } from '../../utils/util';
import Filter from '../common/filter';
import Datepicker from '../common/datepicker';
import Loader from '../common/loader'
import List from './list';
import { selectChina, selectFinal, selectDiscipline, selectDate } from '../../redux/live/actions';

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
		let filterActions = { selectChina, selectFinal, selectDiscipline };

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
									let oneDay = schedule[date] || {};
									return (
										<div className="swiper-slide" style={{ height: swiperHeight }} key={i}>
											<Loader loading={oneDay.loading}>
												{
													oneDay.list ? 
														<List list={oneDay.list} date={date}/>
														: null
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