/**
 * 题目描述：使用栈实现队列的下列操作：
 * push(x) -- 将一个元素放入队列的尾部。
 * pop() -- 从队列首部移除元素。
 * peek() -- 返回队列首部的元素。
 * empty() -- 返回队列是否为空。
 * 
 * 你只能使用标准的栈操作 -- 也就是只有 push to top, peek/pop from top, size, 和 is empty 操作是合法的。
 * 示例: MyQueue queue = new MyQueue();
 * queue.push(1);
 * queue.push(2);
 * queue.peek(); // 返回 1
 * queue.pop(); // 返回 1
 * queue.empty(); // 返回 false
 */

import Stack from "./stack";

class MyQueue<T> {
  // push操作时，将元素加入stack1
  private stack1: Stack<T> = new Stack<T>();

  // 出栈时，如果stack2不为空，则从stack2中pop,如果stack2为控股，则将stack1以依次pop到stack2，然后再从stack2pop一个
  private stack2: Stack<T> = new Stack<T>();

  push(x: T) {
    this.stack1.push(x);
  } 

  // 只获取栈顶元素，不弹出
  peek(): T | undefined {
   if( !this.stack2.length() ) {
    while(this.stack1.length() ) {
      let x = this.stack1.top();
      if(x) {
        this.stack2.push(x)
      }
    }
   }


   return this.stack2.top();
  }

  pop(): T | undefined {
    if( !this.stack2.length() ) {
      while(this.stack1.length() ) {
        let x = this.stack1.pop();
        if(x) {
          this.stack2.push(x)
        }
      }
    }

    return this.stack2.pop();
  }
  
  isEmpty(): boolean {
    return !this.stack1.length() && !this.stack2.length();
  }
}

// test

let queue = new MyQueue<number>();
queue.push(1);
queue.push(2);
queue.push(3);

console.log(queue.pop());  // 1
console.log(queue.peek());  // 2
console.log(queue.pop());  // 2

queue.push(4);

console.log(queue.peek());  // 3
console.log(queue.peek());  // 3
console.log(queue.isEmpty());  // false
console.log(queue.peek());  // 3
console.log(queue.pop());  // 3
console.log(queue.pop());  // 4
console.log(queue.isEmpty());  // true