import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/medal/organisation-list.scss';
import Loading from '../common/loading';

@CSSModules(styles)
export default class extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    switchDiscipline = discipline => {
        this.props.switchDiscipline(discipline);
    };

    render() {
        let { medals, organisationImgUrl, organisationName, list, noMore, size } = this.props;
        if ( !list ) return <Loading />;

        return list.length ? (
            <div>
				<div styleName="info">
					<div styleName="org-title"><img src={organisationImgUrl}/>{organisationName}</div>
					{
						medals && medals.length ?
							<div styleName="total-medals">累计获得<span>{medals[0]}</span>金<span>{medals[1]}</span>银<span>{medals[2]}</span>铜</div>
						 	: null
					}
				</div>
                {
                    list.slice(0, size).map((v, i) => {
						let date = parseInt(v.date.split('-')[1]) + '月' + parseInt(v.date.split('-')[2]) + '日';
						
                        return (
                            <section styleName="list" key={i}>
                                <div styleName="list_title">
                                    <div>{date}</div>
                                    <div>
                                        获得
                                        <i styleName="medal-gold-v2">{v.medals[0]}</i>
                                        <i styleName="medal-silver-v2">{v.medals[1]}</i>
                                        <i styleName="medal-bronze-v2">{v.medals[2]}</i>
                                    </div>
                                </div>
                                <table styleName="table-medal">
                                    <thead>
                                        <tr>
                                            <th styleName="medal-title">奖牌</th>
                                            <th>运动员/运动队</th>
                                            <th>项目</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {v.competitions.map((v, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td styleName="medal-title">
                                                        <i styleName="medal" className={v.medalType}></i>
                                                    </td>
                                                    <td styleName="dis-team">
                                                        <div>
                                                            {v.athletesList.map((v, i) => {
                                                                return <span key={i}>{v}</span>
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td styleName="dis-title" onClick={this.switchDiscipline.bind(this, v.discipline)}>
                                                        <a href="javascript:">
                                                            <span styleName="dis-name">{v.disciplineName}</span>
                                                            <p>{v.eventName}</p>
                                                            <em>{v.recordIndicators ? <span styleName="record">{v.recordIndicators}</span>: null}{v.scheduleResult}</em>
                                                        </a>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </section>
                        )
                    })
                }
                {
                    noMore !== true ? <Loading /> : null
                }
            </div>
        ) : <div styleName="empty">暂时还没有奖牌产生</div>
    }
}