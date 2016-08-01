import ua from './ua';
import { TOGGLE_TOAST } from '../redux/schedule/types';


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

function _alarm(action, data, resolve) {
	let id, value, elem, domStr = '';

	window[`__newsapp_alarm_${action}_done`] = function(state) {
		resolve(state);
		
		if ( ua.isIos && action == 'add' && state == false ) {
			window.__newsapp_alarm_enable_done = function(enabled) {
				if ( !enabled ) {
					requestActivateAlarm();
				}
			};
			iframe.src = 'alarm://enable';
		}
		
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

		if ( elem ) {
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
		if ( ua.isNewsApp ) { // 安卓下添加删除取消后的回调未执行，这里过滤只队列化 check
			if ( action == 'check' ) {
				alarmQueue.push([action, data, resolve]);
				
				if ( !alarmPending ) {
					alarmPending = true;
					_alarm.apply(null, alarmQueue.shift());
				}
			} else {
				_alarm.apply(null, [action, data, resolve]);
				alarmPending = false;
			}
		} else {
			reject(new Error('Can\'t set alarm out of newsapp'));
		}
	});
}

function requestActivateAlarm() {
	window.store.dispatch({
		type: TOGGLE_TOAST,
		config: {
			msg: '开启通知以便准时接受直播开始提醒',
			btns: ['取消', '前往开启'],
			onOk() {
				iframe.src = 'pushview://applicationsettings';
			}
		}
	});
}


export {
	// openLive,
	alarm
};