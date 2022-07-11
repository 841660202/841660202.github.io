function deepClone(obj) {
  let result;
  if (typeof obj == "object") {
    result = isArray(obj) ? [] : {}; // 空对象接收
    for (let i in obj) {
      result[i] =
        isObject(obj[i]) || isArray(obj[i]) ? deepClone(obj[i]) : obj[i];
    }
  } else {
    result = obj;
  }
  return result;
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) == "[object Object]";
}

function isArray(obj) {
  return Object.prototype.toString.call(obj) == "[object Array]";
}

var a = { a: 1, b: { bb: 1 }, c: null };

console.log(deepClone(a));
