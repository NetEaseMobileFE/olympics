import React, { Component, PropTypes } from 'react';
import 'swiper';
import '../../../css/widgets/swiper.scss';
import CSSModules from 'react-css-modules';
import styles from '../../../css/schedule.scss';
import { createConnect } from '../../utils/util';
import Filter from '../common/filter';
import Datepicker from '../common/datepicker';
// import Loader from '../common/loader'
// import Panel from './panel';
import { selectChina, selectGold, selectDiscipline, selectDate } from '../../redux/schedule/actions';

const swiperHeight = window.innerHeight - rem2px(2.26) - 1;


@createConnect(['sportsDates', 'hotSchedule', 'mainSchedule'])
@CSSModules(styles)
export default class extends Component {
	componentDidMount() {
		this.swiper = new Swiper(this.refs.swiper, {
			initialSlide: window.dateSwiper.activeIndex,
			resistanceRatio: .7
		});
		this.swiper.params.control = window.dateSwiper;
		window.mainSwiper = this.swiper;
	}

	render() {
		let { sportsDates, hotSchedule, mainSchedule } = this.props;
		let filterActions = { selectChina, selectGold, selectDiscipline };
		console.log(this.props); // todo

		return (
			<div styleName="page">
				<header styleName="page__hd">
					<Filter {...filterActions}/>
					<Datepicker selectDate={selectDate}/>
				</header>

				<main styleName="page__bd">
					<div ref="swiper" className="swiper-container">

					</div>
				</main>
			</div>
		)
	}
}