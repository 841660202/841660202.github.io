---
title: 浏览器首屏优化-首屏时间获取
date: 2022-05-12 18:27:05
categories: performance
tags: [performance, 前端, 浏览器原理]
---

## 优化的指标

白屏时间 = 地址栏输入网址后回车 - 浏览器出现第一个元素
首屏时间 = 地址栏输入网址后回车 - 浏览器第一屏渲染完成

影响白屏时间的因素：网络，服务端性能，前端页面结构设计。
影响首屏时间的因素：白屏时间，资源下载执行时间。

通常在 head 解析完，body 开始渲染此时是白屏结束
白屏时间 = firstPaint - performance.timing.navigationStart || pageStartTime

## 常用方法

1. 首屏模块标签标记， 你觉得首屏完成的地方插入脚本
2. 同级首屏内加载最慢的图片/iframe

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9sejV6LmNvbS9hc3NldHMvaW1nL3BlcmZvcm1hbmNlLnBuZw?x-oss-process=image/format,png)

## 加载阶段

左边红线代表的是网络传输层面的过程，右边红线代表了服务器传输回字节后浏览器的各种事件状态，这个阶段包含了浏览器对文档的解析，DOM 树构建，布局，绘制等等。
_1. prompt for unload_

- navigationStart: 表示从上一个文档卸载结束时的 unix 时间戳，如果没有上一个文档，这个值将和 fetchStart 相等。
  _2. 前一个网页卸载_
- unloadEventStart: 表示前一个网页（与当前页面同域）unload 的时间戳，如果无前一个网页 unload 或者前一个网页与当前页面不同域，则值为 0。
- unloadEventEnd: 返回前一个页面 unload 时间绑定的回掉函数执行完毕的时间戳。
  _3. 重定向_
- redirectStart: 第一个 HTTP 重定向发生时的时间。有跳转且是同域名内的重定向才算，否则值为 0。
- redirectEnd: 最后一个 HTTP 重定向完成时的时间。有跳转且是同域名内部的重定向才算，否则值为 0。
  _4. 使用 HTTP 请求_
- fetchStart: 浏览器准备好使用 HTTP 请求抓取文档的时间，这发生在检查本地缓存之前。
  _5. 域名解析_
- domainLookupStart/domainLookupEnd: DNS 域名查询开始/结束的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
  _6. tcp 链接_
- connectStart: HTTP（TCP）开始/重新 建立连接的时间，如果是持久连接，则与 fetchStart 值相等。
- connectEnd: HTTP（TCP） 完成建立连接的时间（完成握手），如果是持久连接，则与 fetchStart 值相等。
  _7. ssl 建立_
- secureConnectionStart: HTTPS 连接开始的时间，如果不是安全连接，则值为 0。
  _8. 读取文档_
- requestStart: HTTP 请求读取真实文档开始的时间（完成建立连接），包括从本地读取缓存。
  _9. 响应_
- responseStart: HTTP 开始接收响应的时间（获取到第一个字节），包括从本地读取缓存。
- responseEnd: HTTP 响应全部接收完成的时间（获取到最后一个字节），包括从本地读取缓存。
  _10. 解析 dom_
- domLoading: 开始解析渲染 DOM 树的时间，此时 Document.readyState 变为 loading，并将抛出 readystatechange 相关事件。
  _11. dom 可交互_
- domInteractive: 完成解析 DOM 树的时间，Document.readyState 变为 interactive，并将抛出 readystatechange 相关事件，注意只是 DOM 树解析完成，这时候并没有开始加载网页内的资源。
  _12. 页面内资源加载_
- domContentLoadedEventStart: DOM 解析完成后，网页内资源加载开始的时间，在 DOMContentLoaded 事件抛出前发生。
- domContentLoadedEventEnd: DOM 解析完成后，网页内资源加载完成的时间（如 JS 脚本加载执行完毕）。
  _13. dom 树解析完成_
- domComplete: DOM 树解析完成，且资源也准备就绪的时间，Document.readyState 变为 complete，并将抛出 readystatechange 相关事件。
  _14. load 事件_
- loadEventStart: load 事件发送给文档，也即 load 回调函数开始执行的时间。
- loadEventEnd: load 事件的回调函数执行完毕的时间。

## Performance 接口

Performance 接口可以获取到当前页面与性能相关的信息。

```json
{
  "timeOrigin": 1652338539312.5,
  "timing": {
    "connectStart": 1652338539353,
    "navigationStart": 1652338539312,
    "loadEventEnd": 1652338542492,
    "domLoading": 1652338539823,
    "secureConnectionStart": 1652338539401,
    "fetchStart": 1652338539316,
    "domContentLoadedEventStart": 1652338540574,
    "responseStart": 1652338539807,
    "responseEnd": 1652338539828,
    "domInteractive": 1652338540574,
    "domainLookupEnd": 1652338539353,
    "redirectStart": 0,
    "requestStart": 1652338539505,
    "unloadEventEnd": 0,
    "unloadEventStart": 0,
    "domComplete": 1652338542489,
    "domainLookupStart": 1652338539353,
    "loadEventStart": 1652338542489,
    "domContentLoadedEventEnd": 1652338540575,
    "redirectEnd": 0,
    "connectEnd": 1652338539504
  },
  "navigation": {
    "type": 0,
    "redirectCount": 0
  }
}
```

