import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import styles from 'css/schedule.scss';

import Filter from './../common/filter';
import Datepicker from './../common/datepicker';


@CSSModules(styles)
class Schedule extends Component {
	render() {
		return (
			<div styleName="page">
				<Filter/>
				<Datepicker/>
				{this.props.onlyChina && '中国'} /
				{this.props.onlyFinal && '决赛'} /
				{this.props.selectedDiscipline && this.props.selectedDiscipline.name} /
				{this.props.selectedDate}
			</div>
		)
	}
}

export default connect(state => state)(Schedule); // todo
