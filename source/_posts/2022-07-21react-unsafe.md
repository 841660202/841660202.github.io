---
title: React unsafe_
date: 2022-07-21 14:23:16
categories: React
tags: [React]
cover:
---

## 我整理这篇文章的目的

很多时候，我在学技术时候更多关注的是`教程`和`文档`,原因有三：时间紧、任务重、新技术很多

最近手头无事，刚好搜源码搜到了，如果你也像我一样，希望闲暇之余，你也能了解 React 变更过程，加深 React 的理解

## 过时的组件生命周期往往会带来不安全的编码实践

- componentWillMount
- componentWillReceiveProps
- componentWillUpdate

这些生命周期方法经常被`误解和滥用`；此外，React 团队预计到，在异步渲染中，它们潜在的`误用问题可能更大`。所以在 March 27, 2018 提出

> 我们将在即将发布的版本中为这些生命周期添加 `UNSAFE_` 前缀。（这里的 “unsafe” `不是指安全性`，`而是表示使用这些生命周期的代码在 React 的未来版本中更有可能出现 bug`，`尤其是在启用异步渲染之后`。）

## 遵循语义版本控制

React <a href="https://semver.org/lang/zh-CN/" target="_blank" >遵循语义版本控制</a>，因此这种变化将是逐步的。我们目前的计划是：

- 16.3：为不安全的生命周期引入别名，` UNSAFE_componentWillMount``、UNSAFE_componentWillReceiveProps ` 和 `UNSAFE_componentWillUpdate`。（旧的生命周期名称和新的别名都可以在此版本中使用。）
  未来
- 16.x 版本：为 ` componentWillMount``、componentWillReceiveProps ` 和 `componentWillUpdate` 启用废弃告警。（旧的生命周期名称和新的别名都将在这个版本中工作，但是旧的名称在开发模式下会产生一个警告。）
- 17.0：删除 `componentWillMount`、`componentWillReceiveProps` 和 `componentWillUpdate`。（在此版本之后，只有新的 “UNSAFE\_” 生命周期名称可以使用。）

:::warning
注意，如果你是 React 应用程序开发人员，则无需对这些过时的方法执行任何操作。即将发布的 16.3 版本的主要目的是使开源项目维护人员能够在任何废弃警告之前更新他们的库。在未来的 16.x 版本发布之前，不会启用这些警告。
:::

## 迁移过时的生命周期

在开始之前，下面是关于 16.3 版本计划的生命周期变更的快速概述：

- 添加以下生命周期别名：`UNSAFE_componentWillMount`、`UNSAFE_componentWillReceiveProps` 和 `UNSAFE_componentWillUpdate`。（将同时支持旧的生命周期名称和新别名。）
- 引入两个新的生命周期，静态的 `getDerivedStateFromProps` 和 `getSnapshotBeforeUpdate`。

## getDerivedStateFromProps

```js
class Example extends React.Component {
  static getDerivedStateFromProps(props, state) {
    // ...
  }
}
```

新的静态 `getDerivedStateFromProps` 生命周期方法`在组件实例化之后以及重新渲染之前调用`。它可以返回一个对象来更新 state，或者`返回 null 来表示新的 props 不需要任何 state 的更新`。

与 `componentDidUpdate` 一起，这个新的生命周期涵盖过时的 `componentWillReceiveProps` 的所有用例。

:::warning
注意：

旧的 componentWillReceiveProps 和新的 getDerivedStateFromProps 方法都会增加组件的复杂性。这经常会导致 bug。考虑使用 <a href="https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html" target="_blank" >派生 state 的简单替代方法</a> 让组件可预测且可维护。
:::

## getSnapshotBeforeUpdate

```js
class Example extends React.Component {
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // ...
  }
}
```

新的 `getSnapshotBeforeUpdate` 生命周期方法`在更新之前（如：更新 DOM 之前）被调用`。**此生命周期的返回值将作为第三个参数传递给 componentDidUpdate**。（通常不需要，但在重新渲染过程中手动保留滚动位置等情况下非常有用。）

与 `componentDidUpdate` 一起，这个新的生命周期涵盖过时的 `componentWillUpdate` 的所有用例。

## 示例

### 初始化 state

这个例子显示了组件在 componentWillMount 中调用 setState：

