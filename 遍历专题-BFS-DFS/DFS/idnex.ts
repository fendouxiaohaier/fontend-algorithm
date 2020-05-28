import BInaryTree from "../../models/BinaryTree";

/**
 * 实现深度优先遍历，普通的递归就是深度优先遍历
 * @param root 
 */
function DFS(root: BInaryTree<string>): void {
  console.log(root?.getVal());

  if(root?.getLeft()) {
    DFS(<BInaryTree<string>>root?.getLeft());
  }

  if(root?.getRight()) {
    DFS(<BInaryTree<string>>root.getRight());
  }
}

// test

// test
let F = new BInaryTree<string>("F");
let E = new BInaryTree<string>("E");
let D = new BInaryTree<string>("D")
let C = new BInaryTree<string>("C", F)
let B = new BInaryTree<string>("B", D, E);
let A = new BInaryTree<string>("A", B, C);

DFS(A);