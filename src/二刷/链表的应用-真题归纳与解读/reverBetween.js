const ListNode = require("./ListNode");

/**
 * @description 真题描述：反转从位置 m 到 n 的链表。请使用一趟扫描完成反转。
 * 示例:
 * 输入: 1->2->3->4->5->NULL, m = 2, n = 4
 * 输出: 1->4->3->2->5->NULL
 *
 * @param {ListNode} head
 * @param {number} m
 * @param {number} n
 */
const reverseBetween = (head, m, n) => {
	const dummy = new ListNode();
	dummy.next = head;

	// 第m个结点的前序结点
	let leftHead = null;
	let pre = null;
	let start = null;
	let cur = null;

	// 找到m结点的前序结点
	for (let i = 0; i < m - 1; i++) {
		leftHead = dummy.next;
	}

	start = leftHead.next;
	pre = start;
	cur = pre.next;

	// 开始翻转m到n之间的结点
	for (let i = m; i < n; i++) {
		let next = cur.next;
		cur.next = pre;

		(pre = cur), (cur = next);
	}

	// 翻转完毕，重新组合前序结点和后续结点
	leftHead.next = pre;
	start.next = cur;

	// 返回头部节点
	return dummy.next;
};

// 测试 1->2->3->4->5->NULL, m = 2, n = 4

const head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
head.next.next.next = new ListNode(4);
head.next.next.next.next = new ListNode(5);

// 期望输出： 1->4->3->2->5->NULL
console.log(
	"1->2->3->4->5->NULL, m = 2, n = 4翻转后的输出结果",
	JSON.stringify(reverseBetween(head, 2, 4))
);