```js
// Before
class ExampleComponent extends React.Component {
  state = {};

  componentWillMount() {
    this.setState({
      currentColor: this.props.defaultColor,
      palette: "rgb",
    });
  }
}
```

对于这种类型的组件，最简单的重构是将 state 的初始化，移到构造函数或属性的初始化器内，

```js
// After
class ExampleComponent extends React.Component {
  state = {
    currentColor: this.props.defaultColor,
    palette: "rgb",
  };
}
```

### 获取外部数据

以下是使用 componentWillMount 获取外部数据的组件的示例：

```js
// Before
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  componentWillMount() {
    this._asyncRequest = loadMyAsyncData().then((externalData) => {
      this._asyncRequest = null;
      this.setState({ externalData });
    });
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.externalData === null) {
      // 渲染加载状态 ...
    } else {
      // 渲染真实 UI ...
    }
  }
}
```

上述代码对于服务器渲染（不使用外部数据）和即将推出的异步渲染模式（可能多次启动请求）都存在问题。

大多数用例推荐的升级方式是将数据获取移到 componentDidMount：

```js
// After
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  componentDidMount() {
    this._asyncRequest = loadMyAsyncData().then((externalData) => {
      this._asyncRequest = null;
      this.setState({ externalData });
    });
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.externalData === null) {
      // 渲染加载状态 ...
    } else {
      // 渲染真实 UI ...
    }
  }
}
```

### 误解 1

有一个常见的误解是，在 `componentWillMount` 中获取数据可以避免第一次渲染为空的状态。实际上，这是不对的，因为 React 总是在 `componentWillMount` 之后立即执行 `render`。如果在 `componentWillMount` 触发时数据不可用，那么第一次 `render` 仍然会显示加载的状态，而不管你在哪里初始化获取数据。这就是为什么在绝大多数情况下，将获取数据移到 `componentDidMount` 没有明显效果的原因。

:::warning

注意

一些高级用例（如：`Relay` 库）可能尝试提前获取异步数据。这里提供了一个如何实现的示例。

从长远来看，在 React 组件中获取数据的标准方法应该基于 “`suspense`” API 在冰岛 JSConf 提出。无论是简单的数据获取解决方案，还是像 `Apollo` 和 `Relay` 这样的库，都可以在内部使用它。它比上面的任何一个解决方案都要简洁，但是不会在 16.3 版本发布之前完成。

当支持服务器渲染时，需要同步获取数据——`componentWillMount` 经常用于此目的，也可以用构造函数替代。即将推出的 suspense API 将使异步数据获取对于客户端和服务器渲染都是完全有可能的。

:::

### 添加事件监听器（或订阅）

下面是一个示例，在组件挂载时订阅了外部事件：

```js
// Before
class ExampleComponent extends React.Component {
  componentWillMount() {
    this.setState({
      subscribedValue: this.props.dataSource.value,
    });
    // 这是不安全的，它会导致内存泄漏！
    this.props.dataSource.subscribe(this.handleSubscriptionChange);
  }

  componentWillUnmount() {
    this.props.dataSource.unsubscribe(this.handleSubscriptionChange);
  }

  handleSubscriptionChange = (dataSource) => {
    this.setState({
      subscribedValue: dataSource.value,
    });
  };
}
```

遗憾的是，这可能导致服务器渲染（永远不会调用 `componentWillUnmount`）和异步渲染（在渲染完成之前可能被中断，导致不调用 `componentWillUnmount`）的`内存泄漏`。

### 误解 2

人们通常认为 `componentWillMount` 和 `componentWillUnmount` 是成对出现的，但这并不能保证。只有调用了 `componentDidMount` 之后，React 才能保证稍后调用 `componentWillUnmount` 进行清理。

因此，添加监听器/订阅的推荐方法是使用 `componentDidMount` 生命周期：

```js
// After
class ExampleComponent extends React.Component {
  state = {
    subscribedValue: this.props.dataSource.value,
  };
  componentDidMount() {
    // 事件监听器只有在挂载后添加才是安全的，
    // 因此，如果挂载中断或错误，它们不会泄漏。
    this.props.dataSource.subscribe(this.handleSubscriptionChange);
    // 外部值可能在渲染和挂载期间改变，
    // 在某些情况下，处理这种情况很重要。
    if (this.state.subscribedValue !== this.props.dataSource.value) {
      this.setState({
        subscribedValue: this.props.dataSource.value,
      });
    }
  }

  componentWillUnmount() {
    this.props.dataSource.unsubscribe(this.handleSubscriptionChange);
  }

  handleSubscriptionChange = (dataSource) => {
    this.setState({
      subscribedValue: dataSource.value,
    });
  };
}
```

