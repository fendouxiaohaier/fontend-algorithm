/**
 * @description 真题描述： 给定一个整数数组 numbers 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标
 * 示例：
 * 给定 numbers = [2, 7, 11, 15], target = 9
 * 因为 numbers[0] + numbers[1] = 2 + 7 = 9 所以返回 [0, 1]
 * @param {number[]} sums
 * @param {number} target
 * @returns {number[]}
 */
const twoSum = (numbers, target) => {
	let map = new Map();
	let len = numbers.length;

	for (let i = 0; i < len; i++) {
		// target与当前正在遍历的值得差值
		let difference = target - numbers[i];

		// 如果在map中能找到差值，说明完成任务，返回下标
		if (map.get(difference)) {
			return [map.get(target - numbers[i]), i];
		} else {
			// 如果在map中没有找到差值，将遍历的值与下标作为对应的key与value保存起来
			map.set(numbers[i], i);
		}
	}

	return [];
};

const numbers = [2, 7, 11, 15];
const target = 18;

// 期望值： [ 1, 2 ]
console.log("匹配结果下标", twoSum(numbers, target));
