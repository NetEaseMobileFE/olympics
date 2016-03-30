import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from 'css/schedule.scss';

import Clip from '../common/clip';
import State from '../common/state';
const clips = [
	{ type: 'red', 'text': '中国' },
	{ type: 'yellow', 'text': '决赛' }
];


@CSSModules(styles)
class Competetion extends Component {
	render() {
		let { rivals, score } = this.props;
		let [ home, away ] = rivals;
		return (
			<div styleName="competition">
				<div styleName="competition__rival">
					<span styleName="competition__rival__nation">{home.nation}</span>
					<img styleName="competition__rival__flag" src={`/mocks/pic/${home.flag}.png`}/>
				</div>

				{
					score ?
						(
							<div styleName="competition__vs">
								<span styleName="competition__vs__score">12</span>
								<span styleName="competition__vs__sep">:</span>
								<span styleName="competition__vs__score">9</span>
							</div>
						) :
						(
							<div styleName="competition__vs" className="is-noscore">vs</div>
						)
				}
				<div styleName="competition__rival">
					<img styleName="competition__rival__flag" src={`/mocks/pic/${away.flag}.png`}/>
					<span styleName="competition__rival__nation">{away.nation}</span>
				</div>
			</div>
		)
	}
}


@CSSModules(styles)
class Matches extends Component {
	render() {
		return (
			<ul styleName="matches">
				{
					this.props.matches.map((match, i) => {
						return (
							<li key={i} styleName="match">
								<div styleName="match__time">{match.startTime}<span styleName="match__time__sep">-</span>{match.finishTime}</div>
								<div styleName="match__detail">
									<p styleName="match__detail__group"><span>{match.group}</span></p>
									<Competetion rivals={match.rivals} score={match.score}/>
								</div>
							</li>
						)
					})
				}
				<i styleName="matches__sharp"/>
			</ul>
		)
	}
}


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

	render() {
		let { 
			discipline, startTime, event, china, final,
			finishTime, liveSupported, selectedDate,
			rivals, score,
			matches
		} = this.props;
		let clipProp = [];
		let hasMatch = matches && matches.length;

		[china, final].forEach((v, i) => {
			v && clipProp.push(clips[i]);
		});

		return (
			<div>
				<div styleName="event" onClick={hasMatch ? this.toggleFold : null}>
					{
						clipProp.length ? <Clip clips={clipProp} pcn={styles.event__clip}/> : null
					}
					<div styleName="event__time">{startTime}</div>
					<div styleName="event__detail">
						<div styleName="tags">
							<div styleName="tags__discipline">{discipline}</div>
							<State liveSupported={liveSupported} finishTime={finishTime} selectedDate={selectedDate}/>
						</div>
						<div styleName="event-name" className={ `${hasMatch && 'is-foldable'} ${this.state.unfold && 'is-unfold'}`}>{event}</div>
						{
							rivals && <Competetion rivals={rivals} score={score}/>
						}
					</div>
				</div>
				{
					hasMatch && this.state.unfold ? <Matches matches={matches}/> : null
				}
			</div>
		)
	}
}


@CSSModules(styles)
export default class Section extends Component {
	render() {
		let { label, events, selectedDate } = this.props;
		return (
			<section styleName="panel">
				<div styleName="tag-wrapper">
					<div styleName="tag">{label}</div>
				</div>
				<ul styleName="list">
					{
						events.map((event, i) => {
							return (
								<li key={i} styleName="list__item">
									<Event {...event} selectedDate={selectedDate}/>
								</li>
							)
						})
					}
				</ul>
			</section>
		)
	}
}