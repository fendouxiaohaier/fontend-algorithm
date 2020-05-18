import ListNode from "../models/ListNode";

/**
 * @description 真题描述：将两个有序链表合并为一个新的有序链表并返回。
 * 新链表是通过拼接给定的两个链表的所有结点组成的
 */
function mergeTwoList(l1: ListNode, l2: ListNode): ListNode {
  let head = new ListNode();
  let cur = head;

  while(l1 && l2) {

    if(l1.val < l2.val) {
      cur.next = l1;
      l1 = l1.next;
    } else {
      cur.next = l2;
      l2 = l2.next;
    }

    cur = cur.next;
  }

  cur.next = l1 !== null ? l1 : l2

  return head.next;
  
}

// test

let l1 = new ListNode();
l1.val = 1;
let a1 = new ListNode();
a1.val = 2;
l1.next = a1;
let a2 = new ListNode();
a2.val = 4;
a1.next = a2;

let l2 = new ListNode();
l2.val = 1;
let b1 = new ListNode();
b1.val = 3;
l2.next = b1;
let b2 = new ListNode();
b2.val = 4;
b1.next = b2;

let mergeResult = mergeTwoList(l1, l2);
let a: ListNode = mergeResult;
do{
  console.log(a.val);
}while( !!(a = a.next))
