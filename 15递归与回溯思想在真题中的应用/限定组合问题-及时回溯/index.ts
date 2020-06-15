function combine(n: number, k: number): number[][] {

  let res: number[][] = [];
  let subset: number[] = [];

  dfs(1);

  function dfs(index: number): void {
    if(subset.length === k) {
      res.push([...subset]);
      return;
    }

    for(let i=index; i<=n; i++) {
      subset.push(i);
      dfs(i+1);
      subset.pop();
    }
  }

  return res;
}

// test

console.log(combine(4, 2));
