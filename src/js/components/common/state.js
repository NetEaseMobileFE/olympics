import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/widgets/state.scss';
import ua from '../../utils/ua';
import * as nahelper from '../../utils/newsapp-helper';

const now = +new Date();

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
		e.preventDefault();

		let action = this.state.alarm ? 'remove' : 'add';
		// 由于精选和全部会重复，所以添加删除前先同步下
		nahelper.alarm('check', this.alarmConfig).then(state => {
			if ( this.state.alarm !== state ) {
				this.setState({
					alarm: state
				});
			}
			
			if ( ( action == 'add' && !state ) || ( action == 'remove' && state ) ) {
				nahelper.alarm(action, this.alarmConfig).then(state => {
					if ( state ) {
						this.setState({
							alarm: action == 'add'
						});
					}
				}).catch(error => console.warn(error));
			}
		});
	};

	componentDidMount() {
		if ( this.stateType == 'alarm' ) {
			let { startTime, roomId, matchName } = this.props;
			let matchTime = startTime + ':00';
			
			this.alarmConfig = {
				url: `newsapp://live/${roomId}`,
				date: matchTime,
				title: '网易新闻',
				message: `[直播提醒]${matchName}直播现在开始了`
			};
			
			// nahelper.alarm('check', this.alarmConfig).then(state => {
			// 	this.setState({
			// 		alarm: state
			// 	});
			// }).catch(error => console.warn(error));
		}
	}

	render() {
		const { live, isFinished, roomId, startTime } = this.props;
		let stateType;
		let stateLabel;
		const startTimeNumber = +new Date(startTime.replace(/-/g,'/'));

		if ( isFinished ) {
			stateType = 'live--fade';
			stateLabel = '直播回顾';
		} else if ( now > startTimeNumber ) { // 直播中
			stateType = 'live';
			if ( ua.isNewsApp ) {
				stateLabel = '正在直播';
			} else if ( live == 1 ) {
				stateLabel = '图文直播中';
			} else {
				stateLabel = '数据直播中';
			}
		} else if ( ua.isNewsApp && live == 1 && roomId ) {
			stateType = 'alarm';
			stateLabel = this.state.alarm == 0 ? '提醒' : '已开启';
		}

		let statecn = `label--${stateType}`;
		this.stateType = stateType;

		return stateType ? (
			<div styleName="state">
				<div styleName="state__entity">
					<div styleName={statecn} onClick={ stateType == 'alarm' ? this.handleClick : null }>
						{
							stateType == 'live' ?
								<div styleName={`${statecn}__icon`}>
									<i styleName={`${statecn}__icon__inner`}/>
									<i styleName={`${statecn}__icon__outer`}/>
								</div> :
								<div styleName={`${statecn}__icon`}/>
						}
						<div styleName={`${statecn}__txt`}>{stateLabel}</div>
					</div>
				</div>
				<div styleName="state__line"/>
			</div>
		) : null;
	}
}