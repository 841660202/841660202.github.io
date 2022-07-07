function arr2tree(arr) {
  let hash = {};
  const result = [];

  for (let item of arr) {
    hash[item.id] = item;
  }

  for (let item of arr) {
    const parent = hash[item.pid];
    if (parent) {
      if (!parent.children) {
        parent.children = [];
      }
      delete item.pid;
      parent.children.push(item); // 之所以能够实现，原因：使用了数组引用
    } else {
      delete item.pid;
      result.push(item); // 只有第一次pid = 0的时候，树根节点才走这里
    }
  }
  hash = undefined; // 回收
  return result;
}
// 作者：liuz2
// 链接：https://juejin.cn/post/7064576548195532837
// 来源：稀土掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

const arr = [
  { id: 1, pid: 0 },
  { id: 2, pid: 1 },
  { id: 3, pid: 1 },
  { id: 4, pid: 2 },
  { id: 5, pid: 2 },
  { id: 6, pid: 3 },
];

const res = arr2tree(arr);
console.log("res", JSON.stringify(res, null, 2));
