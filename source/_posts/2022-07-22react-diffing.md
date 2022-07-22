---
title: React diffing algorithm
date: 2022-07-22 09:16:00
categories: React
tags: [React]
cover:
---

## 说明

> React provides a declarative API so that you don’t have to worry about exactly what changes on every update. This makes writing applications a lot easier, but it might not be obvious how this is implemented within React. This article explains the choices we made in React’s “diffing” algorithm so that component updates are predictable while being fast enough for high-performance apps.

嗯，这里使用了英文原文，我觉得中文版本，翻译的不够准确

撇开中文版官方不谈，译文如下：

React 提供了响应式 API,所以你不用担心每次更新都会发生什么变化。这使得开发应用更点单，但在 React 中如何实现这一点可能并不明显。这篇文章解释了我们在 React 的 diffing 算法的选择，因此，组件更新是可预测的，同时对高性能应用程序来说足够快。

## 设计动机

在某一时间节点调用 React 的 render() 方法，会创建一棵由 React 元素组成的树。

在下一次 state 或 props 更新时，相同的 render() 方法会返回一棵不同的树。

React 需要基于这两棵树之间的差别来判断如何高效的更新 UI，以保证当前 UI 与最新的树保持同步。

此算法有一些通用的解决方案，即生成将一棵树转换成另一棵树的最小操作次数。然而，即使使用最优的算法，该算法的复杂程度仍为 O(n 3 )，其中 n 是树中元素的数量。

如果在 React 中使用该算法，那么展示 1000 个元素则需要 10 亿次的比较。这个开销实在是太过高昂。于是 React 在以下两个假设的基础之上提出了一套 O(n) 的 `启发式算法`：

- `两个不同类型的元素会产生出不同的树；`
- `开发者可以使用 key 属性标识哪些子元素在不同的渲染中可能是不变的。`

在实践中，我们发现以上假设在几乎所有实用的场景下都成立。

:::details 启发式算法定义
<a href="https://baike.baidu.com/item/%E5%90%AF%E5%8F%91%E5%BC%8F%E7%AE%97%E6%B3%95/938987" target="_blank" >`启发式算法`</a>（heuristic algorithm)是相对于最优化算法提出的。一个问题的最优算法求得该问题每个实例的最优解。启发式算法可以这样定义：一个基于直观或经验构造的算法，在可接受的花费（指计算时间和空间）下给出待解决组合优化问题每一个实例的一个可行解，该可行解与最优解的偏离程度一般不能被预计
:::

## Diffing 算法

当对比两棵树时，React 首先比较两棵树的根节点。不同类型的根节点元素会有不同的形态。

### 对比不同类型的元素

当根节点为不同类型的元素时，React 会拆卸原有的树并且建立起新的树

- 当卸载一棵树时，对应的 DOM 节点也会被销毁。组件实例将执行 `componentWillUnmount()` 方法。

- 当建立一棵新的树时，对应的 DOM 节点会被创建以及插入到 DOM 中。组件实例将执行 `UNSAFE_componentWillMount()` 方法，紧接着 `componentDidMount()` 方法。

所有与之前的树相关联的 state 也会被销毁。

在根节点以下的组件也会被卸载，它们的状态会被销毁。比如，当比对以下更变时：

```js
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>

```

React 会销毁 Counter 组件并且重新装载一个新的组件。

### 对比同一类型的元素

当对比两个相同类型的 React 元素时，React 会保留 DOM 节点，仅比对及更新有改变的属性。比如：

```js
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

通过对比这两个元素，React 知道只需要修改 DOM 元素上的 `className` 属性。

<br/>
<br/>

当更新 `style` 属性时，React 仅更新有所更变的属性。比如：

```js
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}} />
```

通过对比这两个元素，React 知道只需要修改 DOM 元素上的 `color` 样式，无需修改 `fontWeight`。

在处理完当前节点之后，React 继续对子节点进行递归。

### 对比同类型的组件元素

当一个组件更新时，`组件实例会保持不变`，因此可以在不同的渲染时保持 state 一致。React 将更新该组件实例的 props 以保证与最新的元素保持一致，并且调用该实例的 `UNSAFE_componentWillReceiveProps()`、`UNSAFE_componentWillUpdate()` 以及 `componentDidUpdate()`方法。

下一步，调用 render() 方法，**diff 算法将在之前的结果以及新的结果中进行递归**。

### 对子节点进行递归

默认情况下，当递归 DOM 节点的子元素时，React 会同时遍历两个子元素的列表；当产生差异时，生成一个 `mutation`变化。

`在子元素列表末尾新增元素时，更新开销比较小`。比如：

```js
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

