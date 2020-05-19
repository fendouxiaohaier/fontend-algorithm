import ListNode from "../models/ListNode";

import { consoleListNode } from "../utils/index";

/**
 * @description 给定一个排序链表，删除所有重复的元素，使得每个元素只出现一次。
 * 示例 1:
 * 输入: 1->1->2
 * 输出: 1->2
 * 示例 2:
 * 输入: 1->1->2->3->3
 * 输出: 1->2->3
 * 
 * @param l1 
 */
function delListNode(l1: ListNode): ListNode {

  let head = l1;
  let cur = l1;

  while( !!cur && !!cur.next) {
    if(cur.val === cur.next.val) {
      cur.next = cur.next.next;
    } else {
      cur = cur.next;
    }

  }

  return head;
}

// test
{
  let l1 = new ListNode();
  l1.val = 1;
  let a1 = new ListNode();
  a1.val = 1;
  l1.next = a1;
  let a2 = new ListNode();
  a2.val = 2;
  a1.next = a2;

  let delResult: ListNode = delListNode(l1);
  consoleListNode(delResult);

  let l2 = new ListNode();
  l2.val = 1;
  let b1 = new ListNode();
  b1.val = 1;
  l2.next = b1;
  let b2 = new ListNode();
  b2.val = 2;
  b1.next = b2;
  let b3 = new ListNode();
  b3.val = 3;
  b2.next = b3;
  let b4 = new ListNode();
  b4.val = 3;
  b3.next = b4;

  let del2Result = delListNode(l2);
  consoleListNode(del2Result);


}
