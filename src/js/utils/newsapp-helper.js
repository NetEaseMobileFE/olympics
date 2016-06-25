import ua from './ua';


const alarmDef = {
	date: null,
	title: null,
	message: null,
	url: null,
	addprompt: '确认为该比赛添加提醒？',
	removeprompt: '确认删除该提醒？'
};
let nahContainer = document.createElement('div');
let iframe = document.createElement('iframe');

nahContainer.style.display = 'none';
iframe.style.display = 'none';
document.body.appendChild(iframe);
document.body.appendChild(nahContainer);

// function openLive(roomId) {
// 	if ( ua.isNewsApp ) {
// 		iframe.src = `newsapp://live/${roomId}`;
// 	} else {
// 		location.href = `http://m.163.com/newsapp/applinks.html?liveRoomid=${roomId}`;
// 	}
// }

let alarmPending = false;
let alarmQueue = [];
let alarmState = {};

function _alarm(action, data, resolve) {
	let id, value, elem, domStr = '';

	window[`__newsapp_alarm_${action}_done`] = function(state) {
		alarmState[data.url] = [action, state];
		resolve(state);
		if ( alarmQueue.length ) {
			_alarm.apply(null, alarmQueue.shift());
		} else {
			alarmPending = false;
		}
	};

	for ( let key in alarmDef ) {
		value = data[key] || alarmDef[key];
		id = `__newsapp_alarm_${key}`;
		elem = document.querySelector(`#${id}`);

		if ( document.querySelector(`#${id}`) ) {
			elem.innerHTML = value;
		} else {
			domStr += `<div style="display:none" id="${id}">${value}</div>`;
		}
	}

	if ( domStr ) {
		nahContainer.innerHTML += domStr;
	}

	iframe.src = `alarm://${action}`;
}

function alarm(action, data) {
	return new Promise((resolve, reject) => {
		if ( ua.isNewsApp ) {
			let state = alarmState[data.url];
			if ( typeof state != 'undefined' && state[0] == action ) {
				resolve(state[1]);
				return;
			}

			alarmQueue.push([action, data, resolve]);

			if ( !alarmPending ) {
				alarmPending = true;
				_alarm.apply(null, alarmQueue.shift());
			}
		} else {
			reject(new Error('Can\'t set alarm out of newsapp'));
		}
	});
}


export {
	// openLive,
	alarm
};