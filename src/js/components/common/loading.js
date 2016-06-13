import React, { Component } from 'react';
import '../../../css/widgets/loading.scss';


export default class extends Component {
	shouldComponentUpdate() {
		return false;
	}

	render() {
		return <div className="loading"><i/></div>;
	}
}