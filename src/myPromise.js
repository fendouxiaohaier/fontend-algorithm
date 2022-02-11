/**
 * @description 模拟Promise 包含构造函数 then catch 方法
 */

const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

class MyPromise {
	constructor(executor) {
		this.value = null;
		this.error = null;
		this.status = PENDING;
		this.onResolve = null;
		this.onReject = null;

		const resolve = (value) => {
			// 只处理PENDING的状态
			if (this.status !== PENDING) {
				return;
			}

			const that = this;

			// 用setTimeout模拟一个微任务
			setTimeout(() => {
				that.value = value;
				that.status = RESOLVED;
				that.onResolve && this.onResolve(this.value);
			}, 0);
		};

		const reject = (error) => {
			// 与resolve一样，只处理PENDING的状态
			if (this.status !== PENDING) {
				return;
			}

			const that = this;
			setTimeout(() => {
				that.error = error;
				that.status = REJECTED;
				that.onReject && that.onReject(that.error);
			}, 0);
		};

		executor(resolve, reject);
	}

	then(onResolve, onReject) {
		if (this.status === PENDING) {
			this.onResolve = onResolve;
			this.onReject = onReject;
		} else if (this.status === RESOLVED) {
			onResolve(this.value);
		} else if (this.status === REJECTED) {
			onReject(this.error);
		}

		return this;
	}

	catch(onReject) {
		return this.then(null, onReject);
	}
}

// 测试
new Promise((resolve, reject) => {
	// 模拟一个请求
	setTimeout(() => {
		// 模拟正常返回
		// resolve('我是返回的数据');
		// 模拟异常返回
		reject("我是一个error");
	}, 5000);
})
	.then((value) => {
		console.log("then中的输出", value);
	})
	.catch((error) => {
		console.log(error);
	});