React 会先匹配两个 <li>first</li> 对应的树，然后匹配第二个元素 <li>second</li> 对应的树，最后插入第三个元素的 <li>third</li> 树。

如果只是简单的将新增元素插入到表头，那么更新开销会比较大。比如：

```js
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

React 并不会意识到应该保留 `<li>Duke</li>` 和 `<li>Villanova</li>`，而是会重建每一个子元素。这种情况会带来性能问题。

### Keys

为了解决上述问题，React 引入了 key 属性。当子元素拥有 key 时，React 使用 key 来匹配原有树上的子元素以及最新树上的子元素。以下示例在新增 key 之后，使得树的转换效率得以提高：

```js
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

```

现在 React 知道只有带着 `'2014'` key 的元素是新元素，带着 `'2015'` 以及 `'2016'` key 的元素仅仅移动了。

实际开发中，编写一个 key 并不困难。你要展现的元素可能已经有了一个唯一 ID，于是 key 可以直接从你的数据中提取：

```js
<li key={item.id}>{item.name}</li>
```

当以上情况不成立时，你可以新增一个 ID 字段到你的模型中，或者利用一部分内容作为哈希值来生成一个 key。**这个 key 不需要全局唯一，但在列表中需要保持唯一**。

最后，_你也可以使用元素在数组中的下标作为 key。这个策略在元素不进行重新排序时比较合适，如果有顺序修改，diff 就会变慢_。

:::warning
**当基于下标的组件进行重新排序时，组件 state 可能会遇到一些问题**。由于组件实例是基于它们的 key 来决定是否更新以及复用，`如果 key 是一个下标，那么修改顺序时会修改当前的 key，导致`<small style="color: red;">非受控组件的 state（比如输入框）</small>`可能相互篡改，会出现无法预期的变动`。

:::

在 Codepen 有两个例子，分别为 <a href="https://zh-hans.reactjs.org/redirect-to-codepen/reconciliation/index-used-as-key" target="_blank" >展示使用下标作为 key 时导致的问题</a>，以及 <a href="https://zh-hans.reactjs.org/redirect-to-codepen/reconciliation/no-index-used-as-key" target="_blank" >不使用下标作为 key 的例子的版本，修复了重新排列，排序，以及在列表头插入的问题</a>。

**修复前**

<!-- <img src="http://t-blog-images.aijs.top/img/Kapture 2022-07-22 at 09.23.57.gif" style="max-width: 400px" /> -->

**修复后**

<!-- <img src="http://t-blog-images.aijs.top/img/Kapture 2022-07-22 at 09.29.46.gif" style="max-width: 400px" /> -->

## 权衡

请谨记协调算法是一个实现细节。

React 可以在每个 action 之后对整个应用进行重新渲染，得到的最终结果也会是一样的。在此情境下，重新渲染表示在所有组件内调用 render 方法，这不代表 React 会卸载或装载它们。React 只会基于以上提到的规则来决定如何进行差异的合并。

我们定期优化启发式算法，让常见用例更高效地执行。**在当前的实现中，可以理解为一棵子树能在其兄弟之间移动，但不能移动到其他位置。**在这种情况下，算法会重新渲染整棵子树。

由于 React 依赖启发式算法，因此当以下假设没有得到满足，性能会有所损耗。

- 该算法不会尝试匹配不同组件类型的子树。**如果你发现你在两种不同类型的组件中切换，但输出非常相似的内容，建议把它们改成同一类型**。在实践中，我们没有遇到这类问题。

- Key 应该具有稳定，可预测，以及列表内唯一的特质。不稳定的 key（比如通过 Math.random() 生成的）会导致许多组件实例和 DOM 节点被不必要地重新创建，**这可能导致性能下降和子组件中的状态丢失。**

## diffing algorithm

<a href="https://react.iamkasong.com/diff/prepare.html#diff%E7%9A%84%E7%93%B6%E9%A2%88%E4%BB%A5%E5%8F%8Areact%E5%A6%82%E4%BD%95%E5%BA%94%E5%AF%B9" target="_blank" >见</a>

:::warning
注意：React 技术揭秘讲的内容并不一定是全面且正确的，可能你在读的源码版本不一致，但可借鉴
:::

## reconcileChildFibers

读源码中...

## 参考链接

<a href="https://zh-hans.reactjs.org/docs/reconciliation.html#the-diffing-algorithm" target="_blank" >reconciliation</a>
