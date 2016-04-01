import React, { Component, PropTypes } from 'react';
import 'js/plugins/swiper.js';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import 'css/widgets/swiper.scss';
import styles from 'css/schedule.scss';

import Filter from './../common/filter';
import Datepicker from './../common/datepicker';
import Panel from './panel';

const testData = {
	"hot": [
		{
			"discipline": "场地自行车",
			"startTime": "9:48",
			"finishTime": "9:55",
			"event": "女子50米步枪三种姿势资格赛",
			"china": true,
			"final": true,
			"rivals": [
				{
					"nation": "中国",
					"flag": "flag1"
				},
				{
					"nation": "法国",
					"flag": "flag2"
				}
			],
			"score": [12, 9],
			"liveSupported": true
		},
		{
			"discipline": "场地自行车",
			"startTime": "14:48",
			"finishTime": "15:22",
			"event": "女子50米步枪三种姿势资格赛",
			"china": false,
			"final": false,
			"liveSupported": false,
			"matches": [
				{
					"group": "第1组",
					"startTime": "13:00",
					"finishTime": "13:40",
					"rivals": [
						{
							"nation": "中国",
							"flag": "flag1"
						},
						{
							"nation": "法国",
							"flag": "flag2"
						}
					]
				}
			]
		},
		{
			"discipline": "场地自行车",
			"startTime": "14:48",
			"finishTime": "15:22",
			"event": "女子50米步枪三种姿势资格赛",
			"china": false,
			"final": false,
			"liveSupported": false,
			"matches": [
				{
					"group": "第1组",
					"startTime": "13:00",
					"finishTime": "13:40",
					"rivals": [
						{
							"nation": "中国",
							"flag": "flag1"
						},
						{
							"nation": "法国",
							"flag": "flag2"
						}
					]
				}
			]
		}
	]
};

@CSSModules(styles)
class Schedule extends Component {
	componentDidMount() {
		let swiper = new Swiper(this.refs.swiper, {
			initialSlide: window.dateSwiper.activeIndex,
			resistanceRatio: .7
		});
		swiper.params.control = window.dateSwiper;
		window.mainSwiper = swiper;
	}

	render() {
		let label = "精选赛程";
		let events = testData.hot;
		let selectedDate = this.props.selectedDate;
		let schedules = this.props.schedules;

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
								this.props.sportsDates.map((date, i) => {
									let schedule = schedules[date];
									return (
										<div className="swiper-slide" key={i}>
											{ schedule && <Panel label={label} events={events} selectedDate={selectedDate}/> }
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

export default connect(state => state)(Schedule); // todo
