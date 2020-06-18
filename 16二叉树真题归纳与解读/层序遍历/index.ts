import {
  TreeNode,
  ITreeNode
} from "../../models/TreeNode";

/**
 *   3
    / \
    9  20
      /  \
    15   7

    输出： [
            [3],
            [9,20],
            [15,7]
          ] 
 */
function levelOrder(root: TreeNode): number[][] {
  let res: number[][] = [];

  let queue: ITreeNode[] = [];

  queue.push(root);

  while(queue.length) {
    let temp: number[] = [];

    let len = queue.length;
    for(let i=0; i<len; i++) {
      let q = queue.shift();
      if(q) {
        temp.push(q.getVal());
        
        let left = q.getLeft();
        if(left) {
          queue.push(left);
        }

        let right = q.getRight();
        if(right) {
          queue.push(right);
        }
      }
    }

    res.push([...temp]);
  }

  return res;
}