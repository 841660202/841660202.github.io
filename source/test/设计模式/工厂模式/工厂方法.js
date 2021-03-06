// 工厂方法
function Factory(career) {
  if (this instanceof Factory) {
    return new this[career]();
  } else {
    return new Factory(career);
  }
}


// 工厂方法函数的原型中, 设置所有对象的构造函数
Factory.prototype = {
  coder: function () {
    this.careerName = "程序员";
    this.work = ["写代码", "修Bug"];
  },
  hr: function () {
    this.careerName = "HR";
    this.work = ["招聘", "员工信息管理"];
  },
  driver: function () {
    this.careerName = "司机";
    this.work = ["开车"];
  },
  boss: function () {
    this.careerName = "老板";
    this.work = ["喝茶", "开会", "审批文件"];
  },
};



let coder = new Factory("coder");
console.log(coder);

let hr = new Factory("hr");
console.log(hr);
