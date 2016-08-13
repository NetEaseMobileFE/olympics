import { connect } from 'react-redux';


// let ajaxCache = {};
// export let ajax = option => {
// 	return new Promise((resolve, reject) => {
// 		let data, dataType, method;
// 		if ( !option.url ) {
// 			reject(new Error('Need for url'));
// 		}
//
// 		dataType = option.dataType || 'JSON';
// 		method = option.method ? option.method.toUpperCase() : 'GET';
//
// 		if ( !!option.data && typeof option.data !== 'string' ) {
// 			let v;
// 			data = [];
// 			for ( let key in option.data ) {
// 				v = option.data[key];
// 				if ( v === null ) v = '';
// 				data.push(key + '=' + v);
// 			}
// 			data = data.join('&');
// 		} else {
// 			data = option.data;
// 		}
//
// 		let symbol = [option.url, data].join('__'),
// 			dataCache = ajaxCache[symbol];
//
// 		if ( dataCache ) {
// 			resolve(dataCache);
// 		} else {
// 			let url = option.url;
// 			let request, sendData;
//
// 			if ( method == 'GET' && data ) {
// 				url = url + ( url.indexOf('?') != -1 ? '&' : '?' ) + data;
// 			}
// 			request = new XMLHttpRequest();
// 			request.open(method, url, true);
// 			if ( method == 'POST' ) {
// 				request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
// 				sendData = data;
// 			} else {
// 				sendData = null
// 			}
// 			request.onload = function() {
// 				if ( request.status >= 200 && request.status < 400 ) {
// 					let result = request.responseText;
// 					if ( dataType.toUpperCase() === 'JSON' ) {
// 						try{
// 							result = JSON.parse(result);
// 						}catch(e){
// 							reject(new Error(e))
// 						}
// 					}
// 					resolve(result);
//
// 					if ( option.cache !== false ) {
// 						ajaxCache[symbol] = result;
// 					}
// 				} else {
// 					reject(new Error(request.statusText));
// 				}
// 			};
// 			request.send(sendData);
// 		}
// 	});
// };

// finally
Promise.prototype.finally = function(callback) {
	const P = this.constructor;
	return this.then(
		value  => P.resolve(callback()).then(() => value),
		reason => P.resolve(callback()).then(() => { throw reason })
	);
};

/**
 * JSONP
 */
const noop = function() {};
const scriptCache = {};
const pending = {};

export let getScript = (url, disableCache) => {
	let cache = !disableCache && scriptCache[url];
	let callbackName = url.match(/callback=(\w+)/)[1];
	if ( cache ) {
		// if ( cache instanceof Error ) {
		// 	return Promise.reject(cache);
		// } else {
			return Promise.resolve(cache);
		// }
	} else if ( pending[callbackName] ) {
		return new Promise(resolve => {
			pending[callbackName].finally(() => {
				pending[callbackName] = null;
				resolve(getScript(url));
			})
		});
	}

	let script = document.createElement('script');
	let cleanup = () => {
		if ( script && script.parentNode ) {
			script.parentNode.removeChild(script);
		}

		window[callbackName] = noop;
	};

	let prms = new Promise((resolve, reject) => {
		window[callbackName] = json => {
			cleanup();
			if ( !disableCache ) {
				scriptCache[url] = json;
			}
			resolve(json);
			pending[callbackName] = null;
		};

		script.async = true;
		script.src = url;
		script.onerror = function(e) {
			cleanup();
			if ( e.type == 'error' ) {
				let error = new Error('Could not load script ' + url);
				// scriptCache[url] = error;
				reject(error);
			}
			pending[callbackName] = null;
		};
		document.head.appendChild(script);
	});
	pending[callbackName] = prms;
	
	return prms;
};

/**
 * 格式化日期
 * @param date 日期，默认取当前时间
 * @param format 格式模板，默认 yyyy-MM-dd
 */
export let formatDate = (date = Date.now(), format = 'yyyy-MM-dd') => {
// export let formatDate = (date, format = 'yyyy-MM-dd') => {
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

/**
 * 创建 react connect
 * @param mix 如果是 function 在直接用 connect 封装， 否则按照对象做 state => props 映射
 */
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

/**
 * 将 href search 部分对象化
 * @param href 默认取 location.search
 */
export let getSearch = (href = location.search) => {
	const reg = new RegExp( "([^?=&]+)(=([^&]*))?", "g" );
	let data = {};

	href.replace(reg, ($0, $1, $2, $3) => {
		data[$1] = $3;
	});
	
	return data;
};


export const getIn = (obj, keys, arrayNotEmpty = true) => {
	let result;
	try {
		result = keys.split('.').reduce((p, c) => p[c], obj);
		if ( Object.prototype.toString.call(result) == '[object Array]' && !result.length && arrayNotEmpty ) {
			result = null;
		}
	} catch (e) {
		console.warn(e);
		result = null;
	}
	
	return result
};