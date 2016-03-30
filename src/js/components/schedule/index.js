import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import styles from 'css/schedule.scss';

import Filter from './../common/filter';
import Datepicker from './../common/datepicker';
import Section from './section';

const testData = {
	"hot": [
		{
			"discipline": "场地自行车",
			"startTime": "14:48",
			"finishTime": "15: 22",
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
			"finishTime": "15: 22",
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
	render() {
		let label = "精选赛程";
		let events = testData.hot;
		let selectedDate = this.props.selectedDate;

		return (
			<div styleName="page">
				<Filter/>
				<Datepicker/>

				<main styleName="page__body">
					<Section label={label} events={events} selectedDate={selectedDate}/>
					<section styleName="panel">
						<div styleName="tag-wrapper">
							<div styleName="tag">14/<small>8月</small> 精选赛程</div>
						</div>
					</section>
				</main>



				{this.props.onlyChina && '中国'} /
				{this.props.onlyFinal && '决赛'} /
				{this.props.selectedDiscipline && this.props.selectedDiscipline.name} /
				{this.props.selectedDate}
			</div>
		)
	}
}

export default connect(state => state)(Schedule); // todo
