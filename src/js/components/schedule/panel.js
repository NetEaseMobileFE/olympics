import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/schedule/panel.scss';
import Clip from '../common/clip';
import State from '../common/state';
import Loading from '../common/loading';
import ua from '../../utils/ua';
import { getSearch } from '../../utils/util';


const liveUrl = 'http://3g.163.com/ntes/special/0034073A/olympic2016_live.html';
const search = getSearch();

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
								<div styleName="competition__vs__score">{formatResult(home)}</div>
								<div styleName="competition__vs__sep">:</div>
								<div styleName="competition__vs__score">{formatResult(away)}</div>
							</div>
						) :
						(
							<div styleName="competition__vs" className="is-noscore">vs</div>
						)
				}

				<div styleName="competition__rival">
					<img styleName="competition__rival__flag" src={away.flag}/>
					<div styleName="competition__rival__player">{away.name}</div>
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
			rsc, disciplineName, scheduleName, startTime,
			withChina, isFinished, isFinal, live, roomId,
			competitors, competitionType
		} = this.props;
		let chinaCompetitors, moreChinaCompetitors;
		let href;

		if ( ua.isNewsApp && live == 1 && roomId ) {
			href = `newsapp://live/${roomId}`;
		} else {
			href = `${liveUrl}?rsc=${rsc}`;
			if ( live == 1 && roomId ) {
				href += '&roomid=' + roomId;
			}
			if ( search && search.qd == 'sgoy' ) {
				href += '&qd=sgoy';
			}
			if ( ua.isNewsApp ) {
				href += '&__newsapp_target=_blank';
			}
		}
		
		if ( competitionType == 'A' && withChina ) {
			let maxNum = isFinal ? 3 : 4;
			chinaCompetitors = competitors.filter(competitor => competitor.code == 'CHN');
			if ( chinaCompetitors.length > maxNum ) {
				moreChinaCompetitors = true;
			}
			chinaCompetitors = chinaCompetitors.slice(0, maxNum);
		}
		
		return (
			<a styleName="event-ctnr" href={href} target="_blank">
				<div styleName="event">
					{ withChina || isFinal ? <Clip china={withChina} final={isFinal} pcn={styles.event__clip}/> : null }
					<div styleName="event__time">{startTime.slice(11, 16)}</div>
					<div styleName="event__detail">
						<div styleName="tags">
							<div styleName="tags__discipline">{disciplineName}</div>
							{
								<State roomId={roomId} live={live} startTime={startTime}
										   isFinished={isFinished} matchName={disciplineName + '-' + scheduleName}/>
							}
						</div>
						<div styleName="event-name">
							{scheduleName}
						</div>
						{
							competitors.length && competitionType == 'D' ?
								<Competetion competitors={competitors}/> :
								isFinished && competitors[0] ?
									<div styleName="competition__rival">
										<div styleName="competition__rival__player" className="long">
											<span className={ isFinal ? 'is--highlight' : '' }>{ isFinal ? '金牌' : '第一名'}：</span>{competitors[0].name}
										</div>
										<img styleName="competition__rival__flag" src={competitors[0].flag}/>
										{ competitors[0].record ? <div styleName="record">{competitors[0].record}</div> : null }
									</div> : null
						}
						{
							!isFinished && chinaCompetitors && chinaCompetitors.length ?
								<div styleName="competitors">
									<img styleName="competitors__flag" src={chinaCompetitors[0].flag}/>
									{
										chinaCompetitors.map((competitor, i) =>
											<span key={i} styleName="competitors__name">{competitor.name}</span>)
									}
									{ moreChinaCompetitors ? <span styleName="competitors__tip">等</span> : null }
									{ isFinal ? <span styleName="competitors__tip">有望冲金</span> : null }
								</div> : null
						}
					</div>
				</div>
			</a>
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
			pending: false
		}
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		return shallowCompare(this, nextProps, nextState);
	}

	handleClick = () => {
		this.props.showFinished();
		this.setState({
			pending: true
		});
	};

	render() {
		let { label, events, showToast, type, lastPageNo } = this.props;

		return (
			<section styleName="panel">
				<div styleName="panel__tag">
					<div styleName="panel__tag__entity">{label}</div>
				</div>
				<div styleName="panel__main">
					{
						this.state.pending && lastPageNo == 0 ?
							<div styleName="show-more"><Loading/></div> :
							type == 'active' ?
								<div styleName="show-more" onClick={this.handleClick}>查看全部赛程<i/></div> :
								null
					}
					{
						events && events.map(event =>
							<Event key={event.rsc} {...event} showToast={showToast}/>
						)
					}
				</div>
			</section>
		)
	}
}

function formatResult(competitor) {
	if ( competitor.result !== null ) {
		return competitor.result;
	} else if ( competitor.wlt ) {
		return competitor.wlt == 'w' ? '胜' : '负'
	} else {
		return '';
	}
	// if ( home.resultType == 'POINTS' || home.resultType == 'SCORE' ) {
	// 	return home.result;
	// } else {
	// 	return home.rank > away.rank ? '胜' : '负';
	// }
}