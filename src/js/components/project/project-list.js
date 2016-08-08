import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/project/list.scss';
import Loading from '../common/loading';

@CSSModules(styles)
export default class extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return shallowCompare(this, nextProps, nextState);
	}
	
	switchOrganisation = oid => {
		this.props.switchOrganisation(oid);
	};

    render() {
        let { disciplineName, list, noMore, size } = this.props;
		if ( !list ) return <Loading />;

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

        return list.length ? (
            <div>
                <div styleName="project-title">
                    <h4><i styleName="medal-gold-v2">9</i><span>{disciplineName}</span>奖牌榜</h4>
                    <div styleName="selector">
                        <div styleName="selector__label">项目筛选</div>
                        <em styleName="selector__arrow"></em>
                    </div>
                </div>
                {
					list.slice(0, size).map((v, i) => {
						console.log(v); // todo
						let matches = v.startTime.match(/\d{4}-(\d{2})-(\d{2}) ([\d:]{5}):.+/);
						
                        return (
                            <section styleName="list" key={v.rsc}>
                                <div styleName="list_title">
                                    <div>{v.eventName}</div>
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
                                            v.medals.map((v, i) => {
                                                return (
                                                    <tr key={v.organisation}>
                                                        <td><em styleName={v.medalTypeClass}/></td>
                                                        <td onClick={this.switchOrganisation.bind(this, v.organisation)}>
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
	
				{
					noMore !== true ? <Loading /> : null
				}
            </div>
        ) : <div styleName="empty">暂时还没有奖牌产生</div>
    }
}