/**
 * 真题描述： 设计一个支持以下两种操作的数据结构：
 * void addWord(word)
 * bool search(word)
 * search(word) 可以搜索文字或正则表达式字符串，字符串只包含字母 . 或 a-z 。
 * . 可以表示任何一个字母。
 */
class WordDictionary{
  private wordMap = new Map<number, string[]>();

  public addWord(s: string): void {
    // 若该字符串对应长度的数组已经存在，则直接添加
    if(this.wordMap.get(s.length)) {
      this.wordMap.get(s.length)?.push(s);

    // 如果还不存在，则先创建
    } else {
      this.wordMap.set(s.length, [s]);
    }
  }

  public search(s: string = ""): boolean {
    if( !this.wordMap.get(s.length) ) {
      return false     
    }

    // 如果包含点，则当作正则表达式
    if(s.includes(".")) {
      const reg = new RegExp(s);

      return (this.wordMap.get(s.length) as string[])
        .some(s => reg.test(s))
    }

    // 如果没有包含点，则是普通字符串
    if((this.wordMap.get(s.length) as string[]).indexOf(s) > -1) {
      return true
    }


    // 如果包含点，则创建正则表达式进行匹配
    
    return false;
  }
}

// test
let wordDictionary = new WordDictionary();

wordDictionary.addWord("abb");
wordDictionary.addWord("aaaaa");

console.log(wordDictionary.search("abb"));
console.log(wordDictionary.search("a.."));
console.log(wordDictionary.search("abbbb"));
console.log(wordDictionary.search("a...."));
