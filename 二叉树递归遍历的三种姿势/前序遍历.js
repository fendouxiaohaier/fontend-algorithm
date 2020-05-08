function preorder(root) {
  if(!root) {
    return ;
  }

  console.log("当前遍历的结点值是：", root.val);

  preorder(root.left);
  preorder(root.right);
}

const root = {
  val: "A",
  left: {
    val: "B",
    left: {
      val: "D"
    },
    right: {
      val: "E"
    }
  },
  right: {
    val: "C",
    right: {
      val: "F"
    }
  }
};

preorder(root);

