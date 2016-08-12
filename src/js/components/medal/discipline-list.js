import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/medal/discipline-list.scss';
import Loading from '../common/loading';

@CSSModules(styles)
export default class extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return shallowCompare(this, nextProps, nextState);
	}

    render() {
        let { disciplineName, list, noMore, size, goldTOT } = this.props;
		if ( !list ) return <Loading />;

        return (
            <div>
                <div styleName="project-title">
                    <h4><i styleName="medal-gold-v2">{goldTOT || 0}</i><span>{disciplineName}</span>奖牌榜</h4>
                    <div styleName="selector" onClick={this.props.toggleDP}>
                        <div styleName="selector__label">项目筛选</div>
                        <em styleName="selector__arrow"></em>
                    </div>
                </div>
                {
					list.length ? list.slice(0, size).map((event, i) => {
						let matches = event.startTime.match(/\d{4}-(\d{2})-(\d{2}) ([\d:]{5}):.+/);

                        return (
                            <section styleName="list" key={event.rsc}>
                                <div styleName="list_title">
                                    <div>{event.eventName}</div>
                                    <span>{`${parseInt(matches[1])}月${parseInt(matches[2])}日 ${matches[3]}`}</span>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>奖牌</th>
                                            <th>国家/地区</th>
                                            <th>运动员/运动队</th>
                                            <th>成绩</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            event.medals.map((medal, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td><em styleName={medal.medalType}/></td>
                                                        <td onClick={this.props.switchOrganisation.bind(this, medal.organisation)}>
															<div styleName="org">
																<img src={medal.organisationImgUrl} />
																{medal.organisationName}
															</div>
                                                        </td>
                                                        <td>
                                                            <div styleName="team">
                                                                {
                                                                    medal.athletesList.map((v, i) => {
                                                                        let key = 'team' + i;
                                                                        return (
                                                                            <span key={key}>{v}</span>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </td>
                                                        <td onClick={this.props.navigateTo.bind(this, medal.rsc)}>
                                                            <p>{medal.scheduleResult}</p>
                                                            {medal.recordIndicators ? <span styleName="record">{medal.recordIndicators}</span>: null}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </section>
                        )
                    }) : <div styleName="empty">暂时还没有奖牌产生</div>
                }

				{
					noMore !== true ? <Loading /> : null
				}
            </div>
        )
    }
}