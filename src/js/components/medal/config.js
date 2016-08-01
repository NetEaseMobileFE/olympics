// const apiBaseUrl = `http://data.2016.163.com/`; todo
const apiBaseUrl = `http://220.181.98.148/`;

export const api = {
	medal: apiBaseUrl + 'medal/index.json?callback=mea',
	china: apiBaseUrl + 'medal/organisation/CHN/pm.json?callback=mef',
	personal: pageNo => {
		return `${apiBaseUrl}medal/personal/p_${pageNo}.json?callback=meh`
	}
};

export const ads = [{ //todo
	src: 'http://imgm.ph.126.net/vQerYt5-YOCvZiCqjq2WPQ==/6598102208136414073.jpg',
	href: 'http://c.3g.163.com/nc/qa/gamecenter/v2_1/topic-group.html?topicid=933'
}, {
	src: 'http://imgm.ph.126.net/KHNOJoEo38IfcBCiPYbCNA==/6598095611067258097.jpg',
	href: 'http://m.163.com/gamecenter/link/107'
}, {
	src: 'http://imgm.ph.126.net/e3IvuDlC_gj5_GJwcAnspg==/6598083516439183794.jpg',
	href: 'http://qnm.163.com/m/download/neteasenews/'
}];