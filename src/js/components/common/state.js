import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/widgets/state.scss';
import * as nahelper from '../../utils/newsapp-helper';


@CSSModules(styles)
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alarm: false
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowCompare(this, nextProps, nextState);
	}

	handleClick = e => {
		e.stopPropagation();
		let { roomId } = this.props;
		if ( this.stateType == 'alarm' ) {
			let action = this.state.alarm ? 'remove' : 'add';

			nahelper.alarm(action, this.alarmConfig).then(state => {
				if ( state ) {
					this.setState({
						alarm: action == 'add'
					});
				}
			}).catch(error => console.warn(error));
		} else {
			nahelper.openLive(roomId);
		}
	};

	componentDidMount() {
		let { date, startTime, roomId, matchName } = this.props;
		let matchTime = +new Date(date.replace(/-/g, '/') + ' ' + startTime);

		this.alarmConfig = {
			url: `newsapp://live/${roomId}`,
			date: matchTime,
			title: '网易新闻',
			message: `[直播提醒]${matchName}直播现在开始了`
		};

		nahelper.alarm('check', this.alarmConfig).then(state => {
			this.setState({
				alarm: state
			});
		}).catch(error => console.warn(error));
	}

	render() {
		const { live, isFinished } = this.props;
		let stateType;
		let stateLabel;

		if ( isFinished ) {
			stateType = 'live--fade';
			stateLabel = '直播结束';
		} else if ( live == 1 ) {
			stateType = 'live';
			stateLabel = '正在直播';
		} else {
			stateType = 'alarm';
			stateLabel = this.state.alarm == 0 ? '提醒' : '已开启';
		}

		let statecn = `state--${stateType}`;
		// stateType = 'alarm'; stateLabel = this.state.alarm == 0 ? '提醒' : '已开启';
		this.stateType = stateType;

		return (
			<div styleName={statecn} onClick={this.handleClick}>
				<div styleName={`${statecn}__icon`}/>
				<div styleName={`${statecn}__txt`}>{stateLabel}</div>
			</div>
		);
	}
}