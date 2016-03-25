import styles from 'css/modules/schedule/test.scss';
import CSSModules from 'react-css-modules';

import React, { Component } from 'react';


@CSSModules(styles)
class Schedule extends Component {
	render() {
		return (
			<div styleName="test">4</div>
		)
	}
}

export default Schedule
