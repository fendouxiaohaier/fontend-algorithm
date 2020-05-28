import BInaryTree from "../../models/BinaryTree";

/**
 * 二叉树的官渡优先遍历算法
 * @param root 
 */
function BFS(root: BInaryTree<string>): void {
  let queue: BInaryTree<string>[] = [];

  queue.push(root);

  while( queue.length ) {
    
    // 取出消费
    let cur = queue.shift();
    console.log(cur?.getVal());

    if(cur?.getLeft()) {
      queue.push(<BInaryTree<string>>cur.getLeft());
    }

    if(cur?.getRight()) {
      queue.push(<BInaryTree<string>>cur.getRight());
    }

  }
}

// test
let F = new BInaryTree<string>("F");
let E = new BInaryTree<string>("E");
let D = new BInaryTree<string>("D")
let C = new BInaryTree<string>("C", F)
let B = new BInaryTree<string>("B", D, E);
let A = new BInaryTree<string>("A", B, C);

BFS(A);