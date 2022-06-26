---
title: 面试题汇总
date: 2022-06-16 10:00:46
categories: 面试
tags: [面试]
cover: https://img1.baidu.com/it/u=2500395055,2979935817&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=282
---

<img src="https://img0.baidu.com/it/u=4204937089,859074527&fm=253&fmt=auto&app=138&f=JPEG?w=255&h=255" />

<a href="https://www.nowcoder.com/discuss/763567" target="_blank" >小红书前端面经</a>

<a href="https://juejin.cn/post/7013953652578582558?share_token=ad9faad3-d177-4d34-9228-086d1d192112" target="_blank" >前端两年经验，历时一个月的面经和总结</a>

<a href="https://cloud.tencent.com/developer/article/1663670" target="_blank" >【面试题】CSS 知识点整理(附答案)</a>

## HTTP 与 TCP

<a href="https://blog.csdn.net/SuNew_bee/article/details/117303320" target="_blank" >HTTP/1.1、HTTP/2、HTTP/3 对 HTTP 的改进</a>

<a href="https://blog.csdn.net/SuNew_bee/article/details/117248731?spm=1001.2014.3001.5502" target="_blank" >TCP 三次握手</a>

<a href="https://blog.csdn.net/SuNew_bee/article/details/117251247?spm=1001.2014.3001.5502" target="_blank" >TCP 四次挥手</a>

<a href="https://blog.csdn.net/SuNew_bee/article/details/117257895?spm=1001.2014.3001.5502" target="_blank" >TCP 重传机制</a>

<a href="https://blog.csdn.net/SuNew_bee/article/details/117263730?spm=1001.2014.3001.5502" target="_blank" >流量控制</a>

<a href="https://www.likecs.com/show-204397172.html" target="_blank" >HTTP 请求和 TCP 链接的对应关系</a>

<a href="https://blog.csdn.net/sinat_41696687/article/details/123458338" target="_blank" >彻底搞懂进程与线程之间的联系</a>

<a href="https://zhuanlan.zhihu.com/p/420055986" target="_blank" >TLS/SSL</a>

<a href="https://juejin.cn/post/6871060072936505352" target="_blank" >TLS/SSL</a>

<a href="https://baijiahao.baidu.com/s?id=1633945802472340217&wfr=spider&for=pc" target="_blank" >CDN</a>

<a href="https://www.jianshu.com/p/60cc4ea02971/" target="_blank" >websocket 面试题</a>

<a href="https://blog.csdn.net/weixin_42674490/article/details/120647995" target="_blank" >websocket 使用</a>

## 身份信息

<!-- <a href="https://zhuanlan.zhihu.com/p/482474619" target="_blank" >JWT 史上最全面试题(大厂常问)</a> -->

<a href="https://www.php.cn/website-design-ask-484695.html" target="_blank" >JWT</a>

<a href="https://zhuanlan.zhihu.com/p/66037342" target="_blank" >单站点登录</a>

## ES6

<a href="https://blog.csdn.net/Dax1_/article/details/123185260" target="_blank" >总结 ES6 中 Map 和 Set 的特点与比较</a>

<a href="https://www.itheima.com/news/20201110/183621.html" target="_blank" >从 async/await 面试题看宏观任务和微观任务</a>

<a href="https://www.jianshu.com/p/844e293d90a7" target="_blank" >箭头函数和普通函数的区别</a>

## js

<a href="https://zhuanlan.zhihu.com/p/142681436?from_voters_page=true" target="_blank" >js 堆和栈的区别</a>
<a href="https://segmentfault.com/a/1190000039042550" target="_blank" >什么是闭包</a>
<a href="https://blog.csdn.net/z591102/article/details/110634593#:~:text=%E6%9C%BA%E7%A7%91%E5%AD%A6%E9%87%8C%EF%BC%8C-,%E5%B0%BE%E8%B0%83%E7%94%A8,-%E6%98%AF%E6%8C%87%E4%B8%80%E4%B8%AA" target="_blank" >tail 调用:尾调用优化（Tail Call Optimization，TCO）</a>

