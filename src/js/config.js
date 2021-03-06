import Immutable from 'seamless-immutable';
import ua from './utils/ua';


let dates = [];
let i = 4;
while ( i <= 22 ) dates.push('2016-08-' + ('0' + i++).slice(-2));

const sportsDates = Immutable(dates);

const disciplines = Immutable([
	{ id: '',   name: "全部" },
	{ id: 'AR', name: "射箭" },
	{ id: 'AT', name: "田径" },
	{ id: 'BK', name: "篮球" },
	{ id: 'BX', name: "拳击" },
	{ id: 'DV', name: "跳水" },
	{ id: 'EQ', name: "马术" },
	{ id: 'FE', name: "击剑" },
	{ id: 'FB', name: "足球" },
	{ id: 'GT', name: "蹦床" },
	{ id: 'HB', name: "手球" },
	{ id: 'JU', name: "柔道" },
	{ id: 'RO', name: "赛艇" },
	{ id: 'SA', name: "帆船" },
	{ id: 'SH', name: "射击" },
	{ id: 'SW', name: "游泳" },
	{ id: 'TE', name: "网球" },
	{ id: 'VO', name: "排球" },
	{ id: 'WP', name: "水球" },
	{ id: 'WL', name: "举重" },
	{ id: 'WR', name: "摔跤" },
	{ id: 'BD', name: "羽毛球" },
	{ id: 'GO', name: "高尔夫" },
	{ id: 'HO', name: "曲棍球" },
	{ id: 'TT', name: "乒乓球" },
	{ id: 'TK', name: "跆拳道" },
	{ id: 'BV', name: "沙滩排球" },
	{ id: 'GA', name: "竞技体操" },
	{ id: 'GR', name: "艺术体操" },
	{ id: 'MP', name: "现代五项" },
	{ id: 'SY', name: "花样游泳" },
	{ id: 'TR', name: "三项全能" },
	{ id: 'OW', name: "马拉松游泳" },
	{ id: 'CF', name: "皮划艇静水" },
	{ id: 'CM', name: "山地自行车" },
	{ id: 'CR', name: "公路自行车" },
	{ id: 'CT', name: "场地自行车" },
	{ id: 'CB', name: "自行车小轮车" },
	{ id: 'RU', name: "七人制橄榄球" },
	{ id: 'CS', name: "皮划艇激流回旋" }
]);

const apiBaseUrl = `http://data.2016.163.com/schedule/`;
// const apiBaseUrl = `http://220.181.98.148/schedule/`;
const source = ua.isNewsApp || window.location.href.indexOf('spss=newsapp') ? 'app' : 'wap';
const sourceParam = '&source=' + source;

function assembleScheduleUrl(type, params) {
	if ( type == 'hot' ) {
		return assembleHotScheduleUrl(params.selectedDate);
	}
	
	let mode = checkMode(params);
	let { selectedDate, selectedDiscipline, mainSchedule } = params;
	let disciplineID = selectedDiscipline.id;
	let oneDay = mainSchedule[selectedDate];
	let pageNo = oneDay && oneDay.lastPageNo ? oneDay.lastPageNo + 1 : 1;
	let p = {
		selectedDate,
		disciplineID,
		pageNo
	};

	return type == 'active' ?
		assembleActiveScheduleUrl(mode, p) :
		assembleAllScheduleUrl(mode, p);
}


function assembleDateUrl(params) {
	let disciplineID = params.selectedDiscipline.id;
	let mode = checkMode(params);
	let url;

	// c: 中国， g: 金牌， d: 项目
	switch (mode) {
		case 'c':
			url = `organisation/CHN/dates.json?callback=sci`;
			break;
		case 'g':
			url = `date/gold_dates.json?callback=sck`;
			break;
		case 'd':
			url = `discipline/${disciplineID}/dates.json?callback=sch`;
			break;
		case 'cg':
			url = `date/chn_gold_dates.json?callback=scl`;
			break;
		case 'cd':
			url = `organisation/CHN/${disciplineID}/dates.json?callback=scj`;
			break;
		case 'gd':
			url = `date/gold/${disciplineID}.json?callback=scE`;
			break;
		case 'cgd':
			url = `date/chn_gold/${disciplineID}.json?callback=scy`;
			break;
		default:
			return;
	}

	return apiBaseUrl + url + sourceParam;
}

