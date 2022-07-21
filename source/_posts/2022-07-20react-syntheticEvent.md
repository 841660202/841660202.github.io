---
title: React syntheticEvent
date: 2022-07-20 09:18:53
categories: React
tags: [React]
cover:
---

## 本文说明

本文主要内容是 <a href="https://github.com/facebook/react/tree/v16.5.0" target="_blank" >React v16.5.0</a>, 部分内容会涉及到 React v17+

## React 和事件系统概述

<a href="https://github.com/facebook/react/blob/71c0e05ba79e2e12556980ffbab264b41fdc19cd/packages/react-dom/src/events/ReactBrowserEventEmitter.js#L52" target="_blank" >见</a>

```js
/**
 *
 * +------------+    .
 * |    DOM     |    .
 * +------------+    .
 *       |           .
 *       v           .
 * +------------+    .
 * | ReactEvent |    .
 * |  Listener  |    .
 * +------------+    .                         +-----------+
 *       |           .               +--------+|SimpleEvent|
 *       |           .               |         |Plugin     |
 * +-----|------+    .               v         +-----------+
 * |     |      |    .    +--------------+                    +------------+
 * |     +-----------.--->|EventPluginHub|                    |    Event   |
 * |            |    .    |              |     +-----------+  | Propagators|
 * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
 * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
 * |            |    .    |              |     +-----------+  |  utilities |
 * |     +-----------.--->|              |                    +------------+
 * |     |      |    .    +--------------+
 * +-----|------+    .                ^        +-----------+
 *       |           .                |        |Enter/Leave|
 *       +           .                +-------+|Plugin     |
 * +-------------+   .                         +-----------+
 * | application |   .
 * |-------------|   .
 * |             |   .
 * |             |   .
 * +-------------+   .
 *                   .
 *    React Core     .  General Purpose Event Plugin System
 */
```

## 为什么 React 需要自己实现一套事件系统？

<img src="http://t-blog-images.aijs.top/img/20220720095157.webp" style="max-width: 600px" />

这个问题主要是为了`性能`和`复用`两个方面来考虑。

### 首先对于`性能`来说

React 作为一套 View 层面的框架，通过渲染得到 vDOM，再由 diff 算法决定 DOM 树那些结点需要新增、替换或修改，假如直接在 DOM 结点插入原生事件监听，则会导致频繁的调用 addEventListener 和 removeEventListener，造成性能的浪费。所以 React 采用了事件代理的方法，对于大部分事件 1 而言都在 document 上做监听，然后`根据Event中的target来判断事件触发的结点`。

其次 React 合成的 SyntheticEvent 采用了`池的思想`，从而达到节约内存，避免频繁的创建和销毁事件对象的目的。这也是`“如果我们需要异步使用一个 syntheticEvent，需要执行 event.persist()才能防止事件对象被释放”`的原因。

最后在 React 源码中随处可见 `batch 做批量更新`，基本上凡是可以批量处理的事情（最普遍的 setState）React 都会将中间过程保存起来，留到最后面 flush（渲染，并最终提交到 DOM 树上）掉。就如`浏览器对 DOM 树进行 Style，Layout，Paint 一样，都不会在操作 ele.style.color='red';之后马上执行，只会将这些操作打包起来并最终在需要渲染的时候再做渲染,`。<a href="https://v.aijs.top/post/2022-07-17css" target="_blank" >队列机制来批量更新布局 (1000ms/60 = 16.6ms 进行一次渲染)</a>

```js
ele.style.color = "red";
ele.style.color = "blue";
ele.style.color = "red";
// 浏览器只会渲染一次;
```

### 而对于复用来说

React 看到在不同的浏览器和平台上，用户界面上的事件其实非常相似，例如普通的 click，change 等等。React 希望通过封装一层事件系统，将不同平台的原生事件都封装成 `SyntheticEvent`。

- 使得`不同平台只需要通过加入EventEmitter以及对应的Renderer就能使用相同的一个事件系统`，WEB 平台上加入 `ReactBrowserEventEmitter`，Native 上加入 `ReactNativeEventEmitter`。如下图，对于不同平台，React 只需要替换掉左边部分，而右边 EventPluginHub 部分可以保持复用。

