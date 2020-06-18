interface ITreeNode {
  val: number,
  left: ITreeNode | null,
  right: ITreeNode | null,
  getVal(): number,
  getLeft(): ITreeNode | null,
  getRight(): ITreeNode | null
}

class TreeNode implements ITreeNode{
  val: number;
  left: ITreeNode | null;
  right: ITreeNode | null;

  constructor(val: number, left: ITreeNode | null, right: ITreeNode | null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }

  getVal() {
    return this.val;
  }

  getLeft() {
   return this.left; 
  }

  getRight() {
    return this.right;
  }

}

export {
  TreeNode,
  ITreeNode
};