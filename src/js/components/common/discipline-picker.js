import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from 'css/modules/common/discipline-picker.scss';


@CSSModules(styles)
export default class extends Component {
	handleClick = value => {
		let { hide, onChange, disciplineName } = this.props;
		if ( value.name == disciplineName ) { // 取消选中
			value = null;
		}
		hide();
		onChange(value);
	};

	render() {
		let disciplineName = this.props.disciplineName;
		return (
			<div styleName="dp">
				<div styleName="capsules">
					{
						this.props.disciplines.map((dis, i) => {
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

							return <span styleName="capsule" onClick={this.handleClick.bind(this, dis)} className={cn} key={i}>{name}</span>
						})
					}
				</div>
			</div>
		);
	}
}