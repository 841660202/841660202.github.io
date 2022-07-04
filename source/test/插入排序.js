const arr = [2, 44, 1, 0, -22, 56, -78];
/*
        简单来说就是，从第二个元素开始，往前找一个合适的位置插进去
        知道找到第一个比自己小的元素，然后插在它的后面
        期间，当前元素与第一个比它小的元素之间的所有元素都向后移动一个位置，
        直到当前元素找到第一个比他小的元素时，直接插在该元素后面就可以
        */
function insertSort(arr) {
  let preIndex, current; // 当前元素之前的下标， 当前元素
  for (let i = 1; i < arr.length; i++) {
    preIndex = i - 1;
    current = arr[i];
    // 当前元素向前找第一个比自己小的元素，然后插在它的后面的合适位置
    while (preIndex >= 0 && arr[preIndex] > current) {
      // 当前元素到这个第一个比自己小的元素之间的元素全部向后移动一个位置，向后挤一挤
      arr[preIndex + 1] = arr[preIndex];
      preIndex--;
      console.log("preIndex", preIndex);
    }
    console.log("--");
    arr[preIndex + 1] = current; // 找到合适位置后,当前元素直接到它的后面
  }
  return arr;
}
console.log(insertSort(arr));

// --
// preIndex 0
// preIndex -1
// --
// preIndex 1
// preIndex 0
// preIndex -1
// --
// preIndex 2
// preIndex 1
// preIndex 0
// preIndex -1
// --
// --
// preIndex 4
// preIndex 3
// preIndex 2
// preIndex 1
// preIndex 0
// preIndex -1
// --
