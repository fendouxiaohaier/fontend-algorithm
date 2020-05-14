/**
 * @description 给你一个包含 n 个整数的数组 nums，
 * 判断 nums 中是否存在三个元素 a，b，c ，
 * 使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组。
 * 注意：答案中不可以包含重复的三元组。
 * 
 * 示例： 给定数组 nums = [-1, 0, 1, 2, -1, -4]， 
 * 满足要求的三元组集合为： [ [-1, 0, 1], [-1, -1, 2] ]
 */
function threeSum(nums: number[]): number[][] {
  // 排序
  nums.sort();

  // 存放结果
  let result: number[][] = [];

  const len = nums.length;

  for(let i=0; i<len-1; i++) {
    let leftIndex = i+1;
    let rightIndex = len -1;

    // 如果挨着的两个元素重复，则i向前移动
    if(i > 0 && nums[i] === nums[i-1]) {
      continue;
    }

    while(leftIndex < rightIndex) {
      // 和小于0，leftIndex往右走
      if( nums[i] + nums[leftIndex] + nums[rightIndex] < 0 ) {
        leftIndex++;

        // 如果左指针相邻两个元素相等，则左指针向右移动
        while(leftIndex < rightIndex && nums[leftIndex] === nums[leftIndex-1]) {
          leftIndex++;
        }

      // 和大于0，rightIndex往左走
      } else if( nums[i] + nums[leftIndex] + nums[rightIndex] > 0 ) {
        rightIndex--;

        // 如果右指针相邻的两个元素相等，则右指针向左移动
        while(leftIndex < rightIndex && nums[rightIndex] === nums[rightIndex+1]) {
          rightIndex--;
        }

      // 相等，加入结果集
      } else {
        result.push( [ nums[i], nums[leftIndex], nums[rightIndex] ] );
        
        leftIndex++;
        rightIndex--;

        // 如果左指针相邻两个元素相等，则左指针向右移动
        while(leftIndex < rightIndex && nums[leftIndex] === nums[leftIndex-1]) {
          leftIndex++;
        }

         // 如果右指针相邻的两个元素相等，则右指针向左移动
        while(leftIndex < rightIndex && nums[rightIndex] === nums[rightIndex+1]) {
          rightIndex--;
        }
      }
    }
  } 

  return result;

} 

// test
{
  let nums = [-1, 0, 1, 2, -1, -4];
  const result = threeSum(nums);
  console.log(result);
}
