import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import styles from 'css/modules/common/filter.scss';
import { selectChina, selectFinal, selectDiscipline } from '../../redux/schedule/actions';

import DP from './discipline-picker';


@CSSModules(styles)
class Checkbox extends Component {
	render() {
		let { isChecked, label, onChange } = this.props;
		return (
			<div styleName="checkbox" className={isChecked && 'is-checked'} onClick={onChange}>
				<div styleName="checkbox__box"><i/></div>
				<span styleName="checkbox__label">{label}</span>
			</div>
		)
	}
}


@CSSModules(styles)
class Filter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showDP: false
		};
	}

	showDP = () => {
		this.setState({
			showDP: !this.state.showDP
		});
		document.querySelector('#root').classList.toggle('disable-scroll');
	};

	handleOnlyChinaChange = () => {
		let { dispatch } = this.props;
		dispatch(selectChina(!this.props.onlyChina));
	};

	handleOnlyFinalChange = () => {
		let { dispatch } = this.props;
		dispatch(selectFinal(!this.props.onlyFinal));
	};

	handleDisciplineChange = (value) => {
		let { dispatch } = this.props;
		dispatch(selectDiscipline(value));
	};

	render() {
		console.log(1); // todo
		let { onlyChina, onlyFinal, disciplines, selectedDiscipline } = this.props;
		selectedDiscipline = selectedDiscipline || {};
		let discName = selectedDiscipline.name || '';
		let dp = this.state.showDP ?
			<DP key={1} disciplines={disciplines} disciplineName={discName}
				hide={this.showDP} onChange={this.handleDisciplineChange}/>
			: null;

		return (
			<section className="page__header">
				<div styleName="filter">
					<Checkbox label="中国赛程" isChecked={onlyChina} onChange={this.handleOnlyChinaChange}/>
					<Checkbox label="金牌赛程" isChecked={onlyFinal} onChange={this.handleOnlyFinalChange}/>

					<div styleName="selector" onClick={this.showDP}>
						<div styleName={`selector__label${discName.length > 5 ? '--long' : ''}`}>{discName || '项目筛选'}</div>
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

function mapStateToProps({ onlyChina, onlyFinal, disciplines, selectedDiscipline }) {
	return {
		onlyChina, 
		onlyFinal,
		disciplines,
		selectedDiscipline
	}
}


export default connect(mapStateToProps)(Filter);