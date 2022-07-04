---
title: 浏览器首屏优化-首屏时间获取
date: 2022-05-12 18:27:05
categories: 前端
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

这个图看不懂没关系，往下看，后面会以简书代码和掘金来验证这幅图的正确性

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9sejV6LmNvbS9hc3NldHMvaW1nL3BlcmZvcm1hbmNlLnBuZw?x-oss-process=image/format,png)

**缺失部分：secureConnectionStart**
## 输入 url 发生了什么

- 1、当浏览器地址中输入 url 后，`navigationStart`如果之前有前一个网页（与当前页面不一定同域）unload 的时间戳,如果无前一个网页 unload ，则与 fetchStart 值相等,
- 2、接着，是否有重定向（`redirect` ）
- 3、接着，准备用 HTTP 抓取文档的内容（`fetchStart`）查看`APP Cache`
  - 域名查询（`domainLookupStart、domainLookupEnd`）
  - TCP 连接（`connectStart、connectEnd`）,如果是安全链接，在 connectEnd 之前，会有 SSL 连接(secureConnectionStart)
- 4、接着，HTTP 请求（`requestStart、responseStart、responseEnd`）,如果有缓存，在 responseStart 之前，会有 cacheStart，如果之前有网页，还涉及到网页的 unload，在 cacheStart 之前，会有`unloadStart、unloadEnd`
- 5、接着，dom 解析
  - `domLoading`Document.readyState 变为 loading，并将抛出 readystatechange 相关事件
  - `domInteractive`Document.readyState 变为 interactive，并将抛出 readystatechange 相关事件
  - `domContentLoadedEventStart、domContentLoadedEventEnd `DOM 解析完成后，
    - 网页内资源加载开始，并将抛出 readystatechange 相关事件
    - 网页内资源加载完成，并将抛出 readystatechange 相关事件
  - `domComplete`Document.readyState 变为 complete，并将抛出 readystatechange 相关事件
  - `loadEventStart`load 事件发送给文档，也即 load 回调函数开始执行
  - `loadEventEnd`load 事件的回调函数执行完毕的时间
  - 说明：dom 解析过程，HTML 生成 dom 树，解析 CSS 文件生成 CSSOM 树，DOM 树和 CSSOM 树生成 render 树，也就是渲染树， render 树中对每个节点进行布局，计算每个元素的大小，确定其在屏幕中的位置，绘制。根据 render 树和布局将显示页面

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

:::tip
**数据先不要关注时间循序，后面我们会从多个角度来验证顺序**
:::

