function isPalindrome(s) {
    return s.split('').reverse().join('') === s;
}
function longestPalindrome(s) {
    if (!s.length) {
        return 0;
    }
    var leftIndex = 0;
    var rightIndex = s.length;
    if (isPalindrome(s.slice(leftIndex, rightIndex))) {
        return rightIndex - leftIndex;
    }
    while (leftIndex < rightIndex) {
        ++leftIndex;
        if (isPalindrome(s.slice(leftIndex, rightIndex))) {
            break;
        }
        --rightIndex;
        if (isPalindrome(s.slice(leftIndex, rightIndex))) {
            break;
        }
    }
    return rightIndex - leftIndex;
}
;
longestPalindrome("abccccdd");
