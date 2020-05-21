import ListNode from "../models/ListNode";

import { consoleListNode } from "../utils/index";

/**
 * @description 真题描述：定义一个函数，输入一个链表的头结点，
 * 反转该链表并输出反转后链表的头结点
 * 
 * 示例:
 * 输入: 1->2->3->4->5->NULL
 * 输出: 5->4->3->2->1->NULL
 * 
 * @param head 
 */
function reverseList(head: ListNode): ListNode | null {
  let pre = null;
  let cur = head;

  while( !!cur ) {
    // 先将cur的后一个节点保存
    let next = cur.next;
    
    // 反转节点指针
    cur.next = pre;

    // 前一个节点往后移
    pre = cur;
    
    // 当前节点往后移动
    cur = next;
  }

  return pre;
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

let reverseResult = reverseList(l2);
if(reverseResult !== null) {
  consoleListNode(reverseResult);
}