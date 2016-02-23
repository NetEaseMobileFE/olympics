import React, { Component } from 'react';
import '../css/cuisineHN.css';


class Cuisine extends Component {
	render() {
		return (
			<ul className="dishes">
				<li className="dish">
					<i className="icon"/>
					<h4 className="name">剁椒鱼头</h4>
				</li>
				<li className="dish">
					<i className="icon"/>
					<h4 className="name">回锅肉</h4>
				</li>
			</ul>
		);
	}
}

export default Cuisine;