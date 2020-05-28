export default class BInaryTree<T> {
  private val: T;
  private left?: BInaryTree<T>;
  private right?: BInaryTree<T>;

  constructor(val: T, left?: BInaryTree<T>, right?: BInaryTree<T>) {
    this.val = val;
    this.left = left;
    this.right = right;
  }

  getVal(): T {
    return this.val;
  }

  getLeft(): BInaryTree<T> | undefined {
    return this.left;
  }

  getRight(): BInaryTree<T> | undefined {
    return this.right;
  }
}