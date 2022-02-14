const ListNode = require("./ListNode");

/**
 * @description 给定一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点
 * 示例：
 * 给定一个链表: 1->2->3->4->5, 和 n = 2.
 * 当删除了倒数第二个结点后，链表变为 1->2->3->5.
 *
 * @param {ListNode} head
 * @param {number} n
 * @returns {ListNode} head
 */
const removeNthFromEnd = (head, n) => {
	const dummy = new ListNode();
	dummy.next = head;

	let slow = dummy; // 慢指针
	let fast = dummy; // 快指针

  // 快指针先走n步
	while (n > 0) {
    fast = fast.next;
    n--;
  }

  // 快慢指针同时走到最后，这时候慢指针刚好是倒数第n个结点的前一个结点
  while(fast.next) {
    slow = slow.next;
    fast = fast.next;
  }

  // 删除倒数第n个结点
  slow.next = slow.next.next;

  return head;
};

// 测试 1->2->3->4->5, 和 n = 2
const head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
head.next.next.next = new ListNode(4);
head.next.next.next.next = new ListNode(5);

console.log('1->2->3->4->5 删除倒数第2个', JSON.stringify(removeNthFromEnd(head, 2)));

