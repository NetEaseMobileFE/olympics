import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/schedule/panel.scss';
import { flagPath } from '../../components/schedule/config';
import Clip from '../common/clip';
import State from '../common/state';


/**
 * 单场比赛对手情况
 */
@CSSModules(styles)
class Competetion extends Component {
	render() {
		let { rivals, score } = this.props;
		let [ home, away ] = rivals;

		return (
			<div styleName="competition">
				<div styleName="competition__rival">
					<div styleName="competition__rival__player">{home.nation}</div>
					<img styleName="competition__rival__flag" src={flagPath + home.flag}/>
				</div>

				{
					score ?
						(
							<div styleName="competition__vs">
								<div styleName="competition__vs__score">{score[0]}</div>
								<div styleName="competition__vs__sep">:</div>
								<div styleName="competition__vs__score">{score[1]}</div>
							</div>
						) :
						(
							<div styleName="competition__vs" className="is-noscore">vs</div>
						)
				}

				<div styleName="competition__rival">
					<img styleName="competition__rival__flag" src={flagPath + away.flag}/>
					<span styleName="competition__rival__player">{away.nation}</span>
				</div>
			</div>
		)
	}
}


/**
 * 小组赛分组情况
 */
@CSSModules(styles)
class Matches extends Component {
	render() {
		return (
			<div styleName="matches">
				{
					this.props.matches.map((match, i) => {
						return (
							<div key={i} styleName="match">
								{
									match.finishTime ?
										<div styleName="match__time">{match.startTime}<span styleName="match__time__sep">-</span>{match.finishTime}</div> :
										<div styleName="match__time">{match.startTime}</div>
								}
								<div styleName="match__detail">
									<p styleName="match__detail__group"><span>{match.group}</span></p>
									<Competetion rivals={match.rivals} score={match.score}/>
								</div>
							</div>
						)
					})
				}
				<i styleName="matches__sharp"/>
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

	toggleFold = () => {
		this.setState({
			unfold: !this.state.unfold
		})
	};

	handleStateClick = type => {
		alert(type);
	};

	render() {
		let { 
			discipline, startTime, event, china, final,
			finished, liveSupported, date,
			rivals, score,
			matches
		} = this.props;
		
		let hasMatch = matches && matches.length;
		let unfold = this.state.unfold;
		let matchesComp = hasMatch && unfold ? <Matches key={1} matches={matches}/> : null;

		return (
			<div styleName="event-ctnr">
				<div styleName="event" onClick={hasMatch ? this.toggleFold : null}>
					{ ( final || china ) ? <Clip china={china} final={final} pcn={styles.event__clip}/> : null }
					<div styleName="event__time">{startTime}</div>
					<div styleName="event__detail">
						<div styleName="tags">
							<div styleName="tags__discipline">{discipline}</div>
							<div styleName="tags__state">
								<div styleName="tags__state__entity">
									<State liveSupported={liveSupported} startTime={startTime} finished={finished} date={date}
										   handleStateClick={this.handleStateClick}/>
								</div>
								<div styleName="tags__state__line"/>
							</div>
						</div>
						<div styleName="event-name">
							{event}
							{ hasMatch ? <div styleName="event-name__arrow" className={unfold ? 'is-unfold' : ''}/> : null }
						</div>
						{ rivals ? <Competetion rivals={rivals} score={score}/> : null }
					</div>
				</div>

				{matchesComp}
			</div>
		)
	}
}


/**
 * 小项列表
 */
@CSSModules(styles)
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showFinished: false
		}
	}

	handleClick = () => {
		this.setState({
			showFinished: true
		});
	};

	render() {
		let { label, events, date } = this.props;
		let finished = [];
		let playing = [];
		let arr;

		if ( label == '全部赛程' ) {
			events.forEach((event) => {
				arr = event.finished ? finished : playing;
				arr.push(event);
			});
		} else {
			playing = events;
		}

		return (
			<section styleName="panel">
				<div styleName="panel__tag">
					<div styleName="panel__tag__entity">{label}</div>
				</div>
				<div styleName="panel__main">
					{
						finished.length > 0 && !this.state.showFinished ?
							<div styleName="show-more" onClick={this.handleClick}>查看已结束赛程<i/></div> :
							finished.map((event, i) =>
								<Event key={i} {...event} date={date}/>
							)
					}
					{
						playing.map((event, i) =>
							<Event key={i} {...event} date={date}/>
						)
					}
				</div>
			</section>
		)
	}
}