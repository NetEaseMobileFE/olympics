import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/medal/organisation-list.scss';
import Loading from '../common/loading';
import OLD from './organisation-list-date';
import OLM from './organisation-list-medal';
import OLP from './organisation-list-province';


let filters = [{
    id: 'date',
    label: '时间'
}, {
    id: 'medal',
    label: '奖牌'
}, {
    id: 'province',
    label: '省份'
}];

@CSSModules(styles)
export default class extends Component {
    switchFilter = mode => {
        if ( mode != this.props.filterBy ) {
            this.props.switchFilter(mode);
        }
    };

    render() {
        const { medals, organisationImgUrl, organisationName, filterBy, list, noMore, size, switchDiscipline } = this.props;
        if ( !list && !organisationName ) return <Loading />;

        let List = OLD;

        if(filterBy == 'medal') {
            List = OLM;
        } else if(filterBy == 'province') {
            List = OLP;
        }


        filters = organisationName == '中国' ? filters : filters.slice(0, 2);

        return (
            <div>
                {
                    organisationName ? (
                        <div styleName="info" className={ organisationName == '中国'? 'is-china' : '' } >
                            <div styleName="org-title">
                                <img src={organisationImgUrl}/>
                                <span styleName="org-title__name">{organisationName}</span>
                            </div>
                            <div styleName="total-medals">累计<span>{medals[0]}金</span><span>{medals[1]}银</span><span>{medals[2]}铜</span></div>
                            <div styleName="switcher">
                                {
                                    filters.map((filter, i) => {
                                        return <span styleName="switcher__label" className={ filterBy == filter.id ? 'is-chosen' : '' } key={i}
                                            onClick={this.switchFilter.bind(this, filter.id)}>按{filter.label}</span>
                                    })
                                }
                                <div styleName="switcher__inner"/>
                            </div>
                        </div>
                    ) : null
                }
                {
                    !list && organisationName ?
                        <Loading /> :
                        list && list.length ?
                            <List list={list} size={size} switchDiscipline={switchDiscipline} navigateTo={this.props.navigateTo}/> :
                            <div styleName="empty">暂时还没有奖牌产生</div>
                }
                {
                    noMore !== true ? <Loading /> : null
                }
            </div>
        )
    }
};