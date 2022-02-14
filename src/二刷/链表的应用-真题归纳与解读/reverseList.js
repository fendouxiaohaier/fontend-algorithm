const ListNode = require("./ListNode");

/**
 * @description 描述：定义一个函数，输入一个链表的头结点，反转该链表并输出反转后链表的头结点。
 * 示例:
 * 输入: 1->2->3->4->5->NULL
 * 输出: 5->4->3->2->1->NULL
 * @param {*} head 
 */
const reverseList = (head) => {
  let pre = null;  // 初始化前驱结点为null
  let cur = head;  // 初始化当前结点为head结点

  while(cur) {
    // 记录下cur结点的下一个结点
    let next = cur.next;

    // 进行反转
    cur.next = pre;

    // 重新赋值
    pre = cur;
    cur = next;
  }

  // 这里应该返回cur的前序结点，因为此时cur为null
  return pre;
}

// 测试 1->2->3->4->5->NULL
const head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
head.next.next.next = new ListNode(4);
head.next.next.next.next = new ListNode(5);

console.log('1->2->3->4->5反转的结果', JSON.stringify(reverseList(head)));