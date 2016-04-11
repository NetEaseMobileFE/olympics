import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/widgets/clip.scss';


@CSSModules(styles)
export default class extends Component {
	render() {
		let { clips, pcn = ''} = this.props;
		let clipcn;

		return (
			<div styleName="clip-group" className={pcn}>
				{
					clips.map((clip, i) => {
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