/**
 * 反转二叉树
 * 输入：
     4
   /   \
  2     7
 / \   / \
1   3 6   9

输出：
     4
   /   \
  7     2
 / \   / \
9   6 3   1
 * @param {*} root 
 */
function invertTree(root) {
  if(!root) {
    return root;
  }

  let right = invertTree(root.right);
  let left = invertTree(root.left);

  root.left = right;
  root.right = left;

  return root;
}

// test

var root = {
  val: 4,
  left: {
    val: 2,
    left: {
      val: 1,
    },
    right: {
      val: 3
    }
  },
  right: {
    val: 7,
    left: {
      val: 6
    },
    right: {
      val: 9
    }
  }

}