export function parseTime(time){
	
	if (time.length === 0) {
		return null;
	}
	const format = '{y}-{m}-{d} {h}:{i}:{s}';
	let date;
	if (typeof time === 'object') {
		date = time;
	} else {
		if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
			time = parseInt(time);
		}
		if (typeof time === 'number' && time.toString().length === 10) {
			time = time * 1000;
		}
		date = new Date(time);
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key];
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value];
		}
		if (result.length > 0 && value < 10) {
			value = '0' + value;
		}
		return value || 0;
	})
	return time_str;
}
export function	todayTimeStr() {
		let today = new Date();
		let year = today.getFullYear(); // 获取当前年份
		let month = today.getMonth() + 1; // 获取当前月份（注意：月份从 0 开始计数，所以需要加 1）
		let day = today.getDate(); // 获取当前日（几号）
		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		// 格式化输出当前时间
		let nowTime = String(year) + String(month)+ String(day);
		return nowTime
}