/**
 * @description 两数求和找出下标值
 * 
 * @param {number[]} nums 
 * @param {number} target
 * @returns {number[]} 
 */
function twoSum(nums: number[], target: number): number[] {
  let diffMap: Map<number, number> = new Map();

  for(let i=0, len=nums.length; i<len; i++) {
    
    let diff = target - nums[i];
    let diffIndex = diffMap.get(diff);

    if(diffIndex !== undefined ) {
      return [(diffIndex as number), i]
    }

    diffMap.set(nums[i], i)
  }

  return [];
}

// test
const nums = [2,3,4,5,7,8];
const target = 15;

const result = twoSum(nums, target);

console.log(result);