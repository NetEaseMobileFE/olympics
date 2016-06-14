import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/common/discipline-picker.scss';


@CSSModules(styles)
export default class extends Component {
	shouldComponentUpdate(nextProps) {
		return shallowCompare(this, nextProps);
	}

	handleClick = value => {
		let { hide, onChange, disciplineName } = this.props;
		if ( value.name == disciplineName ) { // 取消选中
			if ( value.name == '全部' ) { // 全部标签不能取消
				hide();
				return;
			}
			value = null;
		}
		hide();
		onChange(value);
	};

	render() {
		let { disciplineName, disciplines } = this.props;
		
		return (
			<div styleName="dp">
				<div styleName="capsules">
					{
						disciplines.map((dis, i) => {
							let name = dis.name;
							let len = name.length;
							let cn;

							if ( len > 5 ) {
								cn = 'long';
							} else if ( len <= 3 ) {
								cn = '';
							} else {
								cn = 'c' + len;
							}

							if ( disciplineName == name ) {
								cn += ' is-selected';
							}

							return <span styleName="capsule" className={cn} key={i}
										 onClick={this.handleClick.bind(this, dis)}>{name}</span>
						})
					}
				</div>
			</div>
		);
	}
}