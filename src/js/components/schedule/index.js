import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import styles from 'css/schedule.scss';

import Filter from './../common/filter';
import Datepicker from './../common/datepicker';
import Panel from './panel';

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
				<header styleName="page__hd">
					<Filter/>
					<Datepicker/>
				</header>

				<main styleName="page__bd">
					<Panel label={label} events={events} selectedDate={selectedDate}/>
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