```json
{
  "timeOrigin": 1652338539312.5,
  // 顺序已经排好了
  "timing": {
    // 在同一个浏览器上下文中，前一个网页（与当前页面不一定同域）unload 的时间戳，如果无前一个网页 unload ，则与 fetchStart 值相等
    "navigationStart": 1652338539312,
    // 第一个 HTTP 重定向发生时的时间。有跳转且是同域名内的重定向才算，否则值为 0
    "redirectStart": 0,
    // 最后一个 HTTP 重定向完成时的时间。有跳转且是同域名内部的重定向才算，否则值为 0
    "redirectEnd": 0,
    // 浏览器准备好使用 HTTP 请求抓取文档的时间，这发生在检查本地缓存之前
    "fetchStart": 1652338539316,
    // DNS 域名查询开始的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
    "domainLookupStart": 1652338539353,
    // DNS 域名查询完成的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
    "domainLookupEnd": 1652338539353,
    // HTTP（TCP） 开始建立连接的时间，如果是持久连接，则与 fetchStart 值相等
    // 注意如果在传输层发生了错误且重新建立连接，则这里显示的是新建立的连接开始的时间
    "connectStart": 1652338539353,
    // HTTPS 连接开始的时间，如果不是安全连接，则值为 0
    "secureConnectionStart": 1652338539401,
    // HTTP（TCP） 完成建立连接的时间（完成握手），如果是持久连接，则与 fetchStart 值相等
    // 注意如果在传输层发生了错误且重新建立连接，则这里显示的是新建立的连接完成的时间
    // 注意这里握手结束，包括安全连接建立完成、SOCKS 授权通过
    "connectEnd": 1652338539504,
    // HTTP 请求读取真实文档开始的时间（完成建立连接），包括从本地读取缓存
    // 连接错误重连时，这里显示的也是新建立连接的时间
    "requestStart": 1652338539505,
    // HTTP 开始接收响应的时间（获取到第一个字节），包括从本地读取缓存
    "responseStart": 1652338539807,
    // 前一个网页（与当前页面同域）unload 的时间戳，如果无前一个网页 unload 或者前一个网页与当前页面不同域，则值为 0
    "unloadEventStart": 0,
    // 和 unloadEventStart 相对应，返回前一个网页 unload 事件绑定的回调函数执行完毕的时间戳
    "unloadEventEnd": 0,
    // HTTP 响应全部接收完成的时间（获取到最后一个字节），包括从本地读取缓存
    "responseEnd": 1652338539828,
    // 开始解析渲染 DOM 树的时间，此时 Document.readyState 变为 loading，并将抛出 readystatechange 相关事件
    "domLoading": 1652338539823,
    // 完成解析 DOM 树的时间，Document.readyState 变为 interactive，并将抛出 readystatechange 相关事件
    // 注意只是 DOM 树解析完成，这时候并没有开始加载网页内的资源
    "domInteractive": 1652338540574,
    // DOM 解析完成后，网页内资源加载开始的时间
    // 在 DOMContentLoaded 事件抛出前发生
    "domContentLoadedEventStart": 1652338540574,
    // DOM 解析完成后，网页内资源加载完成的时间（如 JS 脚本加载执行完毕）
    "domContentLoadedEventEnd": 1652338540575,
    // load 事件发送给文档，也即 load 回调函数开始执行的时间
    // 注意如果没有绑定 load 事件，值为 0
    "loadEventStart": 1652338542489,
    // load 事件的回调函数执行完毕的时间
    "loadEventEnd": 1652338542492,
    // DOM 树解析完成，且资源也准备就绪的时间，Document.readyState 变为 complete，并将抛出 readystatechange 相关事件
    "domComplete": 1652338542489
  },
  "navigation": {
    // 0   即 TYPE_NAVIGATENEXT 正常进入的页面（非刷新、非重定向等）
    // 1   即 TYPE_RELOAD       通过 window.location.reload() 刷新的页面
    // 2   即 TYPE_BACK_FORWARD 通过浏览器的前进后退按钮进入的页面（历史记录）
    // 255 即 TYPE_UNDEFINED    非以上方式进入的页面
    "type": 0,
    "redirectCount": 0 // // 如果有重定向的话，页面通过几次重定向跳转而来
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

<hr/>

## 聊下性能计算

```js
// 计算加载时间
function getPerformanceTiming() {
  var performance = window.performance;

  if (!performance) {
    // 当前浏览器不支持
    console.log("你的浏览器不支持 performance 接口");
    return;
  }

  var t = performance.timing;
  var times = {};

  //【重要】页面加载完成的时间
  //【原因】这几乎代表了用户等待页面可用的时间
  times.loadPage = t.loadEventEnd - t.navigationStart;

  //【重要】解析 DOM 树结构的时间
  //【原因】反省下你的 DOM 树嵌套是不是太多了！
  times.domReady = t.domComplete - t.responseEnd;

  //【重要】重定向的时间
  //【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
  times.redirect = t.redirectEnd - t.redirectStart;

  //【重要】DNS 查询时间
  //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
  // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)
  times.lookupDomain = t.domainLookupEnd - t.domainLookupStart;

  //【重要】读取页面第一个字节的时间
  //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
  // TTFB 即 Time To First Byte 的意思
  // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
  times.ttfb = t.responseStart - t.navigationStart;

  //【重要】内容加载完成的时间
  //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
  times.request = t.responseEnd - t.requestStart;

  //【重要】执行 onload 回调函数的时间
  //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
  times.loadEvent = t.loadEventEnd - t.loadEventStart;

  // DNS 缓存时间
  times.appcache = t.domainLookupStart - t.fetchStart;

  // 卸载页面的时间
  times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;

  // TCP 建立连接完成握手的时间
  times.connect = t.connectEnd - t.connectStart;

  return times;
}
```

## 聊下性能优化

**假设你对 performance API 很熟悉**

- 减少重定向次数
- DNS 查询时间：HTML5 Prefetch 预查询
- TCP 连接: http1.1 开启 connect: keep-alive, http2.0， 如果可以的话 **http3.0 可以看本站另一篇文章**
- 资源压缩：gzip、brotli、图片压缩、tree-shaking、console 移除
- 资源整合：减少请求次数、减少网络请求，雪碧图（虽然 http2 提供了**多路复用**[多路复用代替了 HTTP1.x 的序列和阻塞机制，所有的相同域名请求都通过同一个 TCP 连接并发完成。在 HTTP1.x 中，并发多个请求需要多个 TCP 连接，浏览器为了控制资源会有 6-8 个 TCP 连接都限制,单个连接上可以并行交错的请求和响应，之间互不干扰,但是数量猛增，服务器要处理，多多少少也耗性能]的能力，而且现在还有使用的常见，比聊天表情，飞书也在用）
- 资源加载：CDN、强缓存和协商缓存、按需加载
- DOM 解析：自上而下，script 标签放在底部，css 放在上面，无论是 html 还是 css 的层级，应尽量少的解析，解析消耗性能
- 渲染时候：回流和重绘、懒加载、虚拟列表

## 两个事例

**飞书雪碧图**

- 为什么拿飞书桌端数据来说（之前开发桌面端 Electron，扒拉过飞书应用包的数据)

<img src="http://t-blog-images.aijs.top/img/20220606170307.webp" width=200 style="object-fit:content"/>

**京东移动端 dns-prefetch**

- 为什么拿京东数据来说（之前爬取过京东移动端数据开发 RN)

![](http://t-blog-images.aijs.top/img/20220606172316.webp)

```html
<head>
  <meta charset="utf-8" />
  <script type="text/javascript">
    window.alert = console.log;
  </script>
  <script>
    window._PFM_TIMING = [[1351, new Date()]]; //TODO
  </script>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
  />
  <title>多快好省，购物上京东！</title>
  <!-- 强缓存Cache-Control -->
  <meta http-equiv="Cache-Control" content="max-age=180" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <meta name="format-detection" content="telephone=no" />
  <!-- 京东 <meta name="format-detection" content="telephone=no" /> 写重复了 -->
  <link rel="dns-prefetch" href="//m.360buyimg.com" />
  <meta name="format-detection" content="telephone=no" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no, viewport-fit=cover"
  />
  <!-- X-DNS-Prefetch-Control 头控制着浏览器的 DNS 预读取功能  DNS 预读取是一项使浏览器主动去执行域名解析的功能-->
  <meta http-equiv="x-dns-prefetch-control" content="on" />

  <link rel="dns-prefetch" href="//img11.360buyimg.com" />
  <link rel="dns-prefetch" href="//img10.360buyimg.com" />
  <link rel="dns-prefetch" href="//img12.360buyimg.com" />
  <link rel="dns-prefetch" href="//img13.360buyimg.com" />
  <link rel="dns-prefetch" href="//img14.360buyimg.com" />
  <link rel="dns-prefetch" href="//img20.360buyimg.com" />
  <link rel="dns-prefetch" href="//img30.360buyimg.com" />
  <link rel="dns-prefetch" href="//wq.360buyimg.com" />
