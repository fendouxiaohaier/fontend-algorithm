/**
 * @description 描述：给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组
 * 示例：
 * 输入:
 * nums1 = [1,2,3,0,0,0], m = 3
 * nums2 = [2,5,6], n = 3
 * 输出: [1,2,2,3,5,6]
 *
 * @param {number[]} number1
 * @param {*} m number1数组的长度
 * @param {number[]} number2
 * @param {*} n number2数组的长度
 */
const merge = (number1, m, number2, n) => {
	let i = m - 1; // 初始化number1数组的下标
	let j = n - 1; // 初始化number2数组的下标
	let x = m + n - 1; // 初始化number1数组末尾的下标

	while (i >= 0 && j >= 0) {
		if (number1[i] > number2[j]) {
			number1[x] = number1[i];
			x--;
			i--;
		} else {
			number1[x] = number2[j];
			x--;
			j--;
		}
	}

	// number2数组还没有遍历完成的情况
	// 不需要关注number1是否遍历完成，因为是从number2中往number1中塞数据，如果number2遍历完成，表示整个过程已完成
	while (j >= 0) {
		number1[x] = number2[j];
		x--;
		j--;
	}
};

const number1 = [1, 2, 3, 0, 0, 0];
const m = 3;
const number2 = [2, 5, 6];
const n = 3;

// 期望输出: [1,2,2,3,5,6]
merge(number1, m, number2, n);

console.log('合并完成后输出number1', number1);