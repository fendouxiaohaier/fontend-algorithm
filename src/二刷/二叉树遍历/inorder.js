const { root } = require("./sourceData");

const inOrder = (root) => {
	// 递归边界，root为空
	if (!root) {
		return;
	}

	// 递归遍历左子树
	inOrder(root.left);

	// 使用当前节点值
	console.log("当前正在遍历的值", root.val);

	// 最后再遍历右子节点
	inOrder(root.right);
};

inOrder(root);
