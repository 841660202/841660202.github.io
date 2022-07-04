const arr = [2, 44, 1, 0, -22, 56, -78];
function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i; // 假设arr[i]为最小元素（即默认就是递增）
    let tmp;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        // 如果arr[j]比arr[minIndex]还小
        minIndex = j; // 更新最小元素的下标
      }
    }
    // 交换arr[i]和arr[minIndex]
    tmp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = tmp;
  }
  return arr;
}

console.log(selectionSort(arr));
