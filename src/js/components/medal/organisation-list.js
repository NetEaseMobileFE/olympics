import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/medal/organisation-list.scss';
import Loading from '../common/loading';
import OLD from './organisation-list-date';
import OLM from './organisation-list-medal';


const filters = [{
	id: 'date',
	label: '时间'
}, {
	id: 'medal',
	label: '奖牌'
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
		const List = filterBy == 'date' ? OLD : OLM;
		
		return (
			<div>
				{
					organisationName ? (
						<div styleName="info">
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
							<List list={list} size={size} switchDiscipline={switchDiscipline}/> :
							<div styleName="empty">暂时还没有奖牌产生</div>
				}
				{
					noMore !== true ? <Loading /> : null
				}
			</div>
		)
	}
};