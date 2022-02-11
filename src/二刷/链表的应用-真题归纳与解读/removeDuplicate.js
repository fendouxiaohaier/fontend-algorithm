const ListNode = require('./ListNode');

/**
 * @description 描述：给定一个排序链表，删除所有含有重复数字的结点，只保留原始链表中 
 * 没有重复出现的数字
 * 示例 1:
 * 输入: 1->2->3->3->4->4->5
 * 输出: 1->2->5
 * 示例 2:
 * 输入: 1->1->1->2->3
 * 输出: 2->3
 * 
 * @param {ListNode} head 
 */
const removeDuplicate = (head) => {
  const dummy = new ListNode();
  dummy.next = head;
  let cur = dummy;

  while(cur.next && cur.next.next) {
    // 连续两个节点值相等
    if (cur.next.val === cur.next.next.val) {
      // 记录相等的值
      let sameVal = cur.next.val;

      // 遍历链表，删除值等于sameVal的节点
      while(cur.next && cur.next.val === sameVal) {
        cur.next = cur.next.next;
      }
    
    // 连续两个值不相等，则继续遍历
    } else {
      cur = cur.next;
    }
  }

  return head;
}

// 测试
// 1->2->3->3->4->4->5
const head1 = new ListNode(1);
head1.next = new ListNode(2);
head1.next.next = new ListNode(3);
head1.next.next.next = new ListNode(3);
head1.next.next.next.next = new ListNode(4);
head1.next.next.next.next.next = new ListNode(4);
head1.next.next.next.next.next.next = new ListNode(5);

// 期望输出1->2->5
console.log('1->2->3->3->4->4->5的输出值', JSON.stringify(removeDuplicate(head1)));