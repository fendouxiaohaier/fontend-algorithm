/**
 * @description 题目描述：给定一个数组 nums 和滑动窗口的大小 k，请找出所有滑动窗口里的最大值。
 * 示例: 输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3 输出: [3,3,5,5,6,7]
 * 解释: 滑动窗口的位置
 * ---------------
 * [1 3 -1] -3 5 3 6 7
 * 1 [3 -1 -3] 5 3 6 7
 * 1 3 [-1 -3 5] 3 6 7
 * 1 3 -1 [-3 5 3] 6 7
 * 1 3 -1 -3 [5 3 6] 7
 * 1 3 -1 -3 5 [3 6 7]
 * @param arr @
 * @param k 
 */
function maxSlidingWindow(arr: number[], k: number): number[] {
  let res: number[] = [];
  let dequeue: number[] = [];  // 双端队列，用于存放一个递减的队列
  let len = arr.length;

  // 开始遍历
  for(let i=0; i<len; i++) {
    
    // 将dequeue队尾小于当前正在遍历的元素pop调
    while(dequeue.length && dequeue[dequeue.length - 1] < arr[i]) {
      dequeue.pop();
    }

    console.log("pop后：", dequeue);

    // pop完成后，将当前正在遍历的元素push到dequeue
    dequeue.push(arr[i]);

    console.log("push后：", dequeue);

    // 如果排除在滑动窗口外的元素和双端队列头部的元素相等，则从双端队列shift掉
    if(dequeue.length && i-k >=0 && dequeue[0] === arr[i-k]) {
      dequeue.shift();
    }

    // 遍历到超过k个元素再开始加入结果集
    if(i >= k-1) {
      let r = dequeue[0];
      if(r) {
        res.push(r);
      }
    }

  }

  return res;
}

// test 
{
  let nums = [1,3,-1,-3,5,3,6,7];
  let k = 3;

  console.log("最后的结果：", maxSlidingWindow(nums, k));  // [3,3,5,5,6,7]
}

