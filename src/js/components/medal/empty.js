import React, { Component } from 'react';


export default class extends Component {
	shouldComponentUpdate() {
		return false;
	}
	
	render() {
		return <div className={this.props.cn}>{this.props.text}</div>;
	}
}