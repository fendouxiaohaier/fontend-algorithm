/**
 * @description 真题描述：给你一个包含 n 个整数的数组 numbers，判断 numbers 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组
 * 示例：
 * 给定数组 numbers = [-1, 0, 1, 2, -1, -4]，
 * 满足要求的三元组集合为： [ [-1, 0, 1], [-1, -1, 2] ]
 * @param {number[]} numbers
 */
const threeSum = (numbers) => {
	const res = []; // 保存结果
	let len = numbers.length;
	numbers = numbers.sort((a, b) => a - b); // 先进行排序

	// 这里只需要遍历到len - 2，因为最后两位由j指针和k指针来进行占位
	for (let i = 0; i < len - 2; i++) {
		let j = i + 1; // 左子针j
		let k = len - 1; // 右子针k

		// 如果遇到连续两个数相等，则直接继续往后遍历，这样做是为了避免出现重复的三元组
		if (numbers[i] === numbers[i - 1]) {
			continue;
		}

		while (j < k) {
			let sum = numbers[i] + numbers[j] + numbers[k];
			// 小于0 表示数太小了 需要将左子针往右移动
			if (sum < 0) {
				j++;

				// 在移动左子针的同时，如果发现连续两个数相等，则将左子针往右侧移动，直到不相等
				while (numbers[j] === numbers[j + 1]) {
					j++;
				}

				// 三数之和大于0 表示数太大了 则将右子针往右移动
			} else if (sum > 0) {
				k--;

				// 在移动右子针的同时，如果发现连续两个数相等，则将右子针往左侧移动，直到不相等
				while (numbers[k] === numbers[k - 1]) {
					k--;
				}

				// 三数之和刚好等于0的情况，将结果保存起来
			} else {
				res.push([numbers[i], numbers[j], numbers[k]]);
				// 继续遍历，左右子针同时移动
				j++;
				k--;

				// 同样的，为了避免出现相同的三元组
				// 在移动左子针的同时，如果发现连续两个数相等，则将左子针往右侧移动，直到不相等
				while (numbers[j] === numbers[j + 1]) {
					j++;
				}

				// 在移动右子针的同时，如果发现连续两个数相等，则将右子针往左侧移动，直到不相等
				while (numbers[k] === numbers[k - 1]) {
					k--;
				}
			}
		}
	}

	return res;
};

const numbers = [-1, 0, 1, 2, -1, -4];

// 期望输出： [ [-1, 0, 1], [-1, -1, 2] ]
console.log("输出的结果", threeSum(numbers));
