import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/widgets/clip.scss';


const clips = [
	{ type: 'red', 	  text: '中国' },
	{ type: 'yellow', text: '决赛' }
];

@CSSModules(styles)
export default class extends Component {
	shouldComponentUpdate(nextProps) {
		return shallowCompare(this, nextProps);
	}

	render() {
		let { china, final, pcn = ''} = this.props;
		let clipProp = [];
		let clipcn;

		[china, final].forEach((v, i) => {
			v && clipProp.push(clips[i]);
		});

		return (
			<div styleName="clip-group" className={pcn}>
				{
					clipProp.map((clip, i) => {
						clipcn = `clip--${clip.type}`;

						return (
							<div styleName={clipcn} key={i}>
								<i styleName={`${clipcn}__handle`}/>
								<div styleName={`${clipcn}__entity`}>{clip.text}</div>
							</div>
						)
					})
				}
			</div>
		);
	}
}