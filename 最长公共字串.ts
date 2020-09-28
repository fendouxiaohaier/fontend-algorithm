function isPalindrome(s: string): boolean {
  return s.split('').reverse().join('') === s;
}

function longestPalindrome(s: string): number {
  if( !s.length ) {
    return 0;
  }

  let leftIndex = 0;
  let rightIndex = s.length;

  if( isPalindrome( s.slice(leftIndex, rightIndex) ) ) {
    return rightIndex - leftIndex;
  }

  while( leftIndex < rightIndex ) {

    ++leftIndex;
    if( isPalindrome( s.slice(leftIndex, rightIndex) ) ) {
      break;
    }

    --rightIndex;
    if( isPalindrome( s.slice(leftIndex, rightIndex) ) ) {
      break;
    }
  }

  return rightIndex - leftIndex;
};




longestPalindrome("abccccdd");








