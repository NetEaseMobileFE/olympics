const UA = navigator.userAgent;
const isAndroid = /android|adr/gi.test(UA);

export default {
	isAndroid: isAndroid,
	isIos: /iphone|ipod|ipad/gi.test(UA) && !isAndroid,
	isNewsApp: /NewsApp\/[\d\.]+/gi.test(UA),
	// isWeixin: /MicroMessenger/gi.test(UA),
	// isQQ: /QQ\/\d/gi.test(UA),
	// isYixin: /YiXin/gi.test(UA),
	// isWeibo: /Weibo/gi.test(UA),
	// isTXWeibo: /T(?:X|encent)MicroBlog/gi.test(UA),
};