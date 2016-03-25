import 'core-js/fn/symbol';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Schedule from './components/schedule';
import store from './redux/schedule/store';


render((
	<Provider store={store}>
		<Schedule />
	</Provider>
), document.getElementById('root'));