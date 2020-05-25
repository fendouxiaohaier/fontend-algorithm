
/**
 * @description 题目描述：给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。
 * 有效字符串需满足： 左括号必须用相同类型的右括号闭合。
 * 左括号必须以正确的顺序闭合。
 * 注意空字符串可被认为是有效字符串。
 * 示例 1:
 * 输入: "()"
 * 输出: true
 * 示例 2:
 * 输入: "()[]{}"
 * 输出: true
 * 示例 3:
 * 输入: "(]"
 * 输出: false
 * 示例 4:
 * 输入: "([)]"
 * 输出: false
 * 示例 5:
 * 输入: "{[]}"
 * 输出: true
 * @param s {string}
 */
function isValidStr(s: string): boolean {
  let leftToRightMap = new Map<string, string>([["(",")"],["[","]"],["{","}"]]);

  if( !s.length ) {
    return true;
  }

  const leftBrackets = ["(", "[", "{"];
  let stack: string[] = [];

  for(let i=0, len=s.length; i<len; i++) {
    // 如果是左括号，则将对应的右括号入栈
    if(leftBrackets.indexOf(s[i]) > -1) {
      stack.push( <string>leftToRightMap.get(s[i]) );
    
    // 如果是右括号，则出栈一个，并且判断出栈前栈的长度是否为0
    } else {
      if( !stack.length || stack.pop() !== s[i]) {
        return false;
      }
    }
  }

  return !stack.length;
}

// test

console.log("{}", isValidStr("{}"));  // true
console.log(isValidStr("{{"));  // false
console.log(isValidStr("{{}"));  // false
console.log(isValidStr("{{}}"));  // true
console.log(isValidStr("()[]{}"));  // true
console.log(isValidStr("}}"));  // false
console.log(isValidStr("{{()]")); // false