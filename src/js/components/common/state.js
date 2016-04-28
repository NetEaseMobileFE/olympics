import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/widgets/state.scss';


@CSSModules(styles)
export default class extends Component {
	handleClick = e => {
		let { handleStateClick } = this.props;
		if ( handleStateClick ) {
			e.stopPropagation();
			handleStateClick(this.stateType);
		}
	};

	componentDidMount() {
		let { setStateType } = this.props;
		if ( setStateType ) {
			setStateType(this.stateType);
		}
	}

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
		this.stateType = stateType;

		return stateType ? (
			<div styleName={statecn} onClick={this.handleClick}>
				<div styleName={`${statecn}__icon`}/>
				<div styleName={`${statecn}__txt`}>{stateLabel}</div>
			</div>
		) : null;
	}
}