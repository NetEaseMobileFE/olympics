export const disciplines = [
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
];

const apiBaseUrl = `http://data.2016.163.com/`;
// const apiBaseUrl = `http://220.181.98.148/`;
const sourceParam = '&source=app';

export const api = {
	medal: apiBaseUrl + 'medal/index.json?callback=mea' + sourceParam,
	china: mode => {
		return mode == 'province' ?
			'http://2016.163.com/special/00050IV6/rioprovincerank.js?callback=rankcallback' :
			`${apiBaseUrl}medal/organisation/CHN/${ mode == 'date' ? 'dm' : 'tm' }.json?callback=me${ mode == 'date' ? 'e' : 'd' }` + sourceParam
	},
	discipline: discipline => {
		return `${apiBaseUrl}medal/discipline/${discipline}.json?callback=mec${sourceParam}`;
	},
	personal: pageNo => {
		return `${apiBaseUrl}medal/personal/p_${pageNo}.json?callback=meh` + sourceParam
	}
};

const link = 'http://g.163.com/a?CID=44213&Values=924384932&__newsapp_target=_blank&Redirect=http://go.163.com/2016/0715/yili/';

export const ads = [{
	src: 'http://img6.cache.netease.com/apps/olympics2016/img/ad1s.gif',
	href: link
}, {
	src: 'http://img6.cache.netease.com/apps/olympics2016/img/ad1.gif',
	href: link
}, {
	src: 'http://img6.cache.netease.com/apps/olympics2016/img/ad2.jpg',
	href: 'http://g.163.com/a?CID=44221&Values=2122419098&__newsapp_target=_blank&Redirect=http://clickc.admaster.com.cn/c/a72763,b1227618,c369,i0,m101,h'
}];