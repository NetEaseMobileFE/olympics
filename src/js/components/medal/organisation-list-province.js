import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/medal/organisation-list-table.scss';


@CSSModules(styles)
export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    showIntro() {
        this.setState({show: !this.state.show})
    }

    render() {
        let { list, size } = this.props;

        return list && list.length ? (
            <div>
                <div styleName="province-intro" className={this.state.show ? 'show-intro' : ''}>
                    <ul>
                        <li>1：双人及团体项目均按照1枚奖牌计入该省/市(自治区)</li>
                        <li>2：香港与中华台北作为国际奥委会注册成员以独立地区身份参加奥运会，不在本次统计之列</li>
                        <li>3：运动员按照注册单位判断归属，非籍贯</li>
                    </ul>
                    <a styleName="zk-btn" onClick={this.showIntro.bind(this)}></a>
                </div>
                {
                    list.map((province, i) => {
                        return (
                        <div styleName="list" key={i}>
                            <table styleName="table-province">
                                <thead>
                                    <tr>
                                        <th colSpan="2">{province.name}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        province.medals.map((medal, i) => {
                                            let className = 'gold';
                                            if(i == 1) {
                                                className = 'silver';
                                            } else if(i == 2) {
                                                className = 'bronze';
                                            }
                                            return medal.length ? (
                                                <tr key={i}>
                                                    <td styleName="medal-item"><i styleName={`medal-${className}-v2`}>{medal.length}</i></td>
                                                <td>
                                                    {
                                                        medal.sort((a, b) => { return a.player_desc.length < b.player_desc.length ? -1 : 1 }).map((v, i) => {
                                                            return (<p key={i}><em>{v.player_name}</em><span styleName="dis-name">{v.player_desc}</span></p>)
                                                        })
                                                    }
                                                </td>
                                                </tr>
                                            ) : null
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        )
                    })
                }
            </div>
        ) : null
    }
}