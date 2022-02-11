const ListNode = require('./ListNode');

/**
 * @description 给定一个排序链表，删除所有重复的元素，使得每个元素只出现一次。
 * 示例 1:
 * 输入: 1->1->2
 * 输出: 1->2
 * 示例 2:
 * 输入: 1->1->2->3->3
 * 输出: 1->2->3
 * @param {Link}} head 
 */
const deleteDDuplicate = (head) => {
  let cur = head;  // cur作为移动的节点标识

  while(cur && cur.next) {
    // 如果当前节点值和下一节点值相等，则删除下一节点
    if ( cur.val === cur.next.val) {
      cur.next = cur.next.next;
    // 如果不相等，则cur移动一格，继续遍历
    } else {
      cur = cur.next;
    }
  }

  return head;
}

// 测试
const head = new ListNode();
head.next = new ListNode(1);
head.next.next = new ListNode(1);
head.next.next.next = new ListNode(2);

console.log('1-1-2的输出结果', JSON.stringify(deleteDDuplicate(head)));

const head2 = new ListNode();
head2.next = new ListNode(1);
head2.next.next = new ListNode(1);
head2.next.next.next = new ListNode(2);
head2.next.next.next.next = new ListNode(3);
head2.next.next.next.next.next = new ListNode(3);

console.log('1->1->2->3->3的输出结果', JSON.stringify(deleteDDuplicate(head2)));