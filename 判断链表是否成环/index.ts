class ListNode {
  public val: number = 0;
  public next: any;
  public flag: boolean = false;

}

/**
 * @description 真题描述：给定一个链表，判断链表中是否有环。
 */
function hasListCycle(head: ListNode): boolean {

    while( !!head ) {
      // 当前节点如果已经立了flag，则标识成环
      if(head.flag) {
        return true;
      } else {
        // 没有立过flag，表示还没有走过，则立上一个flag，并继续往后走
        head.flag = true;
        head = head.next;
      }
    }

  return false;
}

// test 
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
b4.next = b2;

console.log(hasListCycle(l2));