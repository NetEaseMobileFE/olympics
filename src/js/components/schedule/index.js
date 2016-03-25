import styles from 'css/schedule.scss';
import CSSModules from 'react-css-modules';

import React, { Component, PropTypes } from 'react';
import Filter from './../common/filter';

import { connect } from 'react-redux';


@CSSModules(styles)
class Schedule extends Component {
	render() {
		return (
			<div styleName="page">
				<Filter/>
				{this.props.onlyChina && '中国'} /
				{this.props.onlyFinal && '决赛'} /
				{this.props.selectedEvent && this.props.selectedEvent.name} /
				{this.props.selectedDate}

			</div>
		)
	}
}

export default connect(state => state)(Schedule); // todo
