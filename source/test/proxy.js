let obj = {
  name: "Eason",
  age: 30,
};
let handler = {
  get(target, key, receiver) {
    console.log("get", key);
    return Reflect.get(target, key);
  },
  set(target, key, value, receiver) {
    console.log("set", key, value);
    return Reflect.set(target, key, value);
  },
};
let proxy = new Proxy({ ...obj }, handler);
proxy.name = "Zoe"; // set name Zoe
proxy.age = 18; // set age 18

console.log("obj", obj);
console.log("proxy", proxy);
