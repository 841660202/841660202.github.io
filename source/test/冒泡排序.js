const arr = [2, 44, 1, 0, -22, 56, -78];
// arr.sort((a,b)=>a-b)
function bubbleSort(arr) {
  let tmp;
  for (let i = arr.length; i > 0; i--) {
    // 较大的arr[j]会冒泡到arr的尾部
    for (let j = 0; j < i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // 前一个元素比后一个大，则向后冒泡(交换)
        tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      }
    }
    console.log("arr", i, arr);
  }
  return arr;
}
console.log(bubbleSort(arr)); // [-78, -22, 0, 1, 2, 44, 56]
// 冒泡过程
// [2, 1, 0, -22, 44, -78, 56];
// [1, 0, -22, 2, -78, 44, 56];
// [0, -22, 1, -78, 2, 44, 56];
// [-22, 0, -78, 1, 2, 44, 56];
// [-22, -78, 0, 1, 2, 44, 56];
// [-78, -22, 0, 1, 2, 44, 56];
