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

<a href="https://www.jianshu.com/p/5f718f4a9441#:~:text=jack%27))-,Object.create(),-Object.create%E6%98%AF" target="_blank" >new / Object.create()的实现原理</a>

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

## 算法

<a href="https://www.nowcoder.com/exam/oj?tab=%E7%AE%97%E6%B3%95%E7%AF%87&topicId=295" target="_blank" >刷算法</a>

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

## 稳操胜券

<a href="http://dljz.nicethemes.cn/news/show-13202.html" target="_blank" >看完这篇文章保你面试稳操胜券 ——（必考题）javaScript 篇</a>

<a href="https://copyfuture.com/blogs-details/20211119150923474f" target="_blank" >看完这篇文章保你面试稳操胜券——基础篇（html/css)</a>

<a href="https://www.wangt.cc/2021/11/%E7%9C%8B%E5%AE%8C%E8%BF%99%E7%AF%87%E6%96%87%E7%AB%A0%E4%BF%9D%E4%BD%A0%E9%9D%A2%E8%AF%95%E7%A8%B3%E6%93%8D%E8%83%9C%E5%88%B8-vue%E7%AF%87/" target="_blank" >看完这篇文章保你面试稳操胜券-vue 篇</a>

<a href="https://copyfuture.com/blogs-details/20211118131747765L" target="_blank" >读完这篇保你面试稳操胜券——前端面试题“骨灰级”总结
</a>


## webpack

<a href="https://zhuanlan.zhihu.com/p/472733451" target="_blank" >Webpack | TreeShaking 工作原理</a>
<a href="https://juejin.cn/post/7039547628379439135" target="_blank" >什么是 tree-shaking</a>

<a href="https://juejin.cn/post/6844903924806189070" target="_blank" >Webpack 优化——将你的构建效率提速翻倍</a>

<a href="https://juejin.cn/post/6844903685407916039" target="_blank" >Webpack 揭秘——走向高阶前端的必经之路</a>

<a href="https://www.cnblogs.com/zhilili/p/14721434.html" target="_blank" >webpack（四）——webpack 里面的 plugin 和 loader 的区别</a>

## 性能

<a href="https://juejin.cn/post/6844903655330562062" target="_blank" >网站性能优化实战——从 12.67s 到 1.06s 的故事</a>

## React

<a href="https://blog.csdn.net/github_37759996/article/details/119187241" target="_blank" >Hooks 的实现原理</a>
<a href="https://blog.csdn.net/XH_jing/article/details/124188256" target="_blank" >类组件和纯函数组件的区别</a>

<a href="https://www.php.cn/website-design-ask-491123.html" target="_blank" >React dom 绑定事件和原生事件有什么区别</a>


## 博客推荐


<a href="https://blog.csdn.net/JHXL_?type=blog" target="_blank" >几何心凉</a>