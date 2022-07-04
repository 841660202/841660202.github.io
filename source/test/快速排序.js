/*
快排是冒泡的一种改进，基于分治思想
*/
const arr2 = [2, 44, 1, 0, -22, 56, -78];
function quickSort2(arr) {
  if (arr.length === 0) return arr;
  const pivot = arr.pop(); // 使用最后一个元素当作基准数
  const left = [],
    right = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) left.push(arr[i]); // 小于基准数则放到left
    else right.push(arr[i]); // 大于基准数则放到right
  }
  // 合并left的快排结果，基准数和右侧的快排结果
  console.log("arr", arr);
  console.log("left", left);
  console.log("right", right);
  console.log('--')
  return quickSort2(left).concat(pivot, quickSort2(right));
}

console.log(quickSort2(arr2));
// arr [ 2, 44, 1, 0, -22, 56 ]
// left []
// right [ 2, 44, 1, 0, -22, 56 ]
// --
// arr [ 2, 44, 1, 0, -22 ]
// left [ 2, 44, 1, 0, -22 ]
// right []
// --
// arr [ 2, 44, 1, 0 ]
// left []
// right [ 2, 44, 1, 0 ]
// --
// arr [ 2, 44, 1 ]
// left []
// right [ 2, 44, 1 ]
// --
// arr [ 2, 44 ]
// left []
// right [ 2, 44 ]
// --
// arr [ 2 ]
// left [ 2 ]
// right []
// --
// arr []
// left []
// right []
// --
// [
//   -78, -22,  0, 1,
//     2,  44, 56
// ]