<a href="https://segmentfault.com/a/1190000013396601" target="_blank" >Promise 实现原理</a>
<a href="" target="_blank" >数据劫持 ……^\_^</a>

<hr />

**new 和 Object.create 都是创造一个对象的意思，二者有啥区别呢？**

<a href="https://www.jianshu.com/p/5f718f4a9441#:~:text=jack%27))-,Object.create(),-Object.create%E6%98%AF" target="_blank" >new / Object.create()的实现原理</a>

- 用 Object.create()方法创建新对象,并使用现有对象提供新对象的 proto。
- Object.create() 是 es5 组合继承的 es6 api
- Object.create 克隆的对象也只能实现一级对象的深拷贝
- <a href="https://blog.csdn.net/qq_48648782/article/details/118498146" target="_blank" >使用：创建子对象，让子对象继承父对象的同时，为子对象添加自有属性</a>

```ts
function myNew() {
  let obj = new Object();

  let func = [].shift.call(arguments); //出列，获取第一个参数
  obj.__proto__ = func.prototype; //proto指向原型

  func.apply(obj, arguments); //让obj执行func函数

  return obj;
}
function myCreate(obj) {
  let F = function () {};
  F.prototype = obj;
  return new F();
}
```

  <hr />
  
**对着图看**
![](http://t-blog-images.aijs.top/img/20220617151244.webp)

## 浏览器

<a href="http://t.zoukankan.com/Zzbj-p-13923489.html" target="_blank" > 强缓存、协商缓存发生在 8 中的哪些阶段</a>

## html

<a href="https://blog.csdn.net/oscar999/article/details/121044091" target="_blank" >HTML 如何禁用缓存</a>

## CSS3

<a href="https://www.jianshu.com/p/274a9b3200b4" target="_blank" >BFC 与清除浮动</a>
根节点、浮动、定位[]、display[相关]、表格、网格、多列，总之是把一些子元素圈起来形成封闭的盒子，践行 BFC 的原则[独立、对外不影响（不重叠）]

<a href="https://blog.csdn.net/NCZB007/article/details/108440570" target="_blank" >.clearfix::after(清除浮动)中各个属性及值详细解说</a>

<a href="https://blog.csdn.net/weixin_43613849/article/details/116561796" target="_blank" >css 中实现单行多行文字截断</a>
<a href="https://blog.csdn.net/qq_39221436/article/details/124450355" target="_blank" > css-modules 来深入理解它的原理</a>

<a href="https://blog.csdn.net/xun__xing/article/details/108253723" target="_blank" >css module</a>

<a href="http://v.aijs.top/post/2022-05-23width0" target="_blank" >flex 布局</a>

<a href="https://juejin.cn/post/6844903582370643975" target="_blank" >怎么画一条 0.5px 的边（更新）</a>

<a href="http://www.alloyteam.com/2016/05/summary-of-pseudo-classes-and-pseudo-elements/" target="_blank" >总结伪类与伪元素</a>

<div style="display: flex;flex-direction: row;flex-wrap: wrap">

  <img src="http://t-blog-images.aijs.top/img/20220625174736.png" width=400 style="margin-right: 4px; margin-bottom: 4px"/>

  <img src="http://t-blog-images.aijs.top/img/20220625174712.png" style="boject-fix: none; height: 200px"/>
</div>

`:first-child` `:first-of-type` `:nth-child` `:nth-of-type` 区别

- <a href="http://www.alloyteam.com/2016/05/summary-of-pseudo-classes-and-pseudo-elements/#prettyPhoto:~:text=2-,%3Afirst%2Dchild,-%E5%8C%B9%E9%85%8D%E5%85%83%E7%B4%A0%E7%9A%84" target="_blank" >:first-child</a> 匹配元素的第一个子元素。
- <a href="http://www.alloyteam.com/2016/05/summary-of-pseudo-classes-and-pseudo-elements/#prettyPhoto:~:text=%7D-,4%20first%2Dof%2Dtype,-%E5%8C%B9%E9%85%8D%E5%B1%9E%E4%BA%8E%E5%85%B6" target="_blank" >:first-of-type</a> 匹配属于其父元素的首个特定类型的子元素的每个元素。
- <a href="http://www.alloyteam.com/2016/05/summary-of-pseudo-classes-and-pseudo-elements/#prettyPhoto:~:text=%7D-,6%20%3Anth%2Dchild,-%3Anth%2Dchild%20%E6%A0%B9%E6%8D%AE" target="_blank" >:nth-child </a> 根据元素的位置匹配一个或者多个元素，它接受一个 an+b 形式的参数，an+b 匹配到的元素示例如下：
  1n+0，或 n，匹配每一个子元素。
  2n+0，或 2n，匹配位置为 2、4、6、8… 的子元素，该表达式与关键字 even 等价。
  2n+1 匹配位置为 1、3、5、7… 的子元素、该表达式与关键字 odd 等价。
  3n+4 匹配位置为 4、7、10、13… 的子元素。
  :nth-of-type
- <a href="http://www.alloyteam.com/2016/05/summary-of-pseudo-classes-and-pseudo-elements/#prettyPhoto:~:text=%E5%BC%80%E5%A7%8B%E8%AE%A1%E6%95%B0%E7%9A%84%E3%80%82-,8%20%3Anth%2Dof%2Dtype,-%3Anth%2Dof%2Dtype" target="_blank" >:nth-of-type</a> 与 nth-child 相似，不同之处在于它是只匹配特定类型的元素。

<a href="https://www.runoob.com/cssref/pr-class-position.html" target="_blank" >position 的几个属性和含义</a>

<a href="" target="_blank" >说一下盒模型>\_<</a>

## 响应式

<a href="https://juejin.cn/post/6844903814332432397" target="_blank" >前端响应式布局原理与方案（详细版）</a>

<a href="https://juejin.cn/post/6844903814332432397#:~:text=%E5%AF%B9%E4%BA%8E%E9%9C%80%E8%A6%81%E4%BF%9D%E6%8C%81%E5%AE%BD%E9%AB%98%E6%AF%94%E7%9A%84%E5%9B%BE%EF%BC%8C%E5%BA%94%E8%AF%A5%E7%94%A8padding%2Dtop%E5%AE%9E%E7%8E%B0" target="_blank" >对于需要保持宽高比的图，应该用 padding-top 实现(一种为了解决，图片未加载出来，高度为 0 加载完后，有了内容发生跳变的现象)</a>

<a href="https://juejin.cn/post/6844903814332432397#:~:text=1%E7%89%A9%E7%90%86%E5%83%8F%E7%B4%A0%E7%BA%BF%EF%BC%88%E4%B9%9F%E5%B0%B1%E6%98%AF%E6%99%AE%E9%80%9A%E5%B1%8F%E5%B9%95%E4%B8%8B1px%2C%E9%AB%98%E6%B8%85%E5%B1%8F%E5%B9%95%E4%B8%8B0.5px%E7%9A%84%E6%83%85%E5%86%B5%EF%BC%89%E9%87%87%E7%94%A8transform%E5%B1%9E%E6%80%A7scale%E5%AE%9E%E7%8E%B0" target="_blank" >1 物理像素线</a>

## 算法

<a href="https://www.nowcoder.com/exam/oj?tab=%E7%AE%97%E6%B3%95%E7%AF%87&topicId=295" target="_blank" >刷算法</a>

<a href="https://juejin.cn/post/6844903846779551751" target="_blank" >前端面试之手写代码</a>

## 安全

<a href="http://bigdata.ctocio.com.cn/bigdata/2022/0506/157700.html" target="_blank" >怎么实现接口防刷</a>
<a href="https://blog.csdn.net/liujiango/article/details/107372364" target="_blank" >怎么实现接口防刷</a>

## vue

<a href="https://blog.csdn.net/weixin_45743636/article/details/118100951" target="_blank" >computed 与 watch 的区别</a>

1、**功能上**：computed 是计算属性，watch 是监听一个值的变化，然后执行对应的回调。
2、**是否调用 缓存**：computed 中的函数所依赖的属性没有发生变化，那么调用当前的函数的时候会从缓存中读取，而 watch 在每次监听的值发生变化的时候都会执行回调。
3、**是否调用 return**：computed 中的函数必须要用 return 返回，watch 中的函数不是必须要用 return。
4、**computed** 默认第一次加载的时候就开始监听；watch 默认第一次加载不做监听，如果需要第一次加载做监听，添加 immediate 属性，设置为 true（immediate:true）
5、**使用场景**：computed----当一个属性受多个属性影响的时候，使用 computed-----购物车商品结算。watch–当一条数据影响多条数据的时候，使用 watch-----搜索框.

## react

<a href="https://blog.csdn.net/weixin_39907713/article/details/111237885" target="_blank" >React Router 原理</a>
<a href="https://blog.csdn.net/qingfeng2020/article/details/121136648" target="_blank" >浅谈前端路由原理，VueRouter 原理和 ReactRouter 原理</a>

<a href="https://blog.csdn.net/Android_boom/article/details/125200222" target="_blank" >React Router 源码解析</a>
<a href="https://wenku.baidu.com/view/dbc762dc740bf78a6529647d27284b73f342365b.html" target="_blank" >React 合成事件机制</a>
<a href="https://baijiahao.baidu.com/s?id=1727882238371627418&wfr=spider&for=pc" target="_blank" >web 前端培训 React 合成事件原理解析</a>

<a href="https://www.jianshu.com/p/a68219093f88" target="_blank" >React 事件机制 – 合成事件</a>

- **原生事件**
  当某个元素触发某个事件（如 onclick ），顶层对象 Document 就会发出一个事件流，随着 DOM 树的节点向目标元素节点流去，直到到达事件真正发生的目标元素。
- **事件目标**
  当到达目标元素之后，执行目标元素该事件相应的处理函数。如果没有绑定监听函数，那就不执行。
- **事件冒泡**
  从目标元素开始，往顶层元素传播。途中如果有节点绑定了相应的事件处理函数，这些函数都会被触发一次。
- **事件委托/事件代理**
  - 简单理解就是将一个响应事件委托到另一个元素。
  - 当子节点被点击时，click 事件向上冒泡，父节点捕获到事件后，我们判断是否为所需的节点，然后进行处理。
- **合成事件与原生事件区别**
  - 事件名称命名方式不同
  - 事件处理函数写法不同
  - 阻止默认行为方式不同
- **React 合成事件与原生事件执行顺序**
  - 类似洋葱，
    捕获：`document => react 父级 => react 子级 => 父级原生 => 子级原生`
    冒泡：`document <= react 父级 <= react 子级 <= 父级原生 <= 子级原生`
- **阻止冒泡**
- **原生:** 使用 `e.stopPropagation()` 或者 `e.cancelBubble=true`（IE）来阻止
- **react 中，**阻止冒泡的方式有三种：
  1. 阻止合成事件与非合成事件（除了 document）之间的冒泡，以上两种方式都不适用，需要用到 e.target 判断。
  2. 阻止合成事件与最外层 document 上的事件间的冒泡，用 `e.nativeEvent.stopImmediatePropagation()`;
  3. 阻止合成事件间的冒泡，用 `e.stopPropagation()`;

:::tip

react 禁止事件冒泡

- `e.stopPropagation`用来阻止 React 模拟的事件冒泡
- `e.stopImmediatePropagation` 没这个函数
- `e.nativeEvent.stopPropagation` 原生事件对象的用于阻止 DOM 事件的进一步捕获或者冒泡
- `e.nativeEvent.stopImmediatePropagation` 原生事件对象用于阻止 dom 事件的进一步捕获或者冒泡，且该元素的后续绑定相同事件类型的事件，都会被阻止

:::

<a href="https://zhuanlan.zhihu.com/p/150993869#:~:text=memo%E5%87%BD%E6%95%B0-,2.4.4.%20%E4%B8%8D%E5%8F%AF%E5%8F%98%E6%95%B0%E6%8D%AE%E7%9A%84%E5%8A%9B%E9%87%8F,-%E6%88%91%E4%BB%AC%E9%80%9A%E8%BF%87%E4%B8%80%E4%B8%AA" target="_blank" >setState 返回一样的引用，render 会执行吗</a>

<a href="" target="_blank" >useEffect 的使用方法？useEffect 的 return 会在什么时候执行？useEffect 原理是什么？</a>

<a href="https://blog.csdn.net/leelxp/article/details/108218088#:~:text=%E6%88%91%E4%BB%AC%E6%9D%A5%E7%9C%8B%E7%9C%8BPureComponent%E5%92%8CComponent%E7%9A%84%E5%8C%BA%E5%88%AB%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%C2%A0" target="_blank" >我们来看看 PureComponent 和 Component 的区别是什么？ </a>

<a href="https://react.iamkasong.com/diff/multi.html#diff%E7%9A%84%E6%80%9D%E8%B7%AF:~:text=%23-,%E7%AC%AC%E4%B8%80%E8%BD%AE%E9%81%8D%E5%8E%86,-%E7%AC%AC%E4%B8%80%E8%BD%AE%E9%81%8D" target="_blank" >第一轮遍历</a>

<a href="https://react.iamkasong.com/diff/multi.html#%E7%AC%AC%E4%B8%80%E8%BD%AE%E9%81%8D%E5%8E%86:~:text=%23-,%E7%AC%AC%E4%BA%8C%E8%BD%AE%E9%81%8D%E5%8E%86,-%E5%AF%B9%E4%BA%8E%E7%AC%AC%E4%B8%80%E8%BD%AE" target="_blank" >第二轮遍历</a>

<a href="https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/" target="_blank" >react ⽣命周期</a>

## 稳操胜券

<a href="http://dljz.nicethemes.cn/news/show-13202.html" target="_blank" >看完这篇文章保你面试稳操胜券 ——（必考题）javaScript 篇</a>

<a href="https://copyfuture.com/blogs-details/20211119150923474f" target="_blank" >看完这篇文章保你面试稳操胜券——基础篇（html/css)</a>

