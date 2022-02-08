const { root } = require("./sourceData");

// 所有遍历的入参都是树的根节点
const preOrder = (root) => {
	// 递归的边界，root为空
	if (!root) {
		return;
	}

	// 使用节点
	console.log('当前遍历的结点值是', root.val);

	// 继续递归遍历左子树
	preOrder(root.left);

	// 继续递归遍历右子树
	preOrder(root.right);
};

preOrder(root);
