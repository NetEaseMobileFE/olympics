import React, { Component } from 'react';
import CSSModules from 'react-css-modules';

import styles from 'css/widgets/clip.scss';


@CSSModules(styles)
export default class extends Component {
	render() {
		const { clips, pcn = ''} = this.props;
		return (
			<div styleName="clip-group" className={pcn}>
				{
					clips.map((clip, i) => {
						return (
							<div styleName={`clip--${clip.type}`} key={i}>
								<i styleName={`clip--${clip.type}__handle`}/>
								<div styleName={`clip--${clip.type}__entity`}>{clip.text}</div>
							</div>
						)
					})
				}
			</div>
		);
	}
}