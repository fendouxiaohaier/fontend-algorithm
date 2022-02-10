/**
 * @description 描述：给定一个非空字符串 s，最多删除一个字符。判断是否能成为回文字符串
 * 输入: "aba"
 * 输出: True
 * 示例 2:
 * 输入: "abca"
 * 输出: True
 * 解释: 你可以删除c字符。
 * @param {string} str
 */
const validPalindrome = (str) => {
	const len = str.length;

	let i = 0; // 作为左子针
	let j = len - 1; // 作为右子针

	// 左右指针不停的往中间靠
	while (i < j && str[i] === str[j]) {
		i++;
		j--;
	}

	// 尝试左边的跳过一个字符来判断i与j中间的字符是否是回文
	if (isPalindrome(i++, j)) {
		return true;
	}

	// 尝试右边的跳过一个字符来判断i与j中间的字符是否是回文
	if (isPalindrome(i, j--)) {
		return true;
	}

	return false;

	/**
	 * 判断指针之间的字符串是否是回文字符串
	 * @param {*} start
	 * @param {*} end
	 */
	function isPalindrome(start, end) {
		while (start < end) {
			if (str[start] !== str[end]) {
				return false;
			}

			start++;
			end--;
		}

		return true;
	}
};

const str = "abca";

// 期望输出 true
console.log("输出的值", validPalindrome(str));

const str1 = "abbbaca";

// 期望输出 false
console.log("输出的值", validPalindrome(str1));
