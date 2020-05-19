import ListNode from "../models/ListNode";
import { consoleListNode } from "../utils";

/**
 * @description 真题描述：给定一个排序链表，
 * 删除所有含有重复数字的结点，
 * 只保留原始链表中 没有重复出现的数字。
 * 
 * 示例 1:
 * 输入: 1->2->3->3->4->4->5
 * 输出: 1->2->5
 * 示例 2:
 * 输入: 1->1->1->2->3
 * 输出: 2->3
 * @param l1 
 */
function deleteDuplicate(l1: ListNode) {

  // 0个或一个得情况，直接返回
  if(!l1 || !l1.next) {
    return l1;
  }

  // 生成dummy，指向头部节点
  let dummy = new ListNode();
  dummy.next = l1;

  let cur = dummy;

  // 当cur后面至少有两个节点时
  while( !!cur.next && !!cur.next.next) {
    // 对cur后面得两个节点进行比较
    if(cur.next.val === cur.next.next.val) {
      // 如果重复，则记录下这个值
      let value = cur.next.val;

      // 反复循环判断cur后面得节点是否是重复的值
      while(cur.next && value === cur.next.val) {
        // 复工重复，则删除
        cur.next = cur.next.next;
      }
    }else {
      // 如果不重复，则往后遍历
      cur = cur.next;
    }
  }

  return dummy
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
  let a3 = new ListNode();
  a3.val = 2;
  a2.next = a3;
  
  let delResult: ListNode = deleteDuplicate(l1);
  consoleListNode(delResult);

  // let l2 = new ListNode();
  // l2.val = 1;
  // let b1 = new ListNode();
  // b1.val = 1;
  // l2.next = b1;
  // let b2 = new ListNode();
  // b2.val = 2;
  // b1.next = b2;
  // let b3 = new ListNode();
  // b3.val = 3;
  // b2.next = b3;
  // let b4 = new ListNode();
  // b4.val = 3;
  // b3.next = b4;

  // let del2Result = deleteDuplicate(l2);
  // consoleListNode(del2Result);


}