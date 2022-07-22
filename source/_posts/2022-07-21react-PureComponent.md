---
title: React PureComponent
date: 2022-07-21 16:28:39
categories: React
tags: [React]
cover:
---

## 串串

<img src="http://t-blog-images.aijs.top/img/pureComponent1.webp" />

PureComponent 继承 Component,添加 isPureReactComponent 标记

```js
// ComponentDummy 是典型的 JavaScript 原型模拟继承的做法，
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

/**
 * Convenience component with default shallow equality check for sCU.
 * 具有sCU默认浅相等检查的便利组件。
 */
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  // 如果组件具有字符串引用，我们将稍后指定其他对象。
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.  避免这些方法的额外原型跳转。
// 为了避免原型链拉长导致方法查找的性能开销，还用 Object.assign 把方法从 ReactComponent 拷贝过来了
Object.assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true; // checkShouldComponentUpdate中有浅比较`shallowEqual`
```

```js
// packages/react/src/ReactBaseClasses.js
// PureComponent->继承Component, 添加 isPureReactComponent = true

// packages/react-reconciler/src/ReactFiberClassComponent.js
// checkShouldComponentUpdate->
// shallowEqual
```

## checkShouldComponentUpdate

```js
function checkShouldComponentUpdate(
  workInProgress,
  ctor,
  oldProps,
  newProps,
  oldState,
  newState,
  nextLegacyContext
) {
  const instance = workInProgress.stateNode;
  // 实例上有shouldComponentUpdate，走实例的判断
  if (typeof instance.shouldComponentUpdate === "function") {
    startPhaseTimer(workInProgress, "shouldComponentUpdate");
    const shouldUpdate = instance.shouldComponentUpdate(
      newProps,
      newState,
      nextLegacyContext
    );
    stopPhaseTimer();

    if (__DEV__) {
      warningWithoutStack(
        shouldUpdate !== undefined,
        "%s.shouldComponentUpdate(): Returned undefined instead of a " +
          "boolean value. Make sure to return true or false.",
        getComponentName(ctor) || "Component"
      );
    }

    return shouldUpdate; // 返回了
  }
  // 实例没有看看组件是不是PureComponent,如果是进行浅比较
  // 浅比较
  if (ctor.prototype && ctor.prototype.isPureReactComponent) {
    return (
      !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
    );
  }

  return true;
}
```

## shallowEqual

```js
function shallowEqual(objA: mixed, objB: mixed): boolean {
  if (is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  // 只是对键对应的值进行比较，从MDN Object.is Api了解到 都是相同对象（意味着都是同一个对象的值引用）
  // 如果这里进行递归处理，就变成了deepCompare

  for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}
```

## is

```js
/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}
```

## end and start

其实上到这个地方，PureComponent 就聊完了

## 与 beginWork 串串

<img src="http://t-blog-images.aijs.top/img/pureComponent.webp" />

```js
// beginWork->
// updateClassComponent(到这里就与@link: http://v.aijs.top/posts/2022-07-21react-createElement 串起来了)->
// resumeMountClassInstance-> | updateClassInstance->
// checkShouldComponentUpdate->
// shallowEqual
```

## resumeMountClassInstance

如果已经创建实例，则重用实例

```js
function resumeMountClassInstance(
  workInProgress: Fiber,
  ctor: any,
  newProps: any,
  renderExpirationTime: ExpirationTime
): boolean {
  // 是否应该更新，两种情况：forceUpdate 或者 checkShouldComponentUpdate 返回true
  const shouldUpdate =
    checkHasForceUpdateAfterProcessing() ||
    checkShouldComponentUpdate(
      workInProgress,
      ctor,
      oldProps,
      newProps,
      oldState,
      newState,
      nextLegacyContext
    );

  if (shouldUpdate) {
    // In order to support react-lifecycles-compat polyfilled components,
    // Unsafe lifecycles should not be invoked for components using the new APIs.
    if (
      !hasNewLifecycles &&
      (typeof instance.UNSAFE_componentWillMount === "function" ||
        typeof instance.componentWillMount === "function")
    ) {
      startPhaseTimer(workInProgress, "componentWillMount");
      if (typeof instance.componentWillMount === "function") {
        instance.componentWillMount();
      }
      if (typeof instance.UNSAFE_componentWillMount === "function") {
        instance.UNSAFE_componentWillMount();
      }
      stopPhaseTimer();
    }
    // 这里进行标记了
    if (typeof instance.componentDidMount === "function") {
      workInProgress.effectTag |= Update;
    }
  } else {
  }

  // Update the existing instance's state, props, and context pointers even
  // if shouldComponentUpdate returns false.
  instance.props = newProps;
  instance.state = newState;
  instance.context = nextLegacyContext;

  return shouldUpdate;
}
```

## startPhaseTimer

`packages/react-reconciler/src/ReactDebugFiberPerf.js`文件中，性能测量相关，不用关心

## updateClassComponent

```js
function updateClassComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  nextProps,
  renderExpirationTime: ExpirationTime
) {
  let shouldUpdate;
  if (current === null) {
    //  如果还没创建实例，初始化
    if (workInProgress.stateNode === null) {
    } else {
      //  如果已经创建实例，则重用实例
      // In a resume, we'll already have an instance we can reuse.
      shouldUpdate = resumeMountClassInstance(
        workInProgress,
        Component,
        nextProps,
        renderExpirationTime
      );
    }
  } else {
    // 更新类实例
    shouldUpdate = updateClassInstance(
      current,
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime,
    );
  }
  return finishClassComponent(
    // 调用组件实例的render函数获取需渲染的子元素，并把子元素进行处理为Fiber类型，处理state和props：
    current,
    workInProgress,
    Component,
    shouldUpdate,
    hasContext,
    renderExpirationTime
  );
}
```