</head>
```

## performance 数据能干啥用？

（开发者）熟悉 Chrome 开发者工具的朋友应该知道：在开发环境下，其实我们自己打开 Chrome 的开发者工具，切换到网络面板，就能很详细的看到网页性能相关的数据。

（网站用户）但当我们需要统计分析用户打开我们网页时的性能如何时，我们将 performance 原始信息或通过简单计算后的信息 (如上面写到的 getPerformanceTiming()) 上传到服务器，配合其他信息（如 HTTP 请求头信息），就完美啦~

## 来看下简书

- 链接 <a href="https://www.jianshu.com/p/464593cea4dc" target="_blank" >简书</a> ,打开控制台可以看到输出结果一个数组（**如果简书没将此日志去除**）
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

## domContentLoaded 与 loaded

```js
// 从页面开始到 domContentLoadedEventEnd
let domContentloaded = t.domContentLoadedEventEnd - t.navigationStart;
// 从页面开始到 loadEventEnd
let loaded = t.loadEventEnd - t.navigationStart;
```

**domContentLoadedEventEnd 比 loaded 先触发**

![](http://t-blog-images.aijs.top/img/20220605133905.webp)

<hr/>

## 掘金页面

- 话说已经到了 6 月 6 号，闲逛掘金，遇到面试题：`从输入url到页面展示发生了什么`，突然想起个 performance,就拿掘金的一个页面来验证这幅图

  ![](http://t-blog-images.aijs.top/img/20220606151451.webp)

:::warning

注意：此代码放到 dayjs 网站的 Sources/Snippets 中执行，利用全局的 dayjs，无需引入 dayjs
:::

<a href="https://dayjs.fenxianglu.cn/category/display.html#%E6%A0%BC%E5%BC%8F%E5%8C%96" target="_blank" >dayjs 网站</a>

![](http://t-blog-images.aijs.top/img/20220606152413.webp)

- 代码是为了对 performance.timing 按照时间值进行排序，排序结果大致是执行的顺序，稍微有出入，会手动做调整
- 代码如下：

```js
var timing = {
  connectStart: 1654499041800,
  navigationStart: 1654499041744,
  loadEventEnd: 1654499043641,
  domLoading: 1654499042279,
  secureConnectionStart: 1654499041820,
  fetchStart: 1654499041746,
  domContentLoadedEventStart: 1654499042718,
  responseStart: 1654499042247,
  responseEnd: 1654499042304,
  domInteractive: 1654499042495,
  domainLookupEnd: 1654499041800,
  redirectStart: 0,
  requestStart: 1654499041849,
  unloadEventEnd: 1654499042267,
  unloadEventStart: 1654499042267,
  domComplete: 1654499043640,
  domainLookupStart: 1654499041750,
  loadEventStart: 1654499043641,
  domContentLoadedEventEnd: 1654499042718,
  redirectEnd: 0,
  connectEnd: 1654499041849,
};
// YYYY-MM-DD HH:一定一致，这个就不看了
var fmt = "mm:ss:SSS";
var arr = [];
var sort_obj = {};