- 而`对于不同的浏览器而言，React帮我们统一了事件，做了浏览器的兼容`，例如对于 transitionEnd,webkitTransitionEnd,MozTransitionEnd 和 oTransitionEnd, React 都会集合成 topAnimationEnd，所以我们只用处理这一个标准的事件即可。

<img src="http://t-blog-images.aijs.top/img/20220720100225.webp" />

## React 的事件系统是怎么运作起来的？

### 事件绑定

我们来看一下我们在 JSX 中写的 onClickhandler 是怎么被记录到 DOM 结点上，并且在 document 上做监听的。

<img src="http://t-blog-images.aijs.top/img/20220720100423.webp" />

React 对于大部分事件的绑定都是使用`trapBubbledEvent`和`trapCapturedEvent`这两个函数来注册的。如上图所示，当我们执行了 render 或者 setState 之后，React 的 `Fiber` 调度系统，<span style="text-decoration: underline">会在最后 commit 到 DOM 树之前, 执行`trapBubbledEvent`或`trapCapturedEvent`，在`document`节点上绑定回调</span>（通过执行`addEventListener`在 document 结点上绑定对应的`dispatch`函数,作为回调负责监听类型为`topLevelType`的事件）。

这里面的 `dispatchInteractiveEvent` 和 `dispatchEvent` 两个回调函数的区别为，React16 开始换掉了原本 `Stack Reconciliation` 成 `Fiber` 希望实现异步渲染（React16 仍未默认打开，仍需使用 `unstable_`开头的 api，此特性与例子 2 有关，将在文章最后配图解释），所以异步渲染的情况下假如我点了两次按钮，那么第二次按钮响应的时候，可能第一次按钮的 handlerA 中调用的 `setState` 还未最终被 commit 到 DOM 树上，这时需要把第一次按钮的结果先给 flush 掉并 commit 到 DOM 树，才能够保持一致性。这个时候就会用到 `dispatchInteractiveEvent`。可以理解成 `dispatchInteractiveEvent` 在执行前都会确保之前所有操作都已最总 commit 到 DOM 树，再开始自己的流程，并最终触发 dispatchEvent。但由于 React16 仍是同步渲染的，所以这两个函数在目前的表现是一致的，React17 默认打开的异步渲染功能。

到现在我们已经在 document 结点上监听了事件了，现在需要来看如何将我们在 jsx 中写的 handler 存起来对应到相应的结点上。

在我们每次新建或者更新结点时，React 会调用 `createInstance` 或者 `commitUpdate` 这两个函数，而这两个函数都会最终调用 `updateFiberProps` 这个函数，将 props 也就是我们的 onClick，onChange 等 handler 给存到 DOM 结点上。

至此，我们我们已经在 document 上监听了事件，并且将 handler 存在对应 DOM 结点。接下来需要看 React 怎么监听并处理浏览器的原生事件，最终触发对应的 handler 了。

### 事件触发

动画见原文 <a href="https://www.lzane.com/tech/react-event-system-and-source-code/#%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91" target="_blank" >Hype 动画</a>

动画应该是使用 <a href="https://www.hypeapp.cn/" target="_blank" >Hype 工具</a> 制作的

以简单的 `click` 事件为例，通过事件绑定我们已经在 `document` 上监听了 `click` 事件，当我们真正点击了这个按钮的时候，原生的事件是如何进入 React 的管辖范围的？如何合成 `SyntheticEvent` 以及如何模拟捕获和冒泡的？以及最后我们在 jsx 中写的 `onClickhandler` 是如何被最终触发的？带着这些问题，我们一起来看一下事件触发阶段。

大概用下图这种方式来解析代码，左边是我点击一个绑定了 `handleClick` 的按钮后的 js 调用栈，右边是每一步的代码，均已删除部分不影响理解的代码。希望通过这种方式能使大家更易理解 React 的事件触发机制。

<img src="http://t-blog-images.aijs.top/img/20220720101536.webp" />

