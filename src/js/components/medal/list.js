import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/medal/list.scss';
import { flagPath } from './config';


@CSSModules(styles)
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isUnfolded: false
		};
	}

	handleClick = () => {
		this.setState({
			isUnfolded: true
		});
	};

	render() {
		let { type, list } = this.props;
		let rankingOfChina;
		let th;
		if ( type == 'medal' ) {
			th = '国家/地区';
			for ( let i = 0, len = list.length; i < len; i++ ) {
				if ( list[i].state == '中国' ) {
					rankingOfChina = i;
					break;
				}
			}
		} else if ( type == 'china' ) {
			th = '项目';
		} else {
			th = '运动员';
		}

		let shouldUnfold = rankingOfChina && !this.state.isUnfolded && rankingOfChina > 10; // 是否需要显示“点击展开”
		
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
							if ( shouldUnfold ) { // 添加展开更多占位符，并隐藏中间名次的 row
								if ( i == 6 ) {
									return (
										<tr key={i}>
											<td colSpan="6" onClick={this.handleClick}><span styleName="unfold">点击展开</span></td>
										</tr>
									)
								} else if ( i > 6 && i < rankingOfChina ) {
									return null;
								}
							}

							let cn = '';
							let td;

							if ( type == 'medal' ) {
								td = (
									<div styleName="state" className={ row.state.length >= 6 ? 'is-long' : '' }>
										{row.state}<img src={flagPath + row.flag} styleName="state__flag"/>
									</div>
								);
								if ( row.state == '中国' ) {
									cn = 'is-highlight';
								}
							} else if ( type == 'china' ) {
								td = <div styleName="discipline">{row.discipline}</div>;
							} else {
								td = (
									<div styleName="athlete">
										<p>{row.name}</p>
										<div styleName="state">{row.state}<img src={flagPath + row.flag} styleName="state__flag"/></div>
									</div>
								);
							}

							return (
								<tr key={i} styleName={cn}>
									<td>{row.ranking}</td>
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