function fmt_sort_key(obj) {
  for (let [key, value] of Object.entries(obj)) {
    arr.push({
      key,
      value,
    });
  }

  const sortArr = arr.sort((a, b) => a.value - b.value);

  const fmtSortArr = sortArr.map((item) => {
    if (!item.value) return item;
    return {
      ...item,
      value: dayjs(item.value).format(fmt),
    };
  });

  console.log(fmtSortArr);
}
fmt_sort_key(timing);
```

## 非无痕首次访问

```js
const timing = {
  connectStart: 1654391072118,
  navigationStart: 1654391071928,
  loadEventEnd: 1654391076402,
  domLoading: 1654391072670,
  secureConnectionStart: 1654391072118,
  fetchStart: 1654391071969,
  domContentLoadedEventStart: 1654391074189,
  responseStart: 1654391072621,
  responseEnd: 1654391072664,
  domInteractive: 1654391073865,
  domainLookupEnd: 1654391072118,
  redirectStart: 0,
  requestStart: 1654391072199,
  // 没有之前页面的卸载
  unloadEventEnd: 0,
  unloadEventStart: 0,

  domComplete: 1654391076400,
  domainLookupStart: 1654391072118,
  loadEventStart: 1654391076400,
  domContentLoadedEventEnd: 1654391074189,
  redirectEnd: 0,
  connectEnd: 1654391072199,
};

// 时间戳 1654391072118： connectStart、secureConnectionStart、domainLookupStart、domainLookupEnd ，这个值是相同的

// 把上述 timing 使用dayjs进行转化，看下每个key对应的time,对于0是没有进行的操作，我们跳过不处理（知道没进行）

var timingfmt = [
  // 以下按照时间排序
  { key: "navigationStart", value: "04:31:928" },

  // 时间为0是没有进行相应的操作，跳过不处理
  { key: "redirectStart", value: 0 },
  { key: "redirectEnd", value: 0 },

  { key: "fetchStart", value: "04:31:969" },
  { key: "connectStart", value: "04:32:118" },
  { key: "domainLookupEnd", value: "04:32:118" },
  { key: "domainLookupStart", value: "04:32:118" },
  { key: "secureConnectionStart", value: "04:32:118" },
  { key: "requestStart", value: "04:32:199" },
  { key: "connectEnd", value: "04:32:199" },

  { key: "responseStart", value: "04:32:621" },
  { key: "unloadEventStart", value: 0 },
  { key: "unloadEventEnd", value: 0 },
  { key: "responseEnd", value: "04:32:664" },

  { key: "domLoading", value: "04:32:670" },
  { key: "domInteractive", value: "04:33:865" },
  { key: "domContentLoadedEventStart", value: "04:34:189" },
  { key: "domContentLoadedEventEnd", value: "04:34:189" },
  { key: "domComplete", value: "04:36:400" },
  { key: "loadEventStart", value: "04:36:400" },
  { key: "loadEventEnd", value: "04:36:402" },
];
```

**我们看下结果 2022-06-05 09:04，年月日时分都是一致的，我们只关心三位的毫秒数**

## 非无痕第二次访问

```js
const timing2 = {
  connectStart: 1654494048918,
  navigationStart: 1654494048902,
  loadEventEnd: 1654494054146,
  domLoading: 1654494049851,
  secureConnectionStart: 0, // 走缓存
  fetchStart: 1654494048918,
  domContentLoadedEventStart: 1654494051380,
  responseStart: 1654494049430,
  responseEnd: 1654494049514,
  domInteractive: 1654494051115,
  domainLookupEnd: 1654494048918,
  redirectStart: 0,
  requestStart: 1654494048942,
  // 有之前页面卸载
  unloadEventEnd: 1654494049537,
  unloadEventStart: 1654494049536,

  domComplete: 1654494054143,
  domainLookupStart: 1654494048918,
  loadEventStart: 1654494054143,
  domContentLoadedEventEnd: 1654494051381,
  redirectEnd: 0,
  connectEnd: 1654494048918,
};

