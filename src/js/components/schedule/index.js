import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import styles from 'css/schedule.scss';

import Filter from './../common/filter';
import Datepicker from './../common/datepicker';


@CSSModules(styles)
class Schedule extends Component {
	render() {
		return (
			<div styleName="page">
				<Filter/>
				<Datepicker/>

				<main>
					<section styleName="panel">
						<div styleName="tag-wrapper">
							<div styleName="tag">精选赛程</div>
						</div>
						<ul styleName="list">
							<li styleName="list__item">
								<div styleName="event">
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
									<div styleName="event__time">18:30</div>
									<div styleName="event__detail">
										<div styleName="tags">
											<div styleName="tags__discipline">游泳</div>
											<div styleName="stat-wrapper">
												<div styleName="stat--live">
													<i styleName="stat--live__icon"/>
													<span styleName="stat--live__txt">正在直播</span>
												</div>
											</div>
										</div>
										<div styleName="event-name">女子双打第2轮/1/4决赛</div>
										<div styleName="competition">
											<div styleName="competition__rival">
												<span styleName="competition__rival__nation">中国</span>
												<img styleName="competition__rival__flag" src="/mocks/pic/flag1.png"/>
											</div>
											<div styleName="competition__score">vs</div>
											<div styleName="competition__rival">
												<img styleName="competition__rival__flag" src="/mocks/pic/flag2.png"/>
												<span styleName="competition__rival__nation">中国</span>
											</div>
										</div>
									</div>
								</div>

								<ul styleName="matches">
									<li styleName="match">
										<div>13:00<span styleName="match__time__sep">-</span>13:10</div>
										<div styleName="match__detail">
											<p><span styleName="match__detail__group">第1组</span></p>
											<div styleName="competition">
												<div styleName="competition__rival">
													<span styleName="competition__rival__nation">中国</span>
													<img styleName="competition__rival__flag" src="/mocks/pic/flag1.png"/>
												</div>
												<div styleName="competition__score">vs</div>
												<div styleName="competition__rival">
													<img styleName="competition__rival__flag" src="/mocks/pic/flag2.png"/>
													<span styleName="competition__rival__nation">中国</span>
												</div>
											</div>
										</div>
									</li>
									<i styleName="matches__sharp"/>
								</ul>
							</li>
						</ul>
					</section>
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
