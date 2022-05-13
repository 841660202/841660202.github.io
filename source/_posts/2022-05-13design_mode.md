---
title: 设计模式
date: 2022-05-13 17:01:15
categories: 前端
tags: [设计模式, 前端]
cover:
---

## 先聊用到过哪些，背后的设计模式是什么

1. 实例化一个 axios 实例，全局都来使用它 _单例模式_
2. 兄弟组件通信,事件监听 _观察者模式_
3. 构造函数继承、类的继承 _构造函数模式_
4. 实例化不同的实例 _工厂模式_
5. 优化中的`事件代理`_代理模式_
6. esm、commonjs*模块模式*
  
*熟悉而又陌生*：熟悉的是一直在用，陌生的是学名竟然是这些。我都有点怀疑了，这是真的吗？是真的吗？～～～

<img 
   src="https://img1.baidu.com/it/u=1902986975,2375222058&fm=253&fmt=auto&app=138&f=JPEG?w=535&h=500" 
   width=100 style="border-radius: 10px" 
   />

   <div style="font-size: 20px; color: orange;margin-top: 30px">来～来～来～，我们继续。。。</div>

## 啥呀
>“设计模式(英语 design pattern)是对面向对象设计中`反复出现的问题的解决方案`。这个术语是在1990年代由Erich Gamma等人从建筑设计领域`引入到`计算机科学中来的。”

## 策略模式

## 代理模式

- 作用：访问控制
- 距离：事件代理、Proxy、Object.defineProperty

## 单例模式

- 定义：唯一实例，全局可访问
- 场景：请求实例、全局缓存、线程池、window 对象、登录浮框
- 实现：已经创建过的直接返回，不重复创建

## 工厂模式

- 作用：创建同一类对象
- 分类：_简单工厂_、_方法工厂_

### 1. 简单工厂

- 例如：项目中根据用户权限渲染不同的页面，在不同权限等级用户的构造函数中，保存用户可以看到的页面
- 优点：一个正确的参数，就可以获取到所需要的对象，无需知道其创建的具体细节
- 缺点：函数会成为一个超级函数，难以维护，简单工厂适用于创建少量对象，对象的逻辑不能复杂

### 2. 工厂方法

- 本质：将创建对象的工作，推迟到子类中，这样核心类就变成抽象类

```js
let UserFactory = function (type) {
  if (this instanceof UserFactory) {
    return new this[type]();
  } else {
    return new UserFactory(type);
  }
};

// 工厂方法，函数的原型中设置所有对象的构造函数

UserFactory.prototype = {
  SuperAdmin: function () {
    this.name = "超级管理员";
    this.viewPage = ["首页", "订单管理", "用户管理", "应用管理", "权限管理"];
  },
  Admin: function () {
    this.name = "管理员";
    this.viewPage = ["首页", "订单管理", "用户管理"];
  },
  NormalUser: function () {
    this.name = "普通用户";
    this.viewPage = ["首页", "订单管理"];
  },
};

// 调用
let superAdmin = new UserFactory("SuperAdmin");
let admin = new UserFactory("Admin");
let normalUser = new UserFactory("NormalUser");
```

### 3. 抽象工厂

-

## 构造函数模式

## 👀 观察者模式

- 定义： 对象间的一种一对多的依赖关系
- 作用：一个对象状态发生变化时，所有依赖他的对象，都将得到通知
- 优点：解耦
- 组成：发布者、订阅者
- 场景：事件监听、eventBus

```js
document.body.addEventListener("click", function () {}, false);
```

## 混合模式

## 模块模式

- 作用：避免全局污染，按需暴露
- 实现：多采用闭包

```js
var Person = (function () {
  var name = "xxx";
  function sayName(params) {
    console.log(name);
  }
  return {
    name,
    sayName,
  };
})();
```
