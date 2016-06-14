import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/schedule/panel.scss';
import Clip from '../common/clip';
import State from '../common/state';
import ua from '../../utils/ua';


/**
 * 单场比赛对手情况
 */
@CSSModules(styles)
class Competetion extends Component {
	shouldComponentUpdate(nextProps) {
		return shallowCompare(this, nextProps);
	}

	render() {
		let { competitors } = this.props;
		let [ home, away ] = competitors;

		return (
			<div styleName="competition">
				<div styleName="competition__rival">
					<div styleName="competition__rival__player">{home.name}</div>
					<img styleName="competition__rival__flag" src={home.flag}/>
				</div>

				{
					home.result ?
						(
							<div styleName="competition__vs">
								<div styleName="competition__vs__score">{formatResult(home, away)}</div>
								<div styleName="competition__vs__sep">:</div>
								<div styleName="competition__vs__score">{formatResult(away, home)}</div>
							</div>
						) :
						(
							<div styleName="competition__vs" className="is-noscore">vs</div>
						)
				}

				<div styleName="competition__rival">
					<img styleName="competition__rival__flag" src={away.flag}/>
					<span styleName="competition__rival__player">{away.name}</span>
				</div>
			</div>
		)
	}
}


/**
 * 小项赛程
 */
@CSSModules(styles)
class Event extends Component {
	constructor(props) {
		super(props);
		this.state = {
			unfold: false
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowCompare(this, nextProps, nextState);
	}

	render() {
		let {
			disciplineName, scheduleName, date, startTime,
			withChina, isFinished, isFinal, live, roomId,
			competitors
		} = this.props;
		
		return (
			<div styleName="event-ctnr">
				<div styleName="event">
					{ ( withChina || isFinal ) ? <Clip china={withChina} final={isFinal} pcn={styles.event__clip}/> : null }
					<div styleName="event__time">{startTime}</div>
					<div styleName="event__detail">
						<div styleName="tags">
							<div styleName="tags__discipline">{disciplineName}</div>
							{
								ua.isNewsApp && roomId ? (
									<div styleName="tags__state">
										<div styleName="tags__state__entity">
											<State roomId={roomId} live={live} startTime={startTime}
												   isFinished={isFinished} date={date} matchName={disciplineName + '-' + scheduleName}/>
										</div>
										<div styleName="tags__state__line"/>
									</div>
								) : null
							}
						</div>
						<div styleName="event-name">
							{scheduleName}
						</div>
						{
							competitors.length == 2 ?
								<Competetion competitors={competitors}/> :
								isFinished && competitors[0] ?
									<div styleName="competition__rival">
										<span styleName="competition__rival__player">第一名：{competitors[0].name}</span>
										<img styleName="competition__rival__flag" src={competitors[0].flag}/>
									</div> : null
						}
					</div>
				</div>
			</div>
		)
	}
}


/**
 * 小项列表
 */
@CSSModules(styles)
export default class extends Component {
	shouldComponentUpdate(nextProps) {
		return shallowCompare(this, nextProps);
	}

	handleClick = () => {
		this.props.showFinished();
	};

	render() {
		let { label, events, date } = this.props;

		return (
			<section styleName="panel">
				<div styleName="panel__tag">
					<div styleName="panel__tag__entity">{label}</div>
				</div>
				<div styleName="panel__main">
					{
						this.props.type == 'active' ?
							<div styleName="show-more" onClick={this.handleClick}>查看已结束赛程<i/></div> :
							null
					}
					{
						events && events.map((event, i) =>
							<Event key={i} {...event} date={date}/>
						)
					}
				</div>
			</section>
		)
	}
}

function formatResult(home, away) {
	if ( home.resultType == 'POINTS' || home.resultType == 'SCORE' ) {
		return home.result;
	} else {
		return home.rank > away.rank ? '胜' : '负';
	}
}