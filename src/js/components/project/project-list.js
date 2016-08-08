import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/project/list.scss';

@CSSModules(styles)
export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let { disciplineName, list, noMore, size } = this.props;

        list.map((v, i) => {
            v.medals.map((v, i) => {
                if(v.medalType === 'ME_GOLD') {
                    v.medalTypeClass = 'medal--gold';
                } else if(v.medalType === 'ME_SILVER') {
                    v.medalTypeClass = 'medal--silver';
                } else {
                    v.medalTypeClass = 'medal--bronze';
                }
            })
        });

        return (
            <div>
                <div styleName="project-title">
                    <h4><i styleName="medal-gold-v2">9</i><span>{disciplineName}</span>奖牌榜</h4>
                    <div styleName="selector">
                        <div styleName="selector__label">项目筛选</div>
                        <em styleName="selector__arrow"></em>
                    </div>
                </div>
                {
                    list.map((v, i) => {
                        return (
                            <section styleName="list" key={v.rsc}>
                                <div styleName="list_title">
                                    <div>{v.eventName}</div>
                                    <span>8月8日 09:45</span>
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
                                            v.medals.map((v, i) => {
                                                return (
                                                    <tr key={v.organisation}>
                                                        <td><em styleName={v.medalTypeClass}></em></td>
                                                        <td>
                                                            <img src={v.organisationImgUrl} />
                                                            {v.organisationName}
                                                        </td>
                                                        <td>
                                                            <div styleName="team">
                                                                {
                                                                    v.athletesList.map((v, i) => {
                                                                        let key = 'team' + i;
                                                                        return (
                                                                            <span key={key}>{v}</span>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <p>{v.scheduleResult}</p>
                                                            {v.recordIndicators ? <span styleName="record">{v.recordIndicators}</span>: null}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </section>
                        )
                    })
                }
            </div>
        )
    }
}