var timingfmt2 = [
  // 时间为0是没有进行相应的操作，跳过不处理
  // 以下按照时间排序
  { key: "navigationStart", value: "40:48:902" },

  { key: "redirectStart", value: 0 },
  { key: "redirectEnd", value: 0 },

  { key: "fetchStart", value: "40:48:918" },

  { key: "connectStart", value: "40:48:918" },
  { key: "domainLookupEnd", value: "40:48:918" },
  { key: "domainLookupStart", value: "40:48:918" },
  { key: "secureConnectionStart", value: 0 },
  { key: "connectEnd", value: "40:48:918" },
  { key: "requestStart", value: "40:48:942" },
  { key: "responseStart", value: "40:49:430" },
  { key: "responseEnd", value: "40:49:514" },
  { key: "unloadEventStart", value: "40:49:536" },
  { key: "unloadEventEnd", value: "40:49:537" },
  { key: "domLoading", value: "40:49:851" },

  { key: "domInteractive", value: "40:51:115" },
  { key: "domContentLoadedEventStart", value: "40:51:380" },
  { key: "domContentLoadedEventEnd", value: "40:51:381" },
  { key: "domComplete", value: "40:54:143" },
  { key: "loadEventStart", value: "40:54:143" },
  { key: "loadEventEnd", value: "40:54:146" },
];
```

## 非无痕 f5 手动刷新

```js
var timing3 = {
  connectStart: 1654495600379,
  navigationStart: 1654495600360,
  loadEventEnd: 1654495604101,
  domLoading: 1654495601005,
  secureConnectionStart: 1654495600389,
  fetchStart: 1654495600364,
  domContentLoadedEventStart: 1654495601947,
  responseStart: 1654495600935,
  responseEnd: 1654495600989,
  domInteractive: 1654495601794,
  domainLookupEnd: 1654495600379,
  redirectStart: 0,
  requestStart: 1654495600404,
  unloadEventEnd: 1654495600971,
  unloadEventStart: 1654495600970,
  domComplete: 1654495604099,
  domainLookupStart: 1654495600379,
  loadEventStart: 1654495604099,
  domContentLoadedEventEnd: 1654495601947,
  redirectEnd: 0,
  connectEnd: 1654495600403,
};

