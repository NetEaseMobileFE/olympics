// const apiBaseUrl = `http://data.2016.163.com/`; todo
const apiBaseUrl = `http://220.181.98.148/`;

export const api = {
	medal: apiBaseUrl + 'medal/index.json?callback=mea',
	china: apiBaseUrl + 'medal/organisation/CHN/pm.json?callback=mef',
	personal: pageNo => {
		return `${apiBaseUrl}medal/personal/p_${pageNo}.json?callback=meh`
	}
};