有时，更新订阅来响应属性变更非常重要。如果你正在使用像 `Redux` 或 `MobX` 这样的库，`库的容器组件应该为你处理了这个问题`。对于应用程序作者，我们创建了一个小型库，`create-subscription`，来帮助解决这个问题。我们将它与 React 16.3 一起发布。

我们可以使用 `create-subscription` 来传递订阅的值，而不是像上面示例那样传递一个可订阅的 dataSource prop：

```js
import { createSubscription } from "create-subscription";

const Subscription = createSubscription({
  getCurrentValue(sourceProp) {
    // 返回订阅的当前值（sourceProp）。
    return sourceProp.value;
  },

  subscribe(sourceProp, callback) {
    function handleSubscriptionChange() {
      callback(sourceProp.value);
    }

    // 订阅（例如：向订阅（sourceProp）添加事件监听器。
    // 每当订阅发生变化时，调用回调函数（新值）。
    sourceProp.subscribe(handleSubscriptionChange);

    // 返回取消订阅方法。
    return function unsubscribe() {
      sourceProp.unsubscribe(handleSubscriptionChange);
    };
  },
});

// 我们可以直接传递订阅的值，
// 而不是将可订阅的源传递给我们的 ExampleComponent：
<Subscription source={dataSource}>
  {(value) => <ExampleComponent subscribedValue={value} />}
</Subscription>;
```

:::warning
注意：

像 `Relay/Apollo` 这样的库，内部应该使用了与 `create-subscription` 相同的技术，用最适合他们库使用的方式手动管理订阅（参考这里）。
:::

### 基于 props 更新 state

:::warning

注意：

旧的 `componentWillReceiveProps` 和新的 `getDerivedStateFromProps` 方法都会给组件增加明显的复杂性。这通常会导致 `bug`。考虑 派生 state 的简单替代方法 使组件可预测且可维护。
:::

这是一个示例，组件使用过时的 `componentWillReceiveProps` 生命周期基于新的 `props` 更新 `state`：

```js
// Before
class ExampleComponent extends React.Component {
  state = {
    isScrollingDown: false,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.currentRow !== nextProps.currentRow) {
      this.setState({
        isScrollingDown: nextProps.currentRow > this.props.currentRow,
      });
    }
  }
}
```

尽管上面的代码本身没有问题，但是 `componentWillReceiveProps` 生命周期经常被误用，会产生问题。因此，该方法将被废弃。

从 16.3 版本开始，当 `props` 变化时，建议使用新的 `static getDerivedStateFromProps` 生命周期更新 `state`。创建组件以及每次组件由于 `props` 或 `state` 的改变而重新渲染时都会调用该生命周期：

```js
// After
class ExampleComponent extends React.Component {
  // 在构造函数中初始化 state，
  // 或者使用属性初始化器。
  state = {
    isScrollingDown: false,
    lastRow: null,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.currentRow !== state.lastRow) {
      return {
        isScrollingDown: props.currentRow > state.lastRow,
        lastRow: props.currentRow,
      };
    }

    // 返回 null 表示无需更新 state。
    return null;
  }
}
```

在上面的示例中，你可能会注意到 `props.currentRow` 在 state 中的镜像（`state.lastRow`）。这使得 `getDerivedStateFromProps` 能够像在 `componentWillReceiveProps` 中相同的方式访问上一个 `props` 的值。

你可能想知道为什么我们不将上一个 `props` 作为参数传递给 `getDerivedStateFromProps`。我们在设计 API 时考虑过这个方案，但最终决定不采用它，原因有两个：

- `prevProps` 参数在第一次调用 `getDerivedStateFromProps`（实例化之后）时为 `null`，需要在每次访问 `prevProps` 时添加 `if-not-null` 检查。

- 在 `React` 的未来版本中，不传递上一个 `props` 给这个方法是为了释放内存。（如果 `React` 无需传递上一个 `props` 给生命周期，那么它就无需保存上一个 `props` 对象在内存中。）

:::warning

注意

