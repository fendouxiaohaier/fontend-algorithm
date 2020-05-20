import ListNode from "../models/ListNode";

import { consoleListNode } from "../utils/index";

/**
 * @description 真题描述：给定一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
 * 示例： 给定一个链表: 1->2->3->4->5, 和 n = 2.
 * 当删除了倒数第二个结点后，链表变为 1->2->3->5.
 * 说明： 给定的 n 保证是有效的。
 * @param l 
 * @param n 
 */
function removeNthFromEnd(l: ListNode, n: number): ListNode {
  
  let dummy = new ListNode();
  dummy.next = l;

  let slow = dummy;
  let fast = dummy;

  // 快指针先跑n步
  while(n !== 0) {
    fast = fast.next;
    n--;
  }

  // 快指针和慢指针同时跑，知道快指针跑到最后
  while( !!fast.next ) {
    slow = slow.next;
    fast = fast.next;
  }

  //  删除倒数第n个节点
  slow.next = slow.next.next;


  return dummy.next;
}

// test
{
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
  
  let del2Result = removeNthFromEnd(l2, 3);
  consoleListNode(del2Result);
}
