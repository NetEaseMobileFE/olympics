import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/common/filter.scss';
import { createConnect } from '../../utils/util';
import DP from './discipline-picker';


@CSSModules(styles)
class Checkbox extends Component {
	shouldComponentUpdate(nextProps) {
		return shallowCompare(this, nextProps);
	}

	render() {
		let { isChecked, label, onChange } = this.props;

		return (
			<div styleName="checkbox" className={ isChecked ? 'is-checked' : '' } onClick={onChange}>
				<div styleName="checkbox__box"><i/></div>
				<span styleName="checkbox__label">{label}</span>
			</div>
		)
	}
}

@createConnect(['onlyChina', 'onlyGold', 'disciplines', 'selectedDiscipline'])
@CSSModules(styles)
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showDP: false
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowCompare(this, nextProps, nextState);
	}

	showDP = () => {
		this.setState({
			showDP: !this.state.showDP
		});
	};

	handleOnlyChinaChange = () => {
		let { dispatch, selectChina, onlyChina } = this.props;
		dispatch(selectChina(!onlyChina));
	};

	handleOnlyGoldChange = () => {
		let { dispatch, selectGold, onlyGold } = this.props;
		dispatch(selectGold(!onlyGold));
	};

	handleDisciplineChange = (value) => {
		let { dispatch, selectDiscipline } = this.props;
		dispatch(selectDiscipline(value));
	};

	render() {
		let { onlyChina, onlyGold, disciplines, selectedDiscipline } = this.props;
		let discName = selectedDiscipline.name;
		let discAlias = discName == '项目筛选' ? '全部' :  discName;
		let dp = this.state.showDP ?
			<DP key={1} disciplines={disciplines} disciplineName={discAlias}
				hide={this.showDP} onChange={this.handleDisciplineChange}/>
			: null;

		return (
			<section className="page__header">
				<div styleName="filter">
					<Checkbox label="中国赛程" isChecked={onlyChina} onChange={this.handleOnlyChinaChange}/>
					<Checkbox label="金牌赛程" isChecked={onlyGold} onChange={this.handleOnlyGoldChange}/>

					<div styleName="selector" onClick={this.showDP}>
						<div styleName={`selector__label${ discName.length > 5 ? '--long' : '' }`}>{discName}</div>
						<i styleName="selector__arrow"/>
					</div>
				</div>

				<ReactCSSTransitionGroup transitionName="dp" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
					{dp}
				</ReactCSSTransitionGroup>
			</section>
		)
	}
}