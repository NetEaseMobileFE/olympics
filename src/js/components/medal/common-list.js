import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/medal/list.scss';
import Loading from '../common/loading';


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
		let { type, list, noMore, size } = this.props;
		if ( !list ) return <Loading />;
		
		let rankOfChina;
		let th;
		if ( type == 'medal' ) {
			th = '国家/地区';
			list.some((row, i)=> {
				if ( row.organisationName == '中国' ) {
					rankOfChina = i + 1;
					return true;
				}
			});
		} else {
			th = '运动员';
		}

		let shouldUnfold = rankOfChina && !this.state.isUnfolded && rankOfChina > 10; // 是否需要显示“点击展开”
		
		return (
			list.length ? <section styleName="list" className={type}>
				<table styleName="table-medal">
					<thead>
					<tr>
						<th>排名</th>
						<th style={{width: '1%'}} className="state">{th}</th>
						<th><i styleName="medal--gold"/></th>
						<th><i styleName="medal--silver"/></th>
						<th><i styleName="medal--bronze"/></th>
						<th>总数</th>
					</tr>
					</thead>
					<tbody>
					{
						list.slice(0, size).map((row, i) => {
							// 添加展开更多占位符，并隐藏中间名次的 row
							if ( shouldUnfold ) {
								if ( i == 5 ) {
									return (
										<tr key='placeholder'>
											<td colSpan="6" onClick={this.handleClick}><span styleName="unfold">点击展开</span></td>
										</tr>
									)
								} else if ( i > 5 && i < rankOfChina - 1 ) {
									return null;
								}
							}
							
							let cn = '';
							let td;
							let key;
							let rank = i + 1;
							
							if ( type == 'medal' ) {
								td = (
									<div styleName="state" className={ row.organisationName.length >= 6 ? 'is-long' : '' }>
										{row.organisationName}<img src={row.flag} styleName="state__flag"/>
									</div>
								);
								if ( row.organisationName == '中国' ) {
									cn = 'is-highlight';
								}
								key = row.organisation;
								rank = row.rank;
							}  else {
								td = (
									<div styleName="athlete">
										<p styleName="athlete__name">{row.athleteName}</p>
										<div styleName="state">{row.organisationName}<img src={row.flag} styleName="state__flag"/></div>
									</div>
								);
								key = row.athleteCode;
							}
							
							return (
								<tr key={key} styleName={cn}
									onClick={ type == 'medal' && row.organisationName == '中国' ? this.props.switchToChina.bind(null, 'china') : null }>
									<td>{rank}</td>
									<td colSpan={ shouldUnfold && i == 6 ? '6' : false }>{td}</td>
									<td className="is-lighter">{row.medals[0]}</td>
									<td className="is-lighter">{row.medals[1]}</td>
									<td className="is-lighter">{row.medals[2]}</td>
									<td>{row.medals[3]}</td>
								</tr>
							)
						})
					}
					</tbody>
				</table>
				{
					noMore !== true ? <Loading /> : null
				}
			</section> : <div styleName="empty">暂时还没有奖牌产生</div>
		)
	}
}