当我们点击一个按钮是，click 事件将会最终冒泡至 document，并触发我们监听在 document 上的 `handler dispatchEvent`，接着触发 `batchedUpdates`。`batchedUpdates` 这个格式的代码在 React 的源码里面会频繁的出现，基本上 React 将所有能够批量处理的事情都会先收集起来，再一次性处理。

可以看到默认的 `isBatching` 是 false 的，当调用了一次 `batchedUpdates`，`isBatching` 的值将会变成 true，此时如果在接下来的调用中有执行 `batchedUpdates` 的话，就会直接执行 `handleTopLevel`,此时的 `setState` 等不会被更新到 DOM 上。直到调用栈重新回到第一次调用 `batchedUpdates` 的时候，才会将所有结果一起 `flush` 掉（更新到 DOM 上）。

<img src="http://t-blog-images.aijs.top/img/20220720101657.webp" />

**调用栈中的 BatchedUpdates$1 是什么？或者浏览器的 renderer 和 Native 的 renderer 是如果挂在到 React 的事件系统上的?**

其实 React 事件系统里面提供了一个函数 `setBatchingImplementation`，用来动态挂载不同平台的 renderer，这个也体现了 React 事件系统的复用。（如图右边所示，在 `DOM Renderer` 里面和 `Native Renderer` 里面分别调用这个函数动态注入相应的实现）

这里的 `interactiveUpdates 交互式更新是用户交互的结果` 和 `batchedUpdates` 的区别在上文已经解释过，这里就不再赘述。

<img src="http://t-blog-images.aijs.top/img/20220720102322.webp" />

`handleTopLevel` 会调用 `runExtractedEventsInBatch()`，这是 React 事件处理最重要的函数。如上面动画我们看到的，在 EventEmitter 里面做的事，其实主要就是这个函数的两步。

- 第一步是根据原生事件合成为合成事件，并且在 vDOM 上模拟捕获冒泡，收集所有需要执行的事件回调构成回调数组。
- 第二步是遍历回调数组，触发回调函数。

<img src="http://t-blog-images.aijs.top/img/20220720102726.webp" />

首先调用 `extractEvents`，传入原生事件 e，React 事件系统根据可能的事件插件合成合成事件 `Synthetic e`。 这里我们可以看到调用了 `EventConstructor.getPooled()`，从事件池中去取一个合成事件对象，如果事件池为空，则新创建一个合成事件对象，这体现了 React 为了性能实现了池的思想。

<img src="http://t-blog-images.aijs.top/img/20220720102846.webp" />

然后传入 `Propagator`，在 vDOM 上模拟捕获和冒泡，并收集所有需要执行的事件回调和对应的结点。`traverseTwoPhase` 模拟了捕获和冒泡的两个阶段，这里实现很巧妙，简单而言就是`正向和反向遍历了一下数组`。接着对每一个结点，调用 listenerAtPhase 取出事件绑定时挂载在结点上的回调函数，把它加入回调数组中。

<img src="http://t-blog-images.aijs.top/img/20220720103038.webp" />

接着`executeDispatchesAndRelease`遍历所有合成事件。这里可以看到当一个事件处理完的时候，React 会调用 `event.isPersistent()`来查看这个合成事件是否需要被持久化，如果不需要就会释放这个合成事件，这也就是为什么当我们需要异步读取操作一个合成事件的时候，需要执行 `event.persist()`，不然 React 就是在这里释放掉这个事件。

<img src="http://t-blog-images.aijs.top/img/20220720103344.webp" />

最后`executeDispatchesInOrder`这里就是回调函数被真正触发的时候了，取出回调数组 `event._dispatchListeners`，遍历触发回调函数。并通过 `event.isPropagationStopped()`这一步来模拟停止冒泡。这里我们可以看到，React 在收集回调数组的时候并不会去管我们是否调用了 `stopPropagation`，而是会在触发的阶段才会去检查是否需要停止冒泡。

