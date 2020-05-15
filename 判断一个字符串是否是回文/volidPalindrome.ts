
/**
 * 真题描述：给定一个非空字符串 s，最多删除一个字符。判断是否能成为回文字符串。
 * 示例 1: 输入: "aba"
 * 输出: True
 * 示例 2:
 * 输入: "abca"
 * 输出: True
 * 解释: 你可以删除c字符。
 * 注意: 字符串只包含从 a-z 的小写字母。字符串的最大长度是50000。
 * 
 * @param s 指定字符串
 */
function validPalindrome(s: string ) {
  let len: number = s.length;

  let i: number = 0, j: number = len-1;

  while(i<j && s[i]===s[j]) {
    i++;
    j--;
  }

  // 左指针右移，尝试删除左指针的字符，判断是否是回文
  if(isPalindrome(i+1, j)) {
    return true
  }

  // 右指针左移，标识尝试删除右指针字符，判断是否是回文
  if(isPalindrome(i, j-1)) {
    return true;
  }

  function isPalindrome(i: number, j: number): boolean {

    while(i<j) {
      if(s[i] !== s[j]) {
        return false
      }

      i++;
      j--;
    }

    return true;
  }

  return false;
}

// test
{
  let s = "abcaa";
  const result = validPalindrome(s);
  console.log(result);
}