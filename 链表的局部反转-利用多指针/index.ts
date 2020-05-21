import ListNode from "../models/ListNode";

import { consoleListNode } from "../utils/index";

/**
 * @description 真题描述：反转从位置 m 到 n 的链表。请使用一趟扫描完成反转。
 * 说明: 1 ≤ m ≤ n ≤ 链表长度。
 * 示例:
 * 输入: 1->2->3->4->5->NULL, m = 2, n = 4
 * 输出: 1->4->3->2->5->NULL
 * 
 * @param head 
 * @param n 
 * @param m 
 */
function reverseBetween(head: ListNode, n: number, m: number) {
  let dummy = new ListNode();
  dummy.next = head;
  
  // 保存第n个节点的前一个节点，用于在n到m反转完成后，将leftSTart的next指向第m节点，初始化为dummy节点
  let leftStart: ListNode = dummy;

  // 保存第n个节点，用于在n到m反转完成后，将n节点的next指向m的next节点
  let start: ListNode = new ListNode();

  // 下面三个临时节点用于n到m的反转时
  let prev: ListNode = new ListNode();
  let cur: ListNode = new ListNode();
  let next: ListNode = new ListNode();

  for(let i=0; i<n-1; i++) {
    leftStart = leftStart.next;
  }

  console.log("leftStart.val:",  leftStart.val);

  start = leftStart.next;
  prev = start;
  cur = prev.next;
  
  // 开始反转
  for(let j=n; j<m; j++) {
    next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }

  // 反转完成后，将leftStart的next指向现在的prev
  // 将start的netx指向m的next，即现在的cur
  leftStart.next = prev;
  start.next = cur;


  return dummy.next;
}

// test
let l2 = new ListNode();
l2.val = 1;
let b1 = new ListNode();
b1.val = 2;
l2.next = b1;
let b2 = new ListNode();
b2.val = 3;
b1.next = b2;
let b3 = new ListNode();
b3.val = 4;
b2.next = b3;
let b4 = new ListNode();
b4.val = 5;
b3.next = b4;

consoleListNode(l2);
console.log("-----------");

let reverseResult = reverseBetween(l2, 1, 5);
if(reverseResult !== null) {
  consoleListNode(reverseResult);
}