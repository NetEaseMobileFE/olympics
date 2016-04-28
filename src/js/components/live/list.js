import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/live/list.scss';
import { formatDate } from '../../utils/util';
import Clip from '../common/clip';
import State from '../common/state';

const today = formatDate();


/**
 * 小项赛程
 */
@CSSModules(styles)
class Item extends Component {
	handleClick = () => {
		if ( this.stateType ) {
			alert(this.stateType);
		}
	};

	setStateType = type => {
		this.stateType = type;
	};

	render() {
		let { 
			discipline, event, china, final, participants,
			startTime, finished, liveSupported, date
		} = this.props;

		return (
			<li styleName="item" onClick={this.handleClick}>
				{ ( final || china ) ? <Clip china={china} final={final} pcn={styles.item__clip}/> : null }
				<div styleName="item__name">{event}</div>
				<div styleName="item__info">
					<i styleName="item__info__dot"/>{discipline}<i styleName="item__info__sep"/>{participants}
				</div>
				<div styleName="item__state">
					<State liveSupported={liveSupported} startTime={startTime} finished={finished} date={date}
						   setStateType={this.setStateType}/>
				</div>
			</li>
		)
	}
}


/**
 * 小项列表
 */
@CSSModules(styles)
export default class extends Component {
	componentDidMount() {
		let { list, scrollTo, date } = this.props;
		let index;

		if ( date <= today ) {
			for ( let i = 0, len = list.length; i < len; i++ ) {
				if ( !list[i].finished ) {
					index = i;
					break;
				}
			}
		}

		if ( index ) {
			let offsetY = this.refs.list.children[index].offsetTop;
			scrollTo(offsetY);
		}
	}
	
	render() {
		let { list, date } = this.props;

		return (
			<ul styleName="list" ref="list">
				{
					list.map((item, i) => {
						return <Item {...item} date={date} key={i}/>
					})
				}
			</ul>
		)
	}
}