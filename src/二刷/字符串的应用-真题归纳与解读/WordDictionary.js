/**
 * @description 设计一个支持以下两种操作的数据结构
 * void addWord(word)
 * bool search(word)
 * search(word) 可以搜索文字或正则表达式字符串，字符串只包含字母 . 或 a-z 。
 * . 可以表示任何一个字母
 * 
 * 示例:
 * addWord("bad")
 * addWord("dad")
 * addWord("mad")
 * search("pad") -> false
 * search("bad") -> true
 * search(".ad") -> true
 * search("b..") -> true
 * 说明:
 * 你可以假设所有单词都是由小写字母 a-z 组成的。
 */
class WordDictionary {
	constructor() {
		// 用map来保存字符串，key为字符串的长度，value为数组，保存相同长度的字符串
		// 这样做的目的是为了将相同长度的字符串作为同一类字符串，在查找时更方便
		this.map = new Map();
	}

	addWord(word) {
    // 若该字符串对应长度的数组已经存在，则将word添加到末尾
		if (this.map.get(word.length)) {
			this.map.get(word.length).push(word);
    
    // 若该字符串对应长度的数组不存在，则将word组成新的数组创建
		} else {
			this.map.set(word.length, [word]);
		}
	}

  search(word) {
    console.log('输出this.map', this.map);

    // 如果word对应长度的数组不存在，则表示没有对应的值
    if (!this.map.get(word.length)) {
      return false;
    }

    const targetLenArray = this.map.get(word.length);
    // 通过word中是否包含点来判断word是普通字符串还是正则表达式
    if (!word.includes('')) {
      return targetLenArray.includes(word);
    } else {
      // 如果是正则，则通过正则来进行匹配
      const reg = new RegExp(word);
      return targetLenArray.some(w => reg.test(w))
    }
  }
}

const wordDictionary = new WordDictionary();

wordDictionary.addWord("bad")
wordDictionary.addWord("dad")
wordDictionary.addWord("mad")
wordDictionary.addWord("mather")
// 期望输出  -> false
console.log('pad对应的输出', wordDictionary.search("pad"));
// 期望输出  -> true
console.log('bad对应输出', wordDictionary.search("bad"));
// 期望输出  -> true
console.log('.ad对应输出',wordDictionary.search(".ad"));
// 期望输出  -> true
console.log('b..对应输出', wordDictionary.search("b.."));
// 期望输出  -> false
console.log('th对应输出', wordDictionary.search("th"));
