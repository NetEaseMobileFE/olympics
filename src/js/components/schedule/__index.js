import 'css/base/normalize.css';
import styles from 'css/schedule.scss';
import CSSModules from 'react-css-modules';

import React, { Component, PropTypes } from 'react';
// import { connect } from 'react-redux';
// import {
// 	selectChina, selectFinal, selectEvent, selectDate
// } from '../../redux/schedules/actions';


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
		dispatch(selectEvent(e.target.value));
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

				<main>
					<section styleName="panel">
						<div styleName="tag-wrapper">
							<div styleName="tag">精选赛程</div>
						</div>
						<ul styleName="list">
							<li styleName="list__item">
								<div styleName="schedule">
									<div styleName="clip-group">
										<div styleName="clip--red">
											<i styleName="clip--red__handle"/>
											<div styleName="clip--red__entity">中国</div>
										</div>
										<div styleName="clip--yellow">
											<i styleName="clip--yellow__handle"/>
											<div styleName="clip--yellow__entity">决赛</div>
										</div>
									</div>
									<div styleName="schedule__detail">
										<span styleName="schedule__detail__time">18:30</span>
										<span styleName="schedule__detail__event">游泳</span>
										<span styleName="schedule__detail__title">女子双打第2轮/1/4决赛</span>
										<div styleName="stat-wrapper">
											<div styleName="stat--live">
												<i styleName="stat--live__icon"/>
												<span styleName="stat--live__txt">正在直播</span>
											</div>
										</div>
									</div>
									<i styleName="schedule__gt"/>
								</div>

								<div styleName="matches">
									<div styleName="match">
										<div styleName="match__time">13:00 - 13:10</div>
										<div styleName="match__group">第1组</div>
										<ul styleName="competitions">
											<li styleName="competition">
												<div styleName="competition__rival">
													<span styleName="competition__rival__nation">中国</span>
													<img styleName="competition__rival__flag" src="/mocks/pic/flag1.png"/>
												</div>
												<div styleName="competition__score">vs</div>
												<div styleName="competition__rival">
													<img styleName="competition__rival__flag" src="/mocks/pic/flag2.png"/>
													<span styleName="competition__rival__nation">中国</span>
												</div>
											</li>
										</ul>
									</div>
									<i styleName="matches__sharp"/>
								</div>
								
							</li>

							<li styleName="list__item">
								<div styleName="schedule">
									<div styleName="clip-group">
										<div styleName="clip--red">
											<i styleName="clip--red__handle"/>
											<div styleName="clip--red__entity">中国</div>
										</div>
										<div styleName="clip--yellow">
											<i styleName="clip--yellow__handle"/>
											<div styleName="clip--yellow__entity">决赛</div>
										</div>
									</div>
									<div styleName="schedule__detail">
										<span styleName="schedule__detail__time">18:30</span>
										<span styleName="schedule__detail__event">游泳</span>
										<span styleName="schedule__detail__title">1/8淘汰赛5</span>
										<div styleName="stat-wrapper">
											<div styleName="stat--live">
												<i styleName="stat--live__icon"/>
												<span styleName="stat--live__txt">正在直播</span>
											</div>
										</div>
									</div>
									<i styleName="schedule__gt"/>
								</div>
							</li>
						</ul>
					</section>
					<section styleName="panel">
						<div styleName="tag-wrapper">
							<div styleName="tag">14/<small>8月</small> 精选赛程</div>
						</div>
					</section>
				</main>

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