至此，一个事件回调函数就被触发了，里面如果执行了 setState 等就会等到调用栈弹回到最低部的 interactiveUpdate 中的被最终 flush 掉，构造 vDOM，和好，并最终被 commit 到 DOM 上。

这就是事件触发的整个过程了，可以回去再看一下 <a href="https://www.lzane.com/tech/react-event-system-and-source-code/#%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91" target="_blank" >动画</a>，相信你会更加理解这个过程的。

## 合成事件与原生事件有怎样的执行顺序？

**原生事件**

<img src="http://t-blog-images.aijs.top/img/20220720105851.webp" style="max-width: 600px" />

**原生+合成事件**

- 在 V17 版本前，`原生事件的执行时机是恒早于合成事件的执行时机的`。

- V17 版本后，`合成事件和原生事件的执行顺序与冒泡/捕获模式相关`，
  - `捕获模式，合成事件早于原生事件`，
  - `冒泡模式，原生事件早于合成事件`。

<img src="http://t-blog-images.aijs.top/img/20220720105608.webp" style="max-width: 600px"/>
<a href="https://www.jianshu.com/p/a68219093f88?u_atoken=96c66af6-4b4a-4701-a859-9a64483aaf89&u_asession=01viVXNjWZraXNpt12w6P6wnowBQUY7pona1ulf4v0L73wrchou90FiDGe5jR2qHfDX0KNBwm7Lovlpxjd_P_q4JsKWYrT3W_NKPr8w6oU7K8qavJ7EhmnVdJXQEmE6OtSPpcarp92QKzyJKyYjREPlmBkFo3NEHBv0PZUm6pbxQU&u_asig=05CjAbRIhQ-YGOcSOjfs7WtQu4QiGw5txoYvhryOA5fFYlLiTzNiJXY_hpLV7WJGud4m5iROx4wQ0h3ZgRAXTxp-H_GUJK2jgttmFqvD-hHIPJWVv2NwOqKBXAP-u08vsfCUr3lwfKUBWx5D2_14AeRY0il1Ll8VBsxPq6mesMKSv9JS7q8ZD7Xtz2Ly-b0kmuyAKRFSVJkkdwVUnyHAIJzbzCM-4012j1JNGnXBVIbaIllXASt-Dgl7eSMGAtA78aWPRPQyB_SKrj-61LB_f61u3h9VXwMyh6PgyDIVSG1W8MY0PcDXuTpF4MGYSjFBSfODK7bhW2M-c7MIitG1svzaDy9TZTqvO1bRJoi-cZx4Wss1heq_Xsfq5Pn8i8a2-MmWspDxyAEEo4kbsryBKb9Q&u_aref=0RPjny1vlRI4nr3ZC63TqSOZUa0%3D#:~:text=%E5%9B%9B%E3%80%81-,React%E5%90%88%E6%88%90%E4%BA%8B%E4%BB%B6%E4%B8%8E%E5%8E%9F%E7%94%9F%E4%BA%8B%E4%BB%B6%E6%89%A7%E8%A1%8C%E9%A1%BA%E5%BA%8F,-%E5%9C%A8%20React%20%E4%B8%AD" target="_blank" >React 合成事件与原生事件执行顺序</a>

<a href="https://juejin.cn/post/7005129812981317668#:~:text=%E9%87%8C%E9%9D%A2%E7%9A%84%E6%96%B9%E6%B3%95%E3%80%82-,%E5%90%88%E6%88%90%E4%BA%8B%E4%BB%B6%E5%92%8C%E5%8E%9F%E7%94%9F%E4%BA%8B%E4%BB%B6%E7%9A%84%E6%89%A7%E8%A1%8C%E9%A1%BA%E5%BA%8F,-%E8%BF%99%E9%87%8C%E6%9C%89%E4%B8%AA" target="_blank" >合成事件和原生事件的执行顺序</a>

## 例子 1

