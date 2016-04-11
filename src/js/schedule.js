import 'core-js/fn/promise';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/schedule/store';
import { sportsDates, disciplines } from './config';
import Schedule from './components/schedule';


const store = configureStore({
	sportsDates,
	disciplines
});

render((
	<Provider store={store}>
		<Schedule />
	</Provider>
), document.getElementById('root'));



// todo list
// datepicker card 动效优化
// 提醒
// 打开直播


// BUG
// flex   改为 block标签