import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/common/discipline-picker.scss';


@CSSModules(styles)
export default class extends Component {
	shouldComponentUpdate(nextProps) {
		return shallowCompare(this, nextProps);
	}

	handleClick = (value, e) => {
		e.preventDefault();
		e.stopPropagation();
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
	
	close = () => {
		this.props.hide &&	this.props.hide();
	};
	
	onTouchMove = (e) => {
		e.preventDefault();
	};
	
	render() {
		let { disciplineName, disciplines, cover } = this.props;
		
		return (
			<div styleName="dp" className={ cover ? 'cover' : '' } onClick={this.close} onTouchMove={ cover ? this.onTouchMove : null }>
				{
					cover ? (
						<div styleName="topbar">
							<span styleName="topbar__close" onClick={this.close}>取消</span>
							<div styleName="topbar__ttl">筛选项目</div>
						</div>
					) : null
				}
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