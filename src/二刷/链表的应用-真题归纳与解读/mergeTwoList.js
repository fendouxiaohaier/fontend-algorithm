const ListNode = require('./ListNode');


// 构造l1链表
const l1 = new ListNode(1);
l1.next = new ListNode(2);
l1.next.next = new ListNode(4);

// 构造l2链表
const l2 = new ListNode(1);
l2.next = new ListNode(3);
l2.next.next = new ListNode(4);

const mergeTwoList = (l1, l2) => {
  // 目标链表
  const head = new ListNode();
  let cur = head;// cur指代当前正在遍历的目标链表

  while(l1 && l2) {
    // 如果l1链表节点值大于l2链表节点当前值，则将l2当前节点放到head后
    if (l1.val >= l2.val) {
      cur.next = l2;
      l2 = l2.next;
    
    // 反之，则将l1当前节点放到head后
    } else {
      cur.next = l1;
      l1 = l1.next;
    }

    // 目标链表向后移动一格
    cur = cur.next;
  }

  // 如果l1还没有遍历完，则直接将l1剩下的全部放到目标链表后面
  if(l1) {
    cur.next = l1;
  // 对于l2链表来说也是一样的
  } else {
    cur.next = l2;
  }

  return head;
}

console.log('输出排序后的节点：', JSON.stringify(mergeTwoList(l1, l2)));
