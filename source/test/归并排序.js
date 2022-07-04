const arr = [2, 44, 1, 0, -22, 56, -78];
function mergeSort(arr) {
  if (arr.length === 0 || arr.length === 1) return arr;

  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);
  console.log(middle, left, right)
  return merge(mergeSort(left), mergeSort(right));

  // 辅助函数，用于将两个数组合并为一个有序数组，并返回
  function merge(left, right) {
    const result = [];
    console.log('left,right',left,right)
    while (left.length && right.length) {
      // 放入较小的元素，并从头部移出
      result.push(left[0] <= right[0] ? left.shift() : right.shift());
    }
    result.push(...left, ...right); // 放入剩余元素
    console.log('result',result)
    return result;
  }
}
console.log(mergeSort(arr));

// [ 2, 44, 1 ]              [ 0, -22, 56, -78 ]
// [ 2 ] [ 44, 1 ]           [ 0, -22 ] [ 56, -78 ]
// [ 44 ] [ 1 ]              [ 0 ] [ -22 ]
//                           [ 56 ] [ -78 ]

// 合并

// [ 2, 44, 1 ]              [ 0, -22, 56, -78 ]
// [ 2 ] [ 44, 1 ]           [ 0, -22 ] [ 56, -78 ]
// [ 44 ] [ 1 ]              [ 0 ] [ -22 ]
//                           [ 56 ] [ -78 ]