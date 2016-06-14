import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import '../../../css/widgets/empty.scss';


export default class extends Component {
	shouldComponentUpdate(nextProps) {
		return shallowCompare(this, nextProps);
	}

	render() {
		return <div className="empty">{this.props.children}</div>;
	}
}