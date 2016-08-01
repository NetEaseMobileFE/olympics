import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/medal/switcher.scss';


const MEDAL = 'medal';
const CHINA = 'china';
const PERSONAL = 'personal';
const SEP = 'sep';
const options = [{
	type: MEDAL,
	label: '奖牌榜'
}, {
	type: SEP
}, {
	type: CHINA,
	label: '中国榜'
}, {
	type: SEP
}, {
	type: 'personal',
	label: '个人榜'
}];
const sequence = [MEDAL, CHINA, PERSONAL];

@CSSModules(styles)
export default class extends Component {
	shouldComponentUpdate(nextProps) {
		return shallowCompare(this, nextProps);
	}

	handleClick = t => {
		let { type, onTypeChange } = this.props;
		if ( type != t ) {
			onTypeChange(t);
		}
	};

	render() {
		let { type } = this.props;
		let index = sequence.indexOf(type);

		return (
			<section styleName="switcher-wrapper">
				<div styleName="switcher" className={`select-${index}`}>
					{
						options.map((opt, i) => {
							if ( opt.type == SEP ) {
								return <span styleName="switcher__sep" key={i}></span>
							} else {
								return <span onClick={this.handleClick.bind(this, opt.type)}
											 styleName="switcher__option" className={ opt.type == type ? 'is-selected' : '' }
											 key={i}>{opt.label}</span>
							}
						})
					}
				</div>
				<div styleName="switcher-wrapper__bg"></div>
			</section>
		)
	}
}