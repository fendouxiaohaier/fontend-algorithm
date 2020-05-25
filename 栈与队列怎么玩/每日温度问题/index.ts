/**
 * 题目描述: 根据每日气温列表，
 * 请重新生成一个列表，
 * 对应位置的输出是需要再等待多久温度才会升高超过该日的天数。
 * 如果之后都不会升高，请在该位置用 0 来代替。
 * 
 * 例如，给定一个列表 temperatures = [73, 74, 75, 71, 69, 72, 76, 73]，
 * 你的输出应该是 [1, 1, 4, 2, 1, 1, 0, 0]。
 * 
 * @param t 
 */
function dailyTemperatures(t: number[]): number[] {
  let len = t.length;
  let stack: number[] = [];
  let res = (new Array(len)).fill(0);  // 结果集，全部初始化为0

  for(let i=0; i<len; i++) {
    // 如果栈不为空，且当前温度大于栈顶的温度
    while(stack.length && t[i] > t[stack[ stack.length-1 ]]) {
      // 将栈顶温度值对应的索引出栈
      let top = stack.pop();
      if(top !== undefined) {
        res[top] = i - top;
      }
    }

    // 注意，这里保存的是坐标
    stack.push(i);
  }
  
  return res;
}

// test

let t = [73, 74, 75, 71, 69, 72, 76, 73];
console.log(dailyTemperatures(t));