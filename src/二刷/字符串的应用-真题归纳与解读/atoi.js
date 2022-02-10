/**
 * @description 将字符串转换成整数
 * @param {string} str
 */
const atoi = (str) => {
	const reg = /\s*([-\+]?[0-9]+).*/;
	const group = str.match(reg);

	// 默认返回0
	let target = 0;
	// 如果能匹配上符合要求的字符串
	if (group) {
		target = +group[1];

		if (Number.isNaN(target)) {
			target = 0;
		}
	}

	const max = Math.pow(2, 31) - 1; // 允许返回的最大值
	const min = -max - 1; // 允许返回的最小值
	if (target > max) {
		return max;
	}

	if (target < min) {
		return min;
	}

	return target;
};

// 输入: "42"
// 输出: 42
console.log('42:', atoi('42'));


// 输入: " -42"
// 输出: -42
console.log('-42:', atoi('-42'));


// 输入: "4193 with words"
// 输出: 4193
console.log('4193 with words:', atoi('4193 with words'));


// 输入: "words and 987"
// 输出: 0
console.log('words and 987', atoi('words and 987'));


// 输入: "-91283472332"
// 输出: -2147483648
console.log('-91283472332', atoi('-91283472332'));