如果你正在编写共享组件，`react-lifecycles-compat` polyfill 可以在旧版本的 React 里面使用新的 `getDerivedStateFromProps` 生命周期。在下面了解更多如何使用。

:::

### 调用外部回调

调用外部回调
下面是一个组件的示例，它在内部 state 发生变化时调用了外部函数：

```js
// Before
class ExampleComponent extends React.Component {
  componentWillUpdate(nextProps, nextState) {
    if (this.state.someStatefulValue !== nextState.someStatefulValue) {
      nextProps.onChange(nextState.someStatefulValue);
    }
  }
}
```

### 误解 3

有时人们使用 `componentWillUpdate` 是出于一种错误的担心，即当 `componentDidUpdate` 触发时，更新其他组件的 `state` 已经”太晚”了。事实并非如此。React 可确保在用户看到更新的 UI 之前，刷新在 `componentDidMount` 和 `componentDidUpdate` 期间发生的任何 `setState` 调用。通常，最好避免这样的级联更新，_但在某些情况下，这些更新是必需的（例如：如果你需要在测量渲染的 DOM 元素后，定位工具的提示）。_

不管怎样，在异步模式下使用 `componentWillUpdate` 都是不安全的，因为`外部回调可能会在一次更新中被多次调用`。相反，应该使用 `componentDidUpdate` 生命周期，因为它保证每次更新只调用一次：

```js
// After
class ExampleComponent extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.state.someStatefulValue !== prevState.someStatefulValue) {
      this.props.onChange(this.state.someStatefulValue);
    }
  }
}
```

### props 更新的副作用

类似于上面的例子，有时候组件在 `props` 发生变化时会产生副作用。

```js
// Before
class ExampleComponent extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.isVisible !== nextProps.isVisible) {
      logVisibleChange(nextProps.isVisible);
    }
  }
}
```

与 `componentWillUpdate` 类似，`componentWillReceiveProps` 可能在一次更新中被多次调用。**因此，避免在此方法中产生副作用非常重要**。相反，应该使用 `componentDidUpdate`，因为它保证每次更新只调用一次：

```js
// After
class ExampleComponent extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.isVisible !== prevProps.isVisible) {
      logVisibleChange(this.props.isVisible);
    }
  }
}
```

### props 更新时获取外部数据

下面是一个组件的示例，它根据 props 的值获取外部数据：

```js
// Before
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  componentDidMount() {
    this._loadAsyncData(this.props.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.setState({ externalData: null });
      this._loadAsyncData(nextProps.id);
    }
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.externalData === null) {
      // 渲染加载状态 ...
    } else {
      // 渲染真实 UI ...
    }
  }

  _loadAsyncData(id) {
    this._asyncRequest = loadMyAsyncData(id).then((externalData) => {
      this._asyncRequest = null;
      this.setState({ externalData });
    });
  }
}
```

此组件的推荐升级路径是将数据更新移动到 `componentDidUpdate`。你还可以使用新的 `getDerivedStateFromProps` 生命周期，在渲染新的 props 之前清除旧数据：

```js
// After
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  static getDerivedStateFromProps(props, state) {
    // 保存 prevId 在 state 中，以便我们在 props 变化时进行对比。
    // 清除之前加载的数据（这样我们就不会渲染旧的内容）。
    if (props.id !== state.prevId) {
      return {
        externalData: null,
        prevId: props.id,
      };
    }
    // 无需更新 state
    return null;
  }

  componentDidMount() {
    this._loadAsyncData(this.props.id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.externalData === null) {
      this._loadAsyncData(this.props.id);
    }
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.externalData === null) {
      // 渲染加载状态 ...
    } else {
      // 渲染真实 UI ...
    }
  }

  _loadAsyncData(id) {
    this._asyncRequest = loadMyAsyncData(id).then((externalData) => {
      this._asyncRequest = null;
      this.setState({ externalData });
    });
  }
}
```

:::warning
注意

如果你正在使用支持取消的 HTTP 库，例如 axios 那么在卸载时取消正在进行的请求非常简单。对于原生的 Promise，<a href="https://gist.github.com/bvaughn/982ab689a41097237f6e9860db7ca8d6" target="_blank" >你可以使用类似此处所示的方法</a>。
:::

### 更新前读取 DOM 属性

