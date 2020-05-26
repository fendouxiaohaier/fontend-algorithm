/**
 * @description 题目描述：设计一个支持 push ，pop ，top 操作，
 * 并能在常数时间内检索到最小元素的栈。
 */
class MinStack {
  private stack: number[] = [];

  // 辅助栈，用于存放一个从栈底到栈顶递减的数据结构
  private stack2: number[] = [];
  
  push(x:  number) {
    this.stack.push(x);

    // 如果当前辅助栈为空，或 x 比辅助栈定元素还要小，则入辅助站
    if(this.stack2.length === 0 
      || this.stack2[ this.stack2.length - 1 ] >= x
    ) {
      this.stack2.push(x);
    }
  }

  pop() {
    if( !this.stack.length ) {
      return
    }

    let x = this.stack.pop();

    // 如果出栈的元素合辅助栈栈顶元素相等，则辅助栈栈顶元素也要出栈
    if(x === this.stack2[ this.stack2.length - 1 ]) {
      this.stack2.pop();
    }
  }

  top() {
    if( !this.stack.length ) {
      return
    }

    return this.stack.pop();

  }

  getMin() {
    return this.stack2[this.stack2.length - 1]
  }
}

// test
const minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
console.log(minStack.getMin());  // --> 返回 -3.
console.log(minStack.pop());
console.log(minStack.top());  // --> 返回 0.
console.log(minStack.getMin());  // --> 返回 -2.