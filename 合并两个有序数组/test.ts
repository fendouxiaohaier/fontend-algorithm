function merge(num1: number[], num2: number[]): number[] {

  let num1Index: number = num1.length - 1;
  let num2Index: number = num2.length - 1;
  let totalIndex: number = num1.length + num2.length - 1;

  //  遍历两个数组，指针同步移动
  while(num1Index >= 0 && num2Index >= 0) {

    // 将较大的值，从末尾往前填补
    if(num1[num1Index] > num2[num2Index]) {
      num1[totalIndex] = num1[num1Index];
      num1Index--;
      totalIndex--;

    } else {
      num1[totalIndex] = num2[num2Index];
      num2Index--;
      totalIndex--;
    }

  }


  // num2未遍历完的情况
  while(num2Index >= 0) {
    num1[totalIndex] = num2[num2Index];
    num2Index--;
    totalIndex--;
  }

  return num1;

}

{
  // test
  let num1 = [1,25,45];
  let num2 = [2,3,4];
  
  let result: number[] = merge(num1, num2);
  
  
  console.log(result);

}