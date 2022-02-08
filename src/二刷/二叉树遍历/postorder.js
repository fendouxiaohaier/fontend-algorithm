const { root } = require("./sourceData");

const postOrder = (root) => {
  if (!root) {
    return;
  }

  // 递归遍历左子树
  postOrder(root.left);

  // 递归遍历右子树
  postOrder(root.right);

  // 左子树和右子树都递归完成的情况下使用当前节点
  console.log('当前正在遍历的节点', root.val);
}

postOrder(root);

