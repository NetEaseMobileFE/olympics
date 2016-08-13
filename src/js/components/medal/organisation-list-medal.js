import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/medal/organisation-list-table.scss';


const medalTypes = ['ME_GOLD', 'ME_SILVER', 'ME_BRONZE'];

@CSSModules(styles)
export default class extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    switchDiscipline = discipline => {
        this.props.switchDiscipline(discipline);
    };
	
    render() {
        let { list, size } = this.props;

        return list && list.length ? (
			<div>
				{
					list.slice(0, size).map((v, i) => {
						return v ? (
							<section styleName="list" key={i}>
								<div styleName="list_title">
									<div styleName="medal-count">
										获得<span>{v.competitions.length}</span>
										<i styleName="medal" className={medalTypes[i]} style={{ display: 'inline-block'}}>&nbsp;</i>
									</div>
								</div>
								<table styleName="table-medal" className="is-loose">
									<thead>
									<tr>
										<th styleName="medal-title">项目</th>
										<th>运动员/运动队</th>
										<th>成绩</th>
									</tr>
									</thead>
									<tbody>
									{v.competitions.map((v, i) => {
										return (
											<tr key={i}>
												<td styleName="dis-title" onClick={this.switchDiscipline.bind(this, v.discipline)}>
													<a href="javascript:">
														<span styleName="dis-name">{v.disciplineName}</span>
														<p>{v.eventName}</p>
													</a>
												</td>
												<td styleName="dis-team">
													<div>
														{v.athletesList.map((v, i) => {
															return <span key={i}>{v}</span>
														})}
													</div>
												</td>
												<td styleName="result" onClick={this.props.navigateTo.bind(this, { rsc: v.rsc, report: v.report })}>
													<div>{v.scheduleResult}</div>
													{v.recordIndicators ? <span styleName="record">{v.recordIndicators}</span>: null}
												</td>
											</tr>
										)
									})}
									</tbody>
								</table>
							</section>
						) : null
					})
				}
			</div>
		) : null
    }
}