```js
class App extends React.Component {
  innerClick = (e) => {
    console.log("A: react inner click.");
    // e.stopPropagation();
  };

  outerClick = () => {
    console.log("B: react outer click.");
  };

  componentDidMount() {
    document
      .getElementById("outer")
      .addEventListener("click", () => console.log("C: native outer click"));

    window.addEventListener("click", () =>
      console.log("D: native window click")
    );
  }

  render() {
    return (
      <div id="outer" onClick={this.outerClick}>
        <button id="inner" onClick={this.innerClick}>
          BUTTON
        </button>
      </div>
    );
  }
}
```

相信看完这篇文章，如果你已经对 React 事件系统有所理解，这道题应该是不难了。

- 因为 React 事件监听是挂载在 document 上的，所以原生系统在#outer 上监听的回调 C 会最先被输出；接着原生事件冒泡至 `document` 进入 React 事件系统，React 事件系统模拟捕获冒泡输出 A 和 B；最后 React 事件系统执行完毕回到浏览器继续冒泡到 window，输出 D。

- 浏览器在#outer 上监听原生事件的回调 C 会最先被执行；接着原生事件冒泡至 document 进入 React 事件系统，输出 A，在 React 事件处理中#inner 调用了 stopPropagation，事件被停止冒泡。

```js
// 1. 不阻止合成事件冒泡
//     C: native outer click
//     A: react inner click.
//     B: react outer click.
//     D: native window click
// 2. 阻止合成事件冒泡
//     C: native outer click
//     A: react inner click.
```

:::tip
所以，最好不要混用 React 事件系统和原生事件系统，如果混用了，请保证你清楚知道会发生什么。
:::

## 例子 2

```js
import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
    };
  }
  handleClick = () => {
    console.log("edit button click!!");
    this.setState({ editable: true });
  };
  handleSubmit = (e) => {
    console.log("submit event!!");
    e.preventDefault();
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.state.editable ? (
          <button type="submit">submit</button>
        ) : (
          <button type="button" onClick={this.handleClick}>
            edit
          </button>
        )}
      </form>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

首先我们点击 edit 按钮浏览器触发一个 click 事件，冒泡至 document 进入 React 事件系统，React 执行回调调用 setState，此时 React 事件系统对事件的处理执行完毕。由于目前 React 是同步渲染的，所以接着 React 执行 `performSyncWork` 将该 `button 改成 type="submit"`，由于`同个位置的结点并且 tag 都为 button`，`所以 React 复用了这个 button 结点 2`，并更新到 DOM 上。此时浏览器对 click 事件执行继续，其发现该结点的 type="submit"，则触发 submit 事件。

**解决的办法就有很多种了**，给 button 加上 key；两个按钮分开写，不要用三元等都可以解决问题。

## e.stopPropagation() 如何阻止合成事件冒泡？

`executeDispatchesInOrder`这里就是回调函数被真正触发的时候了，取出回调数组 `event._dispatchListeners`，遍历触发回调函数。并通过 `event.isPropagationStopped()`这一步来模拟停止冒泡。这里我们可以看到，React 在收集回调数组的时候并不会去管我们是否调用了 `stopPropagation`，而是会在触发的阶段才会去检查是否需要停止冒泡。

## 同级别的两个按钮，使用三元运算符，会出问题？

渲染后按钮的事件是否会触发

**React16 例子 2 一定触发 `submit`, 原因：同步更新**

<img src="http://t-blog-images.aijs.top/img/20220720104906.webp" style="max-width: 600px"/>

**React17+ 例子 2 不一定触发 `submit` 原因：异步更新**

<img src="http://t-blog-images.aijs.top/img/20220720104951.webp" style="max-width: 600px"/>

## React 提示 event.persist() ，为什么会提示？

React 在`executeDispatchesAndRelease`遍历所有合成事件，会调用 `event.isPersistent()`来查看这个合成事件是否需要被持久化，如果不需要就会释放这个合成事件，这也就是为什么当我们需要异步读取操作一个合成事件的时候，需要执行 `event.persist()`，不然 React 就是在这里释放掉这个事件。

## setState 有时候是异步的，setState 相对于浏览器而言是同步的，如何理解？

`setState` 在生命周期以及事件回调中是异步的，也就是会收集起来批量处理。在其它情况下如 `promise`，`setTimeout` 中都是同步执行的，也就是调用一次 setState 就会 render 一次并更新到 DOM 上面

且在 JS 调用栈被弹空时候，必定是已经将结果更新到 DOM 上面了（同步渲染）。这也就是 setState 相对于浏览器是同步的含义。如下图所示

<img src="http://t-blog-images.aijs.top/img/20220720104906.webp" style="max-width: 600px"/>

异步渲染的流程图大概如下图所示，最近一次思考这个问题的时候，发现如果现在是异步渲染的话，那我们的例子二将变成偶现的坑 😂，因为如果 setState 的结果还没被更新到 DOM 上，浏览器就不会触发 submit 事件。

<img src="http://t-blog-images.aijs.top/img/20220720104951.webp" style="max-width: 600px"/>

## 异步渲染使用不安全的生命周期会有怎样的现象？

例子 2 变成偶现

## 之前将事件监听挂载到 document 上，现在为何挂载到 root 上？

当同个项目里，`有多个 React 根节点时`（也可能是 React 多版本共存），避免可能的一些操作（如阻止冒泡）会影响到其他 React 节点的正常工作。

<img src="http://t-blog-images.aijs.top/img/20220720110733.webp" style="max-width: 700px"  />

<a href="https://github.com/facebook/react/releases/tag/v17.0.0" target="_blank" >Delegate events to roots instead of document</a>

<a href="https://www.bigbinary.com/blog/react-17-delegates-events-to-root-instead-of-document" target="_blank" >React 17 delegates events to root instead of document</a>

为了演示其中一个问题，让我们以 select 下拉列表为例。

```html
<!--Div's change event contains stopPropagation()-->
<div id="main">
  <!--Div where react component will be rendered -->
  <div id="react-root"></div>