下面是一个组件的示例，该组件在更新之前从 DOM 中读取属性，以便在列表中保持滚动的位置

```js
class ScrollingList extends React.Component {
  listRef = null;
  previousScrollOffset = null;

  componentWillUpdate(nextProps, nextState) {
    // 我们正在向列表中添加新项吗？
    // 捕获滚动位置，以便我们稍后可以调整滚动位置。
    if (this.props.list.length < nextProps.list.length) {
      this.previousScrollOffset =
        this.listRef.scrollHeight - this.listRef.scrollTop;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // 如果我们刚刚添加了新项，并且设置了 previousScrollOffset。
    // 调整滚动位置，以便这些新项不会把旧项挤出视图。
    if (this.previousScrollOffset !== null) {
      this.listRef.scrollTop =
        this.listRef.scrollHeight - this.previousScrollOffset;
      this.previousScrollOffset = null;
    }
  }

  render() {
    return <div ref={this.setListRef}>{/* ...内容... */}</div>;
  }

  setListRef = (ref) => {
    this.listRef = ref;
  };
}
```

在上面的示例中，`componentWillUpdate` 用于读取 DOM 属性。但是，对于异步渲染，“渲染”阶段的生命周期（如 `componentWillUpdate` 和 `render`）和”提交”阶段的生命周期（如 `componentDidUpdate`）之间可能存在延迟。如果用户在这段时间内调整窗口大小，那么从 `componentWillUpdate` 读取的 `scrollHeight` 值将过时。

这个问题的解决方案是使用新的“提交”阶段生命周期 `getSnapshotBeforeUpdate`。这个方法在发生变化 _前立即_ 被调用（例如在更新 DOM 之前）。它可以返回一个 React 的值作为参数传递给 `componentDidUpdate` 方法，该方法在发生变化 _后立即_ 被调用。

这两个生命周期可以像这样一起使用：

```js
class ScrollingList extends React.Component {
  listRef = null;

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 我们正在向列表中添加新项吗？
    // 捕获滚动位置，以便我们稍后可以调整滚动位置。
    if (prevProps.list.length < this.props.list.length) {
      return this.listRef.scrollHeight - this.listRef.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 如果我们刚刚添加了新项，并且有了快照值。
    // 调整滚动位置，以便这些新项不会把旧项挤出视图。
    // （此处的快照是从 getSnapshotBeforeUpdate 返回的值）
    if (snapshot !== null) {
      this.listRef.scrollTop = this.listRef.scrollHeight - snapshot;
    }
  }

  render() {
    return <div ref={this.setListRef}>{/* ...内容... */}</div>;
  }

  setListRef = (ref) => {
    this.listRef = ref;
  };
}
```

:::warning

注意

如果你正在编写共享组件，那么 react-lifecycles-compat polyfill 可以使新的 getSnapshotBeforeUpdate 生命周期与旧版本的 React 一起使用。在下面了解更多如何使用。

:::

## 总结

误解、滥用、异步中老 API 多次调用

- 误解 `componentWillMount` 中初始化 state
  <br/>
  <br/>

- 误解 `componentWillMount` 中获取数据，在 `componentWillMount` 之后立即执行 `render`。如果在 `componentWillMount` 触发时数据不可用，那么第一次 `render` 仍然会显示加载的状态，而不管你在哪里初始化获取数据
  <br/>
  <br/>

- 误解 `componentWillMount` 中订阅，在服务端不会调用`componentWillUnMount`,导致内存泄漏,
  <br/>
  <br/>

- 使用 `componentWillUpdate` 是出于一种错误的担心，即当 `componentDidUpdate` 触发时，更新其他组件的 `state` 已经”太晚”了。事实并非如此。React 可确保在用户看到更新的 UI 之前，刷新在 `componentDidMount` 和 `componentDidUpdate` 期间发生的任何 `setState` 调用。通常，最好避免这样的级联更新，_但在某些情况下，这些更新是必需的（例如：如果你需要在测量渲染的 DOM 元素后，定位工具的提示）。_ **异步中，多次调用**
  <br/>
  <br/>

- `componentWillReceiveProps` 可能在一次更新中被多次调用。**因此，避免在此方法中产生副作用非常重要**

## 参考链接

<a href="https://zh-hans.reactjs.org/blog/2018/03/27/update-on-async-rendering.html" target="_blank" >异步渲染之更新</a>
