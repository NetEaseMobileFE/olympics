import React, { Component, PropTypes } from 'react';
import 'js/plugins/swiper.js';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import 'css/widgets/swiper.scss';
import styles from 'css/schedule.scss';

import Filter from '../common/filter';
import Datepicker from '../common/datepicker';
import Loader from '../common/loader'
import Panel from './panel';


@CSSModules(styles)
class Schedule extends Component {
	componentDidMount() {
		let swiper = new Swiper(this.refs.swiper, {
			initialSlide: window.dateSwiper.activeIndex,
			resistanceRatio: .7
		});
		swiper.params.control = window.dateSwiper;
		window.mainSwiper = this.swiper = swiper;
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
									let datas = schedule[date];
									let label, events;

									return (
										<div className="swiper-slide" key={i}>
											{
												datas ? (
													<Loader>
														{
															Object.keys(datas).map((k, i) => {
																label = ( k == 'hot' ? '精选' : '全部') + '赛程';
																events = datas[k];
																return <Panel key={i} label={label} events={events}
																			  date={date}/>
															})
														}
													</Loader>
												) : null
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

function mapStateToProps({ sportsDates, schedule }) {
	return {
		sportsDates,
		schedule
	}
}


export default connect(mapStateToProps)(Schedule);
