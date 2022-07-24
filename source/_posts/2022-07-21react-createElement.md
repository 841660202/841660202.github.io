---
title: React@16.5.0 createElement
date: 2022-07-21 11:18:50
categories: React@16.5.0
tags: [React@16.5.0]
cover:
---

## 项目开发时候书写代码

**某个页面或者是组件**

```js
//  class ReactComponent extends React.Component {
//      render() {
//          return <p className="class">Hello React</p>;
//      }
//  }
//  以上代码会编译为：
class ReactComponent extends React.Component {
  render() {
    React.createElement("p", { className: "class" }, "Hello React"); // 之前看到蜜壳代码是这个样子，我还以为是研发手写的呢
  }
}

//  <ReactComponent someProp="prop" />
React.createElement(ReactComponent, { someProp: "prop" }, null);
```

以上代码 api 在`packages/react/src/React.js`

```js
const React = {
  createElement: createElement, // packages/react/src/ReactElement.js  createElement -> ReactElement
  version: ReactVersion,
};
export default React;
```

## React 是如何将虚拟 DOM 转换为真实 DOM

1. 首先我们要通过 `React.createElement` 函数来将我们定义好的组件进行转换为 React 元素
2. 将创建好的 `React` 元素通过调用 `ReactDom.render` 来进行渲染
3. `ReactDom.render` 调用后先创建根对象 `root`，然后调用 `root.render`
4. 然后经过若干函数调用，来到 `workLoop` 函数，它将遍历虚拟 DOM 树，将下一个需要处理的虚拟 DOM 传给 `performUnitOfWork`，`performUnitOfWork` 再将虚拟 DOM 传给 `beginWork` 后，`beginWork`根据虚拟 DOM 的类型不同进行相应处理，并对子节点进行处理为 `Fiber` 类型，为 `Fiber` 类型虚拟 DOM , 添加父节点、兄弟节点等细节，以方便遍历树。
5. `beginWork` 处理完后返回需要处理的子元素再继续处理，直到没有子元素（即返回 null），此时 `performUnitOfWork` 调用 `completeUnitOfWork` 处理这颗`虚拟 DOM 子树`，将其转`换为真实 DOM`。
6. 最后所有的`虚拟 DOM` 都将转为`真实 DOM`。

## 函数调用过程

```js
root.render(children, callback) ->
DOMRenderer.updateContainer(children, root, null, work._onCommit) ->
updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    callback,
) ->
scheduleRootUpdate(current, element, expirationTime, callback) ->
scheduleWork(current, expirationTime) ->
requestWork(root, rootExpirationTime) ->
performWorkOnRoot(root, Sync, false) ->
renderRoot(root, false) ->
workLoop(isYieldy) ->
performUnitOfWork(nextUnitOfWork: Fiber) => Fiber | null ->
beginWork(current, workInProgress, nextRenderExpirationTime)

```

**使用 ReactDom 渲染到 页面上**

```js
ReactDom.render(React.createElement(App), document.getElementById("root"));
```

## 我艹，有点懵～
  
待补，先写个其他的压压惊

## 参考链接

<a href="https://blog.csdn.net/weixin_34221276/article/details/88770678" target="_blank" >React 源码阅读：虚拟 DOM 的初始化</a>

<a href="https://www.cnblogs.com/JhoneLee/p/9481321.html" target="_blank" >React 16 源码瞎几把解读 【一】 从jsx到一个react 虚拟dom对象</a>

<a href="https://www.cnblogs.com/JhoneLee/p/9482911.html" target="_blank" >React 16 源码瞎几把解读 【二】 react组件的解析过程</a>

<a href="https://www.cnblogs.com/JhoneLee/p/9481618.html" target="_blank" >React 16 源码瞎几把解读 【三 点 一】 把react组件对象弄到dom中去(矛头指向fiber，fiber不解读这个过程也不知道) </a>

<a href="https://www.cnblogs.com/JhoneLee/p/9493776.html" target="_blank" >React 16 源码瞎几把解读 【三 点 二】 react中的fiberRoot</a>

