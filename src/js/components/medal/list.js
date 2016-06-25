import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/medal/list.scss';


@CSSModules(styles)
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isUnfolded: false
		};
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		return shallowCompare(this, nextProps, nextState);
	}

	handleClick = () => {
		this.setState({
			isUnfolded: true
		});
	};

	render() {
		let { type, list } = this.props;
		let rankOfChina;
		let th;
		if ( type == 'medal' ) {
			th = '国家/地区';
			list.some((row, i)=> {
				if ( row.organisationName == '中国' ) {
					rankOfChina = i;
					return true;
				}
			});
		} else if ( type == 'china' ) {
			th = '项目';
		} else {
			th = '运动员';
		}

		let shouldUnfold = rankOfChina && !this.state.isUnfolded && rankOfChina > 10; // 是否需要显示“点击展开”
		
		return (
			<section styleName="list">
				<table styleName="table-medal">
					<thead>
					<tr>
						<th>排名</th>
						<th style={{width: '1%'}}>{th}</th>
						<th><i styleName="medal--gold"/></th>
						<th><i styleName="medal--silver"/></th>
						<th><i styleName="medal--bronze"/></th>
						<th>总数</th>
					</tr>
					</thead>
					<tbody>
					{
						list.map((row, i) => {
							// 添加展开更多占位符，并隐藏中间名次的 row
							if ( shouldUnfold ) {
								if ( i == 6 ) {
									return (
										<tr key={i}>
											<td colSpan="6" onClick={this.handleClick}><span styleName="unfold">点击展开</span></td>
										</tr>
									)
								} else if ( i > 6 && i < rankOfChina ) {
									return null;
								}
							}

							let cn = '';
							let td;

							if ( type == 'medal' ) {
								td = (
									<div styleName="state" className={ row.organisationName.length >= 6 ? 'is-long' : '' }>
										{row.organisationName}<img src={row.flag} styleName="state__flag"/>
									</div>
								);
								if ( row.organisationName == '中国' ) {
									cn = 'is-highlight';
								}
							} else if ( type == 'china' ) {
								td = <div styleName="discipline">{row.disciplineName}</div>;
							} else {
								td = (
									<div styleName="athlete">
										<p styleName="athlete__name">{row.athleteName}</p>
										<div styleName="state">{row.organisationName}<img src={row.flag} styleName="state__flag"/></div>
									</div>
								);
							}

							return (
								<tr key={i} styleName={cn}>
									<td>{i + 1}</td>
									<td colspan={ shouldUnfold && i == 6 ? '6' : false }>{td}</td>
									<td styleName="is-lighter">{row.medals[0]}</td>
									<td styleName="is-lighter">{row.medals[1]}</td>
									<td styleName="is-lighter">{row.medals[2]}</td>
									<td>{row.medals[3]}</td>
								</tr>
							)
						})
					}
					</tbody>
				</table>
			</section>
		)
	}
}