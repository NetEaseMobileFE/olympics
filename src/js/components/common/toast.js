import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/widgets/toast.scss';
import { createConnect } from '../../../js/utils/util';
import { toggleToast } from '../../redux/schedule/actions';


@createConnect([])
@CSSModules(styles)
export default class extends Component {
	shouldComponentUpdate(nextProps) {
		return shallowCompare(this, nextProps);
	}

	close = () => {
		let { dispatch } = this.props;
		dispatch(toggleToast(false));
	};
	
	onOk = () => {
		if ( this.props.onOk() === false ) {
			this.close();
		}
	};
	
	render() {
		const { msg, btns=['知道了'] } = this.props;
		
		return (
			<div styleName="mask" onClick={this.close}>
				<div styleName="toast">
					<div styleName="text">{msg}</div>
					<div styleName="btns">
						{
							btns.map((btn, i) => {
								return <div key={i} styleName="btn" onClick={ i == 0 ? this.close : this.onOk }>{btn}</div>
							})
						}
					</div>
				</div>
			</div>
		);
	}
}