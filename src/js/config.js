let i = 1;
let dates = [];
while ( i <= 30 ) dates.push('2016-04-' + ('0' + i++).slice(-2));
export const sportsDates = dates;

export const disciplines = [
	{ id: 100, name: "全部" },
	{ id: 1, name: "射箭" },
	{ id: 2, name: "田径" },
	{ id: 3, name: "羽毛球" },
	{ id: 4, name: "篮球" },
	{ id: 5, name: "沙滩排球" },
	{ id: 6, name: "拳击" },
	{ id: 8, name: "皮划艇静水" },
	{ id: 9, name: "小轮车" },
	{ id: 1, name: "山地自行车" },
	{ id: 1, name: "公路自行车" },
	{ id: 1, name: "场地自行车" },
	{ id: 1, name: "跳水" },
	{ id: 1, name: "马术" },
	{ id: 1, name: "击剑" },
	{ id: 1, name: "足球" },
	{ id: 1, name: "高尔夫" },
	{ id: 1, name: "体操" },
	{ id: 1, name: "蹦床" },
	{ id: 1, name: "艺术体操" },
	{ id: 1, name: "手球" },
	{ id: 1, name: "曲棍球" },
	{ id: 1, name: "柔道" },
	{ id: 1, name: "现代五项" },
	{ id: 1, name: "赛艇" },
	{ id: 1, name: "橄榄球" },
	{ id: 1, name: "帆船" },
	{ id: 1, name: "射击" },
	{ id: 1, name: "游泳" },
	{ id: 1, name: "花样游泳" },
	{ id: 1, name: "乒乓球" },
	{ id: 1, name: "跆拳道" },
	{ id: 1, name: "网球" },
	{ id: 1, name: "铁人三项" },
	{ id: 1, name: "排球" },
	{ id: 1, name: "水球" },
	{ id: 1, name: "举重" },
	{ id: 1, name: "摔跤" },
	{ id: 7, name: "皮划艇激流回旋" }
];

export const api = {
	sportsDates: './mocks/sports-dates.json',
	schedule: './mocks/schedule.json'
};

export const flagPath = 'http://img1.cache.netease.com/pcluster/olympicinfo/post/';