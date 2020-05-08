function inorder(root) {
  if(!root) {
    return 
  }

  inorder(root.left);

  console.log("当前遍历的结点值是：",root.val);

  inorder(root.right);
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

inorder(root);