</div>
```

```js

class CountryDropDown extends React.Component {
  state = {
    country: '',
  }
  const handleChange = e => {
    this.setState({ country: e.target.value });
  }
  render() {
    return (
      <table class="table table-striped table-condensed">
        <thead>
          <tr>
            <th>Country</th>
            <th>Selected country</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <select value={this.state.country}
                onChange={this.handleChange}
              >
                <option value="">--Select--</option>
                <option value="India">India</option>
                <option value="US">US</option>
                <option value="Dubai">Dubai</option>
              </select>
            </td>
            <td>
              {this.state.country}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
ReactDOM.render(<CountryDropDown />, document.getElementById('react-root'));


```

给`main-div`增加一个阻止冒泡的事件

```js
document.getElementById("main").addEventListener(
  "change",
  function (e) {
    e.stopPropagation();
  },
  false
);
```

附加到文档节点的 onChange 下拉事件出现意外行为，原因是：包含 e.stopPropagation（）的主 div 的 change 事件阻止了下拉的 onChange 事件。

## 合成事件的冒泡捕获机制如何实现？

`traverseTwoPhase` 模拟了捕获和冒泡的两个阶段，这里实现很巧妙，简单而言就是`正向和反向遍历了一下数组`

## 合成事件源码函数调用关系图

<img src="http://t-blog-images.aijs.top/img/SyntheticEvent-第 2 页.drawio.webp" />

## 参考链接

<a href="https://www.lzane.com/tech/react-event-system-and-source-code/" target="_blank" >动画浅析 REACT 事件系统和源码</a>

<a href="https://zhuanlan.zhihu.com/p/56531645" target="_blank" >小前端读源码 - React16.7.0(合成事件)</a>

<a href="https://blog.csdn.net/weixin_34352005/article/details/85995026" target="_blank" >React16 的 interactiveUpdates</a>

<a src="https://blog.51cto.com/u_15127691/4626192" >React 17 All In One </a>

<a href="https://segmentfault.com/a/1190000039108951" target="_blank" >深入 React 合成事件机制原理</a>

<a href="https://juejin.cn/post/7005129812981317668" target="_blank" >React 合成事件详解</a>

<a href="https://www.bigbinary.com/blog/react-17-delegates-events-to-root-instead-of-document" target="_blank" >React 17 delegates events to root instead of document</a>
