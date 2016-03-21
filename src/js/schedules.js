import 'core-js/fn/symbol';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/schedules';
import store from './redux/schedules/store';


render((
	<Provider store={store}>
		<App />
	</Provider>
), document.getElementById('root'));