var timingfmt3 = [
  // 以下按照时间排序
  { key: "navigationStart", value: "06:40:360" },

  // 时间为0是没有进行相应的操作，跳过不处理
  { key: "redirectStart", value: 0 },
  { key: "redirectEnd", value: 0 },

  { key: "fetchStart", value: "06:40:364" },

  { key: "connectStart", value: "06:40:379" },
  { key: "domainLookupEnd", value: "06:40:379" },
  { key: "domainLookupStart", value: "06:40:379" },

  { key: "secureConnectionStart", value: "06:40:389" },

  { key: "connectEnd", value: "06:40:403" },
  { key: "requestStart", value: "06:40:404" },

  { key: "responseStart", value: "06:40:935" },
  { key: "unloadEventStart", value: "06:40:970" },
  { key: "unloadEventEnd", value: "06:40:971" },
  { key: "responseEnd", value: "06:40:989" },

  { key: "domLoading", value: "06:41:005" },
  { key: "domInteractive", value: "06:41:794" },

  { key: "domContentLoadedEventStart", value: "06:41:947" },
  { key: "domContentLoadedEventEnd", value: "06:41:947" },
  { key: "domComplete", value: "06:44:099" },
  { key: "loadEventStart", value: "06:44:099" },
  { key: "loadEventEnd", value: "06:44:101" },
];
```

## 无痕模式首次

```js
var timing4 = {
  connectStart: 1654496795083,
  navigationStart: 1654496795041,
  loadEventEnd: 1654496799718,
  domLoading: 1654496795428,
  secureConnectionStart: 1654496795093,
  fetchStart: 1654496795050,
  domContentLoadedEventStart: 1654496796111,
  responseStart: 1654496795420,
  responseEnd: 1654496795469,
  domInteractive: 1654496795680,
  domainLookupEnd: 1654496795083,
  redirectStart: 0,
  requestStart: 1654496795123,
  unloadEventEnd: 0,
  unloadEventStart: 0,
  domComplete: 1654496799718,
  domainLookupStart: 1654496795057,
  loadEventStart: 1654496799718,
  domContentLoadedEventEnd: 1654496796111,
  redirectEnd: 0,
  connectEnd: 1654496795123,
};

var timing4fmt = [
  // 时间为0是没有进行相应的操作，跳过不处理
  // 以下按照时间排序
  { key: "navigationStart", value: "26:35:041" },

  { key: "redirectStart", value: 0 },
  { key: "redirectEnd", value: 0 },

  { key: "fetchStart", value: "26:35:050" },

  { key: "domainLookupStart", value: "26:35:057" },

  { key: "connectStart", value: "26:35:083" },
  { key: "domainLookupEnd", value: "26:35:083" },
  { key: "secureConnectionStart", value: "26:35:093" },
  { key: "requestStart", value: "26:35:123" },
  { key: "connectEnd", value: "26:35:123" },

  { key: "responseStart", value: "26:35:420" },

  { key: "unloadEventEnd", value: 0 },
  { key: "unloadEventStart", value: 0 },

  { key: "domLoading", value: "26:35:428" },
  { key: "responseEnd", value: "26:35:469" },

  { key: "domInteractive", value: "26:35:680" },

  { key: "domContentLoadedEventStart", value: "26:36:111" },
  { key: "domContentLoadedEventEnd", value: "26:36:111" },

  { key: "loadEventEnd", value: "26:39:718" },
  { key: "domComplete", value: "26:39:718" },
  { key: "loadEventStart", value: "26:39:718" },
];
```

## 无痕模式刷新

```js
var timing5 = {
  connectStart: 1654496848681,
  navigationStart: 1654496848679,
  loadEventEnd: 1654496850263,
  domLoading: 1654496848983,
  secureConnectionStart: 0,
  fetchStart: 1654496848681,
  domContentLoadedEventStart: 1654496849277,
  responseStart: 1654496848959,
  responseEnd: 1654496849017,
  domInteractive: 1654496849096,
  domainLookupEnd: 1654496848681,
  redirectStart: 0,
  requestStart: 1654496848702,
  unloadEventEnd: 1654496848979,
  unloadEventStart: 1654496848979,
  domComplete: 1654496850262,
  domainLookupStart: 1654496848681,
  loadEventStart: 1654496850262,
  domContentLoadedEventEnd: 1654496849277,
  redirectEnd: 0,
  connectEnd: 1654496848681,
};

