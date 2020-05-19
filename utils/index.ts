import ListNode from "../models/ListNode";

export function consoleListNode(l: ListNode): void {
  do{
    console.log(l.val);
  }while( !!(l = l.next))
}