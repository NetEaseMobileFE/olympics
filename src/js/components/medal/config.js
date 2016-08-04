const apiBaseUrl = `http://data.2016.163.com/`;
// const apiBaseUrl = `http://220.181.98.148/`;

export const api = {
	medal: apiBaseUrl + 'medal/index.json?callback=mea',
	china: apiBaseUrl + 'medal/organisation/CHN/pm.json?callback=mef',
	personal: pageNo => {
		return `${apiBaseUrl}medal/personal/p_${pageNo}.json?callback=meh`
	}
};

const link = 'http://g.163.com/a?CID=44213&Values=924384932&__newsapp_target=_blank&Redirect=http://go.163.com/2016/0715/yili/';

export const ads = [{
	src: 'http://t.c.m.163.com/test/olympics/img/ad1s.gif',
	href: link
}, {
	src: 'http://t.c.m.163.com/test/olympics/img/ad1.gif',
	href: link
}, {
	src: 'http://t.c.m.163.com/test/olympics/img/ad2.jpg',
	href: 'http://g.163.com/a?CID=44221&Values=2122419098&__newsapp_target=_blank&Redirect=http://clickc.admaster.com.cn/c/a72763,b1227618,c369,i0,m101,h'
}];