var timing5fmt = [
  // 以下按照时间排序
  { key: "navigationStart", value: "27:28:679" },
  // 时间为0是没有进行相应的操作，跳过不处理
  { key: "redirectStart", value: 0 },
  { key: "redirectEnd", value: 0 },

  { key: "fetchStart", value: "27:28:681" },
  { key: "domainLookupEnd", value: "27:28:681" },
  { key: "domainLookupStart", value: "27:28:681" },
  { key: "connectStart", value: "27:28:681" },
  { key: "connectEnd", value: "27:28:681" },

  // 时间为0是没有进行相应的操作，跳过不处理
  { key: "secureConnectionStart", value: 0 },

  { key: "requestStart", value: "27:28:702" },
  { key: "responseStart", value: "27:28:959" },

  { key: "unloadEventEnd", value: "27:28:979" },
  { key: "unloadEventStart", value: "27:28:979" },

  { key: "domLoading", value: "27:28:983" },
  { key: "responseEnd", value: "27:29:017" },

  { key: "domInteractive", value: "27:29:096" },

  { key: "domContentLoadedEventStart", value: "27:29:277" },
  { key: "domContentLoadedEventEnd", value: "27:29:277" },

  { key: "domComplete", value: "27:30:262" },

  { key: "loadEventStart", value: "27:30:262" },
  { key: "loadEventEnd", value: "27:30:263" },
];
```

## 无痕模式刷新 + disable-cache

```js
var timing6 = {
  connectStart: 1654496917781,
  navigationStart: 1654496917780,
  loadEventEnd: 1654496921224,
  domLoading: 1654496918186,
  secureConnectionStart: 0,
  fetchStart: 1654496917781,
  domContentLoadedEventStart: 1654496918836,
  responseStart: 1654496918156,
  responseEnd: 1654496918293,
  domInteractive: 1654496918654,
  domainLookupEnd: 1654496917781,
  redirectStart: 0,
  requestStart: 1654496917784,
  unloadEventEnd: 1654496918182,
  unloadEventStart: 1654496918182,
  domComplete: 1654496921224,
  domainLookupStart: 1654496917781,
  loadEventStart: 1654496921224,
  domContentLoadedEventEnd: 1654496918836,
  redirectEnd: 0,
  connectEnd: 1654496917781,
};
var timing6fmt = [
  // 以下按照时间排序
  { key: "navigationStart", value: "28:37:780" },

  // 时间为0是没有进行相应的操作，跳过不处理
  { key: "redirectStart", value: 0 },
  { key: "redirectEnd", value: 0 },

  { key: "fetchStart", value: "28:37:781" },

  { key: "domainLookupEnd", value: "28:37:781" },
  { key: "domainLookupStart", value: "28:37:781" },
  { key: "connectStart", value: "28:37:781" },
  { key: "connectEnd", value: "28:37:781" },

  { key: "secureConnectionStart", value: 0 },

  { key: "requestStart", value: "28:37:784" },
  { key: "responseStart", value: "28:38:156" },
  // 和 timing5fmt比较，之前页面的卸载，非常快
  { key: "unloadEventStart", value: "28:38:182" },
  { key: "unloadEventEnd", value: "28:38:182" },
  // 注意 domLoading 和 responseEnd,这两个，顺序不定
  { key: "domLoading", value: "28:38:186" },
  { key: "responseEnd", value: "28:38:293" },

  { key: "domInteractive", value: "28:38:654" },

  { key: "domContentLoadedEventStart", value: "28:38:836" },
  { key: "domContentLoadedEventEnd", value: "28:38:836" },

  { key: "loadEventEnd", value: "28:41:224" },
  { key: "domComplete", value: "28:41:224" },
  { key: "loadEventStart", value: "28:41:224" },
];
```

这个操作竟然有一个 base64 编码图片依然被缓存了,浏览器 disable-cache 对于有些内存缓存的图片竟然是无效的.

```shell
Request URL: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8AQMAAAAAMksxAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAA5JREFUKM9jGAWjAAcAAAIcAAE27nY6AAAAAElFTkSuQmCC
Request Method: GET
Status Code: 200 OK (from memory cache)
Referrer Policy: strict-origin-when-cross-origin
```

![](http://t-blog-images.aijs.top/img/20220606143138.webp)

## DNS 缓存

在实际的解析过程中，并不是客户端的每一次访问都需要委托递归服务器进行迭代查询，

1. 而是先搜索浏览器自身的 DNS 缓存，如果有，解析到此为止；
2. 如果 DNS 缓存中没有结果就会读取操作系统中的 HOSTS 文件查找对应的映射关系，如果有到此完成；
3. 如果没有，再请求递归服务器，进行全球递归查询。从中我们可以看出 DNS 缓存是获取域名解析记录的第一步骤。

## 参考资料

<a href="https://blog.csdn.net/z9061/article/details/101454438" target="_blank" >Web 性能优化-首屏和白屏时间</a>

<a href="http://www.alloyteam.com/2015/09/explore-performance/" target="_blank" >初探 performance – 监控网页与程序性能</a>

<a href="https://blog.csdn.net/abuanden/article/details/114530985" target="_blank" >简述浏览器渲染机制</a>

<a href="https://baijiahao.baidu.com/s?id=1722369549920506968&wfr=spider&for=pc" target="_blank" >浅谈 DNS 缓存的作用和影响</a>
