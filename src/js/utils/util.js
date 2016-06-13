import { connect } from 'react-redux';
import merge from 'lodash.merge';


export let extend = merge;

export let round = (val, dec) => {
	let multiplier = Math.pow(10, dec);
	return Math.round(multiplier * val) / multiplier;
};

let ajaxCache = {};
export let ajax = option => {
	return new Promise((resolve, reject) => {
		let data, dataType, method;
		if ( !option.url ) {
			reject(new Error('Need for url'));
		}

		dataType = option.dataType || 'JSON';
		method = option.method ? option.method.toUpperCase() : 'GET';

		if ( !!option.data && typeof option.data !== 'string' ) {
			let v;
			data = [];
			for ( let key in option.data ) {
				v = option.data[key];
				if ( v === null ) v = '';
				data.push(key + '=' + v);
			}
			data = data.join('&');
		} else {
			data = option.data;
		}

		let symbol = [option.url, data].join('__'),
			dataCache = ajaxCache[symbol];

		if ( dataCache ) {
			resolve(dataCache);
		} else {
			let url = option.url;
			let request, sendData;

			if ( method == 'GET' && data ) {
				url = url + ( url.indexOf('?') != -1 ? '&' : '?' ) + data;
			}
			request = new XMLHttpRequest();
			request.open(method, url, true);
			if ( method == 'POST' ) {
				request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
				sendData = data;
			} else {
				sendData = null
			}
			request.onload = function() {
				if ( request.status >= 200 && request.status < 400 ) {
					let result = request.responseText;
					if ( dataType.toUpperCase() === 'JSON' ) {
						try{
							result = JSON.parse(result);
						}catch(e){
							reject(new Error(e))
						}
					}
					resolve(result);

					if ( option.cache !== false ) {
						ajaxCache[symbol] = result;
					}
				} else {
					reject(new Error(request.statusText));
				}
			};
			request.send(sendData);
		}
	});
};


/**
 * JSONP
 */
export let getScript = url => {
	return new Promise((resolve, reject) => {
		let script = document.createElement('script');
		let callbackName = url.match(/callback=(\w+)/)[1];
		
		window[callbackName] = json => {
			resolve(json)
		};

		script.async = true;
		script.src = url;
		script.onerror = function(e) {
			if ( e.type == 'error' ) {
				reject(new Error('Could not load script ' + url));
			}
		};
		document.head.appendChild(script);
	})
};


// export let formatDate = (date = Date.now(), format = 'yyyy-MM-dd') => {
export let formatDate = (date, format = 'yyyy-MM-dd') => {
	if ( !date ) { date = `2016/08/09` } // todo 模拟今天
	date = new Date(date);
	if ( !date || date.toUTCString() == 'Invalid Date' ) {
		return '';
	}
	
	const map = {
		'y': date.getFullYear(), //年份
		'M': date.getMonth() + 1, //月份 
		'd': date.getDate(), //日 
		'h': date.getHours(), //小时 
		'm': date.getMinutes() //分 
		// 's': date.getSeconds(), //秒 
		// 'q': Math.floor((date.getMonth() + 3) / 3), //季度 
		// 'S': date.getMilliseconds() //毫秒 
	};
	
	// format = format.replace(/([yMdhmsqS])+/g, (all, t) => {
	format = format.replace(/([yMdhm])+/g, (all, t) =>
		('0' + map[t]).slice(-all.length)
	);

	return format;
};

export let createConnect = mix => {
	if ( typeof mix == 'function' ) {
		return connect(mix);
	} else {
		return connect(state => {
			let props = {};
			for ( let i = 0; i < mix.length; i++ ) {
				let k = mix[i];
				props[k] = state[k];
			}

			return props;
		});
	}
};

export let getSearch = (href = window.location.search) => {
	const reg = new RegExp( "([^?=&]+)(=([^&]*))?", "g" );
	let data = {};

	href.replace(reg, ($0, $1, $2, $3) => {
		data[$1] = $3;
	});
	
	return data;
};