import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import shallowCompare from 'react-addons-shallow-compare';
import 'swiper';
import '../../../css/widgets/swiper.scss';
import '../../../css/widgets/nprogress.css';
import CSSModules from 'react-css-modules';
import styles from '../../../css/schedule.scss';
import ua from '../../utils/ua';
import { createConnect } from '../../utils/util';
import Topbar from './topbar';
import Filter from '../common/filter';
import Datepicker from '../common/datepicker';
import Main from './main';
import Toast from '../common/toast';
import { showTypeAll, showMoreSchedule, toggleToast, updateSportsDates } from '../../redux/schedule/actions';


const isNewsApp = ua.isNewsApp;
const isSkoy = window.location.href.indexOf('qd=skoy') > -1;

@createConnect(['sportsDates', 'hotSchedule', 'mainSchedule', 'toast'])
@CSSModules(styles)
export default class extends Component {
	shouldComponentUpdate(nextProps) {
		return shallowCompare(this, nextProps);
	}

	componentDidMount() {
		const { dispatch, sportsDates } = this.props;
		
		if ( !sportsDates ) {
			dispatch(updateSportsDates());
		}
	}
	
	showToast = msg => {
		this.props.dispatch(toggleToast({
			msg
		}));
	};

	showFinished = () => {
		this.props.dispatch(showTypeAll());
	};

	showMore = () => {
		this.props.dispatch(showMoreSchedule());
	};

	render() {
		let { sportsDates, hotSchedule, mainSchedule, toast } = this.props;
		let ToastCmp = toast ? <Toast {...toast}/> : null;

		return (
			sportsDates ? <div styleName="page" className={ isNewsApp ? 'bar--app' : ( isSkoy ? '' : 'bar--touch') }>
				<header styleName="page__hd">
					<Topbar/>
					<Filter/>
					<Datepicker/>
				</header>

				<main styleName="page__bd">
					<Main sportsDates={sportsDates} hotSchedule={hotSchedule} mainSchedule={mainSchedule}
						showToast={this.showToast} showFinished={this.showFinished} showMore={this.showMore}/>
				</main>
				
				<ReactCSSTransitionGroup transitionName="toast" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
					{ToastCmp}
				</ReactCSSTransitionGroup>
			</div> : null
		)
	}
}