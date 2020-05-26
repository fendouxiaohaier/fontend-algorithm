export default class Stack<T> {
  private stack: T[] = [];
  
  push(x:  T) {
    this.stack.push(x);
  }

  pop(): T | undefined {
    if( !this.stack.length ) {
      return
    }
    
    return this.stack.pop();
  }
  
  // 只获取栈顶元素，但是不出栈
  top(): T | undefined {
    if( !this.stack.length ) {
      return
    }
    
    return this.stack[this.stack.length - 1];
  }

  length(): number {
    return this.stack.length;
  }

}