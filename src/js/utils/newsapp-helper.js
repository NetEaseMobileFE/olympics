import ua from './ua';


let nahContainer = document.createElement('div');
let iframe = document.createElement('iframe');

nahContainer.style.display = 'none';
iframe.style.display = 'none';
nahContainer.appendChild(iframe);
document.body.appendChild(nahContainer);

function openLive(roomID) {
	if ( ua.isNewsApp ) {
		iframe.src = `newsapp://live/${roomID}`;
	} else {
		location.href = `http://m.163.com/newsapp/applinks.html?liveRoomid=${roomID}`;
	}
}

function alarm(action, data) {
	return new Promise((resolve, reject) => {
		if ( ua.isNewsApp ) {
			let id, value, elem, domStr = '';
			window[`__newsapp_alarm_${action}_done`] = function(state) {
				resolve(state);
			};

			for ( let key in data ) {
				if ( data.hasOwnProperty(key) ) {
					value = data[key];
					id = `__newsapp_alarm_${key}`;
					elem = document.querySelector(`#${id}`);

					if ( document.querySelector(`#${id}`) ) {
						elem.innerHTML = value;
					} else {
						domStr += `<div style="display:none" id="${id}">${value}</div>`;
					}
				}
			}

			if ( domStr ) {
				nahContainer.innerHTML += domStr;
			}

			iframe.src = `alarm://${action}`;
		} else {
			reject(new Error('Can\'t set alarm out of newsapp'));
		}
	});
}


export { openLive, alarm };