```js
function getPerfermanceTiming() {
  let t = performance.timing;

  // 重定向结束时间 - 重定向开始时间
  let redirect = t.redirectEnd - t.redirectStart;
  // DNS 查询开始时间 - fetech start 时间
  let appCache = t.domainLookupStart - t.fetchStart;
  // DNS 查询结束时间 - DNS 查询开始时间
  let dns = t.domainLookupEnd - t.domainLookupStart;
  // 完成 TCP 连接握手时间 - TCP 连接开始时间
  let tcp = t.connectEnd - t.connectStart;
  // 从请求开始到接收到第一个响应字符的时间
  let ttfb = t.responseStart - t.requestStart;
  // 资源下载时间，响应结束时间 - 响应开始时间
  let contentDL = t.responseEnd - t.responseStart;
  // 从请求开始到响应结束的时间
  let httpTotal = t.responseEnd - t.requestStart;
  // 从页面开始到 domContentLoadedEventEnd
  let domContentloaded = t.domContentLoadedEventEnd - t.navigationStart;
  // 从页面开始到 loadEventEnd
  let loaded = t.loadEventEnd - t.navigationStart;

  let result = [
    { key: "Redirect", desc: "网页重定向的耗时", value: redirect },
    { key: "AppCache", desc: "检查本地缓存的耗时", value: appCache },
    { key: "DNS", desc: "DNS查询的耗时", value: dns },
    { key: "TCP", desc: "TCP连接的耗时", value: tcp },
    {
      key: "Waiting(TTFB)",
      desc: "从客户端发起请求到接收到响应的时间 / Time To First Byte",
      value: ttfb,
    },
    {
      key: "Content Download",
      desc: "下载服务端返回数据的时间",
      value: contentDL,
    },
    { key: "HTTP Total Time", desc: "http请求总耗时", value: httpTotal },
    {
      key: "DOMContentLoaded",
      desc: "dom加载完成的时间",
      value: domContentloaded,
    },
    { key: "Loaded", desc: "页面load的总耗时", value: loaded },
  ];
  return result;
}
getPerfermanceTiming();
```

[Web 性能优化-首屏和白屏时间](https://blog.csdn.net/z9061/article/details/101454438)

## 来看下简书

- 链接
  - [简书](https://www.jianshu.com/p/464593cea4dc)
- 简书代码

```js
window.addEventListener("load", function () {
  setTimeout(function () {
    var e = window.performance;
    if (e) {
      var t = e.getEntriesByType("navigation")[0],
        r = 0;
      t || (r = (t = e.timing).navigationStart);
      var n = [
        {
          key: "Redirect",
          desc: "\u7f51\u9875\u91cd\u5b9a\u5411\u7684\u8017\u65f6",
          value: t.redirectEnd - t.redirectStart,
        },
        {
          key: "AppCache",
          desc: "\u68c0\u67e5\u672c\u5730\u7f13\u5b58\u7684\u8017\u65f6",
          value: t.domainLookupStart - t.fetchStart,
        },
        {
          key: "DNS",
          desc: "DNS\u67e5\u8be2\u7684\u8017\u65f6",
          value: t.domainLookupEnd - t.domainLookupStart,
        },
        {
          key: "TCP",
          desc: "TCP\u8fde\u63a5\u7684\u8017\u65f6",
          value: t.connectEnd - t.connectStart,
        },
        {
          key: "Waiting(TTFB)",
          desc: "\u4ece\u5ba2\u6237\u7aef\u53d1\u8d77\u8bf7\u6c42\u5230\u63a5\u6536\u5230\u54cd\u5e94\u7684\u65f6\u95f4 / Time To First Byte",
          value: t.responseStart - t.requestStart,
        },
        {
          key: "Content Download",
          desc: "\u4e0b\u8f7d\u670d\u52a1\u7aef\u8fd4\u56de\u6570\u636e\u7684\u65f6\u95f4",
          value: t.responseEnd - t.responseStart,
        },
        {
          key: "HTTP Total Time",
          desc: "http\u8bf7\u6c42\u603b\u8017\u65f6",
          value: t.responseEnd - t.requestStart,
        },
        {
          key: "DOMContentLoaded",
          desc: "dom\u52a0\u8f7d\u5b8c\u6210\u7684\u65f6\u95f4",
          value: t.domContentLoadedEventEnd - r,
        },
        {
          key: "Loaded",
          desc: "\u9875\u9762load\u7684\u603b\u8017\u65f6",
          value: t.loadEventEnd - r,
        },
      ];
      if (Math.random() > 0.75) {
        var s = window.location,
          i = s.href,
          c = s.pathname,
          u = navigator.userAgent,
          d = i.split("?")[0];
        o.a
          .post("https://tr.jianshu.com/fe/1/mon/atf", {
            app: "shakespeare-performance",
            url: d,
            ua: u,
            path: c,
            stats_ttfb: t.responseStart - t.requestStart,
            stats_domLoaded: t.domContentLoadedEventEnd - r,
            stats_loaded: t.loadEventEnd - r,
          })
          .then(a.a)
          .catch(a.a);
      }
      console && console.log && console.log(n);
    }
  }, 0);
});
```

## 简书截图

![](http://t-blog-images.aijs.top/img/20220605112219.webp)

## domContentLoadedEventEnd 与 loaded

```js
// 从页面开始到 domContentLoadedEventEnd
let domContentloaded = t.domContentLoadedEventEnd - t.navigationStart;
// 从页面开始到 loadEventEnd
let loaded = t.loadEventEnd - t.navigationStart;
```

**domContentLoadedEventEnd 比 loaded 先触发**

![](http://t-blog-images.aijs.top/img/20220605133905.webp)
