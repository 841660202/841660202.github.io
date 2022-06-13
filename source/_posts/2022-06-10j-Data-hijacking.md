---
title: javascript 劫持(函数/数据)
date: 2022-06-10 15:05:21
categories: js基础
tags: [js基础]
cover: https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fres.cloudinary.com%2Fcitiar%2Fimage%2Fupload%2Fv1611373461%2Fucamc%2Fcommon%2Fthumb_5x_Javascript-O.png&refer=http%3A%2F%2Fres.cloudinary.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1657437058&t=2169b1ec59622a8e20039841292e4d8b
---

## 函数劫持

函数劫持，在一个函数运行之前就把它劫持下来，添加我们想要的功能。 在函数运行之前，我们可以改变函数的参数，或者改变函数的返回值。

> JavaScript 中的函数劫持是一个增强原有函数的技巧，一般我们用来对原有的 JavaScript 全局方法做一些能力的增强。

**函数劫持原理**

函数劫持原理，是在函数运行之前，把函数的原型改变为新的函数，并且把原函数的执行代码放到新函数的执行代码之前。

**函数劫持实现**

- 使用`新的变量`保存被劫持函数
- `新函数中`改`写被劫持函数`
- `新函数中` `调用原有的函数`（保存在变量中的函数）

**基础：两个对象指向同一个地址的时候，修改某个对象的属性，另外一个对象也会随之变化**

```js
let a = {};
let b = a;
a.name = "Gopal";
// ture {name: 'Gopal'}  {name: 'Gopal'}
console.log(b === a, a, b);
```

**基础：将新的对象赋值给对象变量的时候，该对象变量就指向了新对象的引用地址，跟旧引用切断关联**

```js
let a = {};
let b = a;
a = { name: "Gopal" };
// false {name: 'Gopal'} {}
console.log(b === a, a, b);
```

**应用场景**

- 增强你的函数功能
  - 如上面的第一个例子，在原有的函数之上，实现特定的逻辑。
- 追踪 XSS 攻击
  - 一般 XSS 攻击会先利用 alert() 等方法输出信息进行测试，这个时候，我们可以对原先的 alert() 进行劫持，向其输入追踪信息的代码，最后才把原函数执行。
  ```js
  function report(caller) {
    var img = new Image();
    img.src = `http://www.site.com/getReport.php?caller=${encodeURIComponent(
      caller
    )}`;
  }
  var _alert = window.alert;
  window.alert = function (s) {
    // 拿到攻击者相关信息，并上报
    report(alert.caller);
    _alert(s);
  };
  alert("test");
  ```

**劫持 ajax 请求，实现 mock 功能**

- mock.js 中，就是通过对原生的 XMLHttpRequest（或 ActiveXObject）进行劫持，判断有没有找到匹配的数据模板，如果找到，则拦截 XHR 请求逻辑，执行自身规则对应的逻辑。如果未找到匹配的数据模板，则采用原生 XHR 发送请求。详细代码看这里。

## 数据劫持 defineProperty

## Object.defineProperty()

通过设置对象属性 getter 和 setter 来监听属性的变化，可以实现数据劫持。getter 时候进行依赖收集，setter 时候进行数据变更时通知订阅者更新视图。

```js
function defineReactive(obj, key, value) {
  observe(value); // 递归子属性
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      collectDeps(); // 收集依赖
      return value;
    },
    set: function reactiveSetter(newVal) {
      observe(newVal); // 若是新值是对象，则递归子属性
      if (value !== newVal) {
        notify(); // 通知订阅者更新视图
        console.log("数据变更了");
        value = newVal;
      }
    },
  });
}

function observe(obj) {
  if (!obj || typeof obj !== "object") {
    return;
  }
  Object.keys(obj).forEach((key) => {
    // 有递归
    defineReactive(obj, key, obj[key]);
  });
}

var data = {
  name: "Gopal",
  sex: "male",
};
```

**缺点**

- 无法检测到对象属性的新增或删除

由于 js 的动态性，可以为对象追加新的属性或者删除其中某个属性，这点对经过 Object.defineProperty 方法建立的响应式对象来说，只能追踪对象已有数据是否被修改，无法追踪新增属性 或删除属性，这就需要另外处理。

- 无法监听数组的变化

vue 在实现数组的响应式时，使用了一些 hack,把无法监听数组的情况通过重写数组的部分方法来实现响应式，这也只限制在数组的 push/pop/shift/unshift/splice/sort/reverse 7 个方法上，其他方法无法监听。`目前没读过源码，不晓得这搬来文章内容是否正确`

## 数据劫持 Proxy

Proxy,字面意思是代理，是 ES6 提供的一个新的 API,用于修改某些操作的默认行为，可以理解为在目标对象之前做一层拦截，外部所有的访问都必须通过这层拦截，通过这层拦截可以做很多事情，比如对数据进行过滤、修改或者收集信息之类。借用 proxy 的巧用的一幅图，它很形象的表达了 Proxy 的作用

ES6 原生提供的 Proxy 构造函数：

```js
var proxy = new Proxy(target, handler);
```

其中 obj 为 Proxy 要拦截的对象，handler 用来定制拦截的操作，返回一个新的代理对象 proxy；Proxy 代理特点：

- Proxy 的代理针对的是整个对象，而不是像 Object.defineProperty 针对某个属性。只需做一层代理就可以监听同级结构下的所有属性变化，包括新增属性和删除属性。
- Proxy 也可以监听数组的变化。

```js
var proxy = new Proxy([1, 2, 3], {
  get: function (target, property) {
    console.log(target, property);
    return target[property];
  },
});
proxy[0] = 4;
proxy.push(5);
proxy.length;
```

```js
let handler = {
  get: function (target, key) {
    if (target[key] === "object" && target[key] !== null) {
      return new Proxy(target[key], handler);
    }
    collectDeps(); // 收集依赖

    return Reflect.get(target, key);
  },
  set(target, key, value) {
    if (key === "length") return true;
    notifyRender(); // 通知订阅者更新视图
    return Reflect.set(target, key, value);
  },
};

let proxy = new Proxy(data, handler);
proxy.age = 18; // 支持新增属性

let proxy1 = new Proxy({ arr: [] }, handler);
proxy1.arr[0] = "proxy";
```

## 参考链接

[你还不知道 JavaScript 中的函数劫持么？](https://juejin.cn/post/7103837916274622494)
[数据劫持](https://wenku.baidu.com/view/a78cb667fd4733687e21af45b307e87101f6f8ea.html)
