function add(str1, str2) {
  str1 = str1.split(""); // 转化成数组
  str2 = str2.split(""); // 转化成数组
  let result = ""; // 结果
  let flag = 0; // 满10进1标记
  while (str1.length || str2.length || flag) {

    flag = flag + ~~str1.pop() + ~~str2.pop(); // ~~undefined = 0, true + 0 =1, false + 0 = 0

    result = (flag % 10) + result; // 结果

    flag = flag > 9; // 是否进位
  }
  return result.replace(/^0+/, ""); // 首部有0去除
}

console.log(add("00125", "0131231231232132136"))