function assembleHotScheduleUrl(selectedDate) {
	selectedDate = selectedDate.replace(/-/g, '');
	return apiBaseUrl + `weight/8099/${selectedDate}.json?callback=scA` + sourceParam;
}

function assembleActiveScheduleUrl(mode, { selectedDate, disciplineID, pageNo }) {
	let url;
	selectedDate = selectedDate.replace(/-/g, '');

	// c: 中国， g: 金牌， d: 项目
	switch ( mode ) {
		case 'c':
			url = `run/organisation/CHN/${selectedDate}_${pageNo}.json?callback=scF`;
			break;
		case 'g':
			url = `run/date/${selectedDate}/gold_${pageNo}.json?callback=scG`;
			break;
		case 'd':
			url = `run/date/${selectedDate}/${disciplineID}_${pageNo}.json?callback=scH`;
			break;
		case 'cg':
			url = `run/date/${selectedDate}/chn_gold_${pageNo}.json?callback=scI`;
			break;
		case 'cd':
			url = `run/organisation/CHN/${selectedDate}/${disciplineID}_${pageNo}.json?callback=scJ`;
			break;
		case 'gd':
			url = `run/date/${selectedDate}/gold/${disciplineID}_${pageNo}.json?callback=scK`;
			break;
		case 'cgd':
			url = `run/date/${selectedDate}/chn_gold/${disciplineID}_${pageNo}.json?callback=scL`;
			break;
		default:
			url = `run/date/${selectedDate}_${pageNo}.json?callback=scM`;
			break;
	}

	return apiBaseUrl + url + sourceParam;
}

function assembleAllScheduleUrl(mode, { selectedDate, disciplineID, pageNo }) {
	let url;
	selectedDate = selectedDate.replace(/-/g, '');

	// c: 中国， g: 金牌， d: 项目
	switch ( mode ) {
		case 'c':
			url = `organisation/CHN/${selectedDate}_${pageNo}.json?callback=scfa`;
			break;
		case 'g':
			url = `date/${selectedDate}/gold_${pageNo}.json?callback=scna`;
			break;
		case 'd':
			url = `date/${selectedDate}/${disciplineID}_${pageNo}.json?callback=scca`;
			break;
		case 'cg':
			url = `date/${selectedDate}/chn_gold_${pageNo}.json?callback=scpa`;
			break;
		case 'cd':
			url = `organisation/CHN/${selectedDate}/${disciplineID}_${pageNo}.json?callback=scga`;
			break;
		case 'gd':
			url = `date/${selectedDate}/gold/${disciplineID}_${pageNo}.json?callback=scoa`;
			break;
		case 'cgd':
			url = `date/${selectedDate}/chn_gold/${disciplineID}_${pageNo}.json?callback=scqa`;
			break;
		default:
			url = `date/${selectedDate}_${pageNo}.json?callback=scba`;
			break;
	}

	return apiBaseUrl + url + sourceParam;
}

function assembleFragmentUrl(disciplines) {
	if ( typeof disciplines == 'string' ) {
		disciplines = [disciplines];
	}
	
	return `http://data.2016.163.com/stats/fragment/${disciplines.join('_')}.json?callback=stm${sourceParam}`;
}

function checkMode(params) {
	return `${params.onlyChina ? 'c' : ''}${params.onlyGold ? 'g' : ''}${params.selectedDiscipline.id ? 'd' : ''}`;
}


export {
	sportsDates,
	disciplines,
	assembleScheduleUrl,
	assembleDateUrl,
	assembleFragmentUrl
}