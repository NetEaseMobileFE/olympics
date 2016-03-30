import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from 'css/widgets/state.scss';


@CSSModules(styles)
export default class extends Component {
	render() {
		const { liveSupported, finishTime, selectedDate } = this.props;
		let matchTime = selectedDate.replace('-', '') + finishTime.replace(':', '');
		let now = new Date();
		let stateType;
		let stateLabel;

		now = [now.getMonth() + 1, now.getDay(), now.getHours(), now.getMinutes()].join('');
		if ( now < matchTime ) {
			stateType = 'alarm';
			stateLabel = '提醒';
		} else if ( liveSupported ) {
			if ( now > matchTime ) {
				stateType = 'live--fade';
				stateLabel = '直播结束';
			} else {
				stateType = 'live';
				stateLabel = '正在直播';
			}
		}

		return stateType ? (
			<div styleName="state-wrapper">
				<div styleName={`state--${stateType}`}>
					<i styleName={`state--${stateType}__icon`}/>
					<span styleName={`state--${stateType}__txt`}>{stateLabel}</span>
				</div>
			</div>
		) : null;
	}
}