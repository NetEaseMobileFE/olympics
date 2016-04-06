import 'core-js/fn/symbol';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Schedule from './components/schedule';
import configureStore from './redux/schedule/store';
import { sportsDates, disciplines } from 'js/config';


const store = configureStore({
	sportsDates,
	disciplines
});

render((
	<Provider store={store}>
		<Schedule />
	</Provider>
), document.getElementById('root'));



// todo
// datepicker card 动效优化
// 小组赛 赛前不知道结束时间
// 提醒
// 打开直播