<a href="https://www.wangt.cc/2021/11/%E7%9C%8B%E5%AE%8C%E8%BF%99%E7%AF%87%E6%96%87%E7%AB%A0%E4%BF%9D%E4%BD%A0%E9%9D%A2%E8%AF%95%E7%A8%B3%E6%93%8D%E8%83%9C%E5%88%B8-vue%E7%AF%87/" target="_blank" >看完这篇文章保你面试稳操胜券-vue 篇</a>

<a href="https://copyfuture.com/blogs-details/20211118131747765L" target="_blank" >读完这篇保你面试稳操胜券——前端面试题“骨灰级”总结</a>

## webpack

<a href="https://zhuanlan.zhihu.com/p/472733451" target="_blank" >Webpack | TreeShaking 工作原理</a>
<a href="https://juejin.cn/post/7039547628379439135" target="_blank" >什么是 tree-shaking</a>

<a href="https://juejin.cn/post/6844903924806189070" target="_blank" >Webpack 优化——将你的构建效率提速翻倍</a>

<a href="https://juejin.cn/post/6844903685407916039" target="_blank" >Webpack 揭秘——走向高阶前端的必经之路</a>

<a href="https://www.cnblogs.com/zhilili/p/14721434.html" target="_blank" >webpack（四）——webpack 里面的 plugin 和 loader 的区别</a>

## 性能

<a href="https://juejin.cn/post/6844903655330562062" target="_blank" >网站性能优化实战——从 12.67s 到 1.06s 的故事</a>

<a href="http://v.aijs.top/post/2022-05-12performance" target="_blank" >浏览器首屏优化-首屏时间获取</a>

## React

<a href="https://blog.csdn.net/github_37759996/article/details/119187241" target="_blank" >Hooks 的实现原理</a>
<a href="https://blog.csdn.net/XH_jing/article/details/124188256" target="_blank" >类组件和纯函数组件的区别</a>

<a href="https://www.php.cn/website-design-ask-491123.html" target="_blank" >React dom 绑定事件和原生事件有什么区别</a>

## 博客推荐

<a href="https://blog.csdn.net/JHXL_?type=blog" target="_blank" >几何心凉</a>
