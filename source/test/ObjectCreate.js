Object.myCreate = function (obj) {
  let F = function () {};
  F.prototype = obj;
  return new F();
};

var a = new Car();

function Car() {
  this.color = "red";
  this.person = { name: "张三" };
}

var b = Object.myCreate(a);

console.log("b", b);

var c = Object.create(a);
console.log("c", c);

console.log(Object.create(null))
console.log(Object.create({}))