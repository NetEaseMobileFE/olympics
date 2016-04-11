import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/widgets/state.scss';


@CSSModules(styles)
export default class extends Component {
	handleClick = (stateType, e) => {
		e.stopPropagation();
		alert(stateType); // todo
	};

	render() {
		const { liveSupported, startTime, finished, date } = this.props;
		let matchTime = +new Date(date.replace(/-/g, '/') + ' ' + startTime);
		let now = Date.now();
		let stateType;
		let stateLabel;

		if ( now < matchTime ) {
			stateType = 'alarm';
			stateLabel = '提醒';
		} else if ( liveSupported ) {
			if ( finished ) {
				stateType = 'live--fade';
				stateLabel = '直播结束';
			} else {
				stateType = 'live';
				stateLabel = '正在直播';
			}
		}

		let statecn = `state--${stateType}`;

		return stateType ? (
			<div styleName="state-wrapper">
				<div styleName={statecn} onClick={this.handleClick.bind(this, stateType)}>
					<div styleName={`${statecn}__icon`}/>
					<div styleName={`${statecn}__txt`}>{stateLabel}</div>
				</div>
				<i styleName="state-wrapper__line"/>
			</div>
		) : null;
	}
}