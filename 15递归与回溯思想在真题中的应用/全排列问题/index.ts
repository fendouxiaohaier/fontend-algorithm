/**
 * @description 题目描述：给定一个没有重复数字的序列，返回其所有可能的全排列。
 * 示例：   
 * 输入: [1,2,3]
 * 输出: [
 * [1,2,3],
 * [1,3,2],
 * [2,1,3],
 * [2,3,1],
 * [3,1,2],
 * [3,2,1]
 * ]
 * 
 * @param nums 
 */
function permute(nums: number[]): number[][] {
  if( !nums.length ) {
    return [];
  }

  const len: number = nums.length;

  // 存放结果
  let res: number[][] = [];
  
  // curr 变量用来记录当前的排列内容
  let curr: number[] = [];

  // visitedNumMap 用来避免一轮填坑过程中重复使用同一个数字
  let visitedNumMap: Map<number, boolean> = new Map();

  /**
   * 
   * @param nth 填到第几个吭了，如果填到第三个吭，则完成填坑
   */
  function dfs(nth: number) {
    // 若遍历到了不存在的坑位（第 len+1 个），则触碰递归边界返回
    if(nth === len) {
      res.push([...curr]);
      return ;
    }
    
    for(let i=0; i<len; i++) {
      // 若 nums[i] 之前没被其它坑位用过，则可以理解为“这个数字剩下了”
      if( !visitedNumMap.get(nums[i]) ) {
        visitedNumMap.set(nums[i], true);
        curr.push(nums[i]);

        // 填下一个吭
        dfs(nth+1);

        // nums[i]让出当前坑位
        curr.pop();
        // 下掉“已用过”标识
        visitedNumMap.set(nums[i], false);
      }
    }
  }

  dfs(0);

  return res;
}

// test

{
  let nums = [1,2,3];

  console.log(permute(nums));
}