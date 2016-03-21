import 'css/base/normalize.css';
import styles from 'css/schedules.scss';
import CSSModules from 'react-css-modules';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
	selectChina, selectFinal, selectEvent, selectDate
} from '../../redux/schedules/actions';


@CSSModules(styles)
class App extends Component {
	handleOnlyChinaChange = e => {
		const {dispatch} = this.props;
		dispatch(selectChina(e.target.checked))
	};

	handleOnlyFinalChange = e => {
		const {dispatch} = this.props;
		dispatch(selectFinal(e.target.checked))
	};

	handleEventChange = e => {
		const {dispatch} = this.props;
		dispatch(selectEvent(e.target.value))
	};

	handleDateChange = e => {
		const {dispatch} = this.props;
		dispatch(selectDate(e.target.value))
	};

	render() {
		return (
			<div>
				<header styleName="filter">
					<div styleName="checkbox">
						<div styleName="checkbox__box"></div>
						<span styleName="checkbox__label">中国赛程</span>
					</div>

					<div styleName="checkbox" className="is-checked">
						<div styleName="checkbox__box"><i/></div>
						<span styleName="checkbox__label">金牌赛程</span>
					</div>

					<div styleName="selector">
						<div styleName="selector__label">项目筛选</div>
						<i styleName="selector__arrow"/>
					</div>
				</header>

				<section styleName="datepicker">
					<div styleName="datepicker__rail">
						<div styleName="tab">
							<p styleName="tab__month">8月</p>
							<p styleName="tab__day">10</p>
						</div>
						<div styleName="tab">
							<p styleName="tab__month">8月</p>
							<p styleName="tab__day">11</p>
						</div>
						<div styleName="tab">
							<p styleName="tab__month">8月</p>
							<p styleName="tab__day">12</p>
						</div>
						<div styleName="tab" className="is-selected">
							<p styleName="tab__month">8月</p>
							<p styleName="tab__day">今日</p>
						</div>
						<div styleName="tab">
							<p styleName="tab__month">8月</p>
							<p styleName="tab__day">14</p>
						</div>
						<div styleName="tab">
							<p styleName="tab__month">8月</p>
							<p styleName="tab__day">15</p>
						</div>
						<div styleName="tab">
							<p styleName="tab__month">8月</p>
							<p styleName="tab__day">16</p>
						</div>
					</div>
				</section>


				<hr/>
				<hr/>
				<hr/>
				<input defaultValue={this.props.onlyChina} name="onlyChina" type="checkbox" onChange={this.handleOnlyChinaChange}/> 中国
				<input defaultValue={this.props.onlyFinal} name="onlyFinal" type="checkbox" onChange={this.handleOnlyFinalChange}/> 决赛

				<select defaultValue={this.props.selectedEvent} onChange={this.handleEventChange}>
					<option value="football">足球</option>
					<option value="volleyball">排球</option>
					<option value="swimming">游泳</option>
					<option value="diving">跳水</option>
				</select>

				<select defaultValue={this.props.selectedDate} onChange={this.handleDateChange}>
					<option value="0801">0801</option>
					<option value="0802">0802</option>
					<option value="0803">0803</option>
				</select>

				<hr/>
				{this.props.onlyChina && '中国'} {this.props.onlyFinal && '决赛'} {this.props.selectedEvent} {this.props.selectedDate}
			</div>
		)
	}
}
function mapStateToProps(state) {
	const {onlyChina, onlyFinal, selectedEvent, selectedDate} = state;
	return {
		onlyChina, onlyFinal, selectedEvent, selectedDate
	}
}
export default connect(mapStateToProps)(App)
