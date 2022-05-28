---
title: react-redux 源码1
date: 2022-05-24 13:58:32
categories: react-redux
tags: [react-redux, redux, 源码]
cover: 
---

## react-redux官方介绍
- 官方UI绑定层。 React Redux is the `official React UI bindings layer` for Redux. 
- 从redux的store读数据。 It lets your React components `read data from a Redux store`,
- 触发行为给store来更新状态。and `dispatch actions to the store to update state`.

## react-redux 源码
```shell
.
├── alternate-renderers.ts
├── components
│   ├── Context.ts
│   ├── Provider.tsx
│   └── connect.tsx # 大部分代码都在这里
├── connect # 给 connect.tsx使用
│   ├── invalidArgFactory.ts
│   ├── mapDispatchToProps.ts
│   ├── mapStateToProps.ts
│   ├── mergeProps.ts
│   ├── selectorFactory.ts
│   ├── verifySubselectors.ts
│   └── wrapMapToProps.ts
├── exports.ts
├── hooks
│   ├── useDispatch.ts
│   ├── useReduxContext.ts
│   ├── useSelector.ts
│   └── useStore.ts
├── index.ts
├── next.ts
├── types.ts
└── utils
    ├── Subscription.ts
    ├── batch.ts
    ├── bindActionCreators.ts
    ├── isPlainObject.ts
    ├── reactBatchedUpdates.native.ts
    ├── reactBatchedUpdates.ts
    ├── shallowEqual.ts
    ├── useIsomorphicLayoutEffect.native.ts
    ├── useIsomorphicLayoutEffect.ts
    ├── useSyncExternalStore.ts
    ├── verifyPlainObject.ts
    └── warning.ts
```
## packge.json

```json
// packge.json
{
  "name": "react-redux",
  "version": "8.0.2",
  "description": "Official React bindings for Redux",
  "keywords": [
    "react",
    "reactjs",
    "redux"
  ],
  "license": "MIT",
  "author": "Dan Abramov <dan.abramov@me.com> (https://github.com/gaearon)",
  "homepage": "https://github.com/reduxjs/react-redux",
  "repository": "github:reduxjs/react-redux",
  "bugs": "https://github.com/reduxjs/react-redux/issues",
  // 找找入口，入口有3种：
  "main": "./lib/index.js", // 常规操作入口
  "types": "./es/index.d.ts", // 类型入口
  "unpkg": "dist/react-redux.js", // cdn入口
  "module": "es/index.js",//esm入口
  // npm发布上传的文件
  "files": [
    "dist",
    "lib",
    "src", // 一般用于开发阶段代码调试,soucemap
    "es"
  ],
  "scripts": {
    // 脚本不看了...
  },
  // 配置了依赖项，这些依赖项不需要在本包安装，在项目中安装即可
  "peerDependencies": {
    "@types/react": "^16.8 || ^17.0 || ^18.0",
    "@types/react-dom": "^16.8 || ^17.0 || ^18.0",
    "react": "^16.8 || ^17.0 || ^18.0",
    "react-dom": "^16.8 || ^17.0 || ^18.0",
    "react-native": ">=0.59",
    "redux": "^4"
  },
  "peerDependenciesMeta": {
    "@types/react": {
      "optional": true
    },
    "@types/react-dom": {
      "optional": true
    },
    "react-dom": {
      "optional": true
    },
    "react-native": {
      "optional": true
    },
    "redux": {
      "optional": true
    }
  },
  // 发布后，业务开发者使用，需要安装，//自动安装
  "dependencies": {
    "@babel/runtime": "^7.12.1",
    "@types/hoist-non-react-statics": "^3.3.1",
    "@types/use-sync-external-store": "^0.0.3",
    "hoist-non-react-statics": "^3.3.2",
    "react-is": "^18.0.0",
    "use-sync-external-store": "^1.0.0"
  },
  // 开发阶段需要用到的，一般是examples中demo使用
  "devDependencies": {
    //...
  }
}
```
## exports.ts

```ts
export {
  Provider, // import Provider from './components/Provider'

  ReactReduxContext, // import { ReactReduxContext } from './components/Context'

  connect, // import connect from './components/connect'

  useDispatch, // import { useDispatch, createDispatchHook } from './hooks/useDispatch'
  createDispatchHook, // import { useDispatch, createDispatchHook } from './hooks/useDispatch'

  useSelector, // import { useSelector, createSelectorHook } from './hooks/useSelector'
  createSelectorHook, // import { useSelector, createSelectorHook } from './hooks/useSelector'

  useStore, // import { useStore, createStoreHook } from './hooks/useStore'
  createStoreHook, // import { useStore, createStoreHook } from './hooks/useStore'

  shallowEqual, // import shallowEqual from './utils/shallowEqual'
}

```

## Provider
先看下 ，最熟悉的api
```tsx
// components/Provider.tsx
// 这个组件做的事情
// 1. 合并浏览器和服务器的状态
// 2. 对于同构的应用，处理subscription订阅
function Provider<A extends Action = AnyAction>({
  store,
  context,
  children,
  serverState,
}: ProviderProps<A>) {
  // 1.useMemo，对入参进行格式化「处理了store和 服务端的 serverState」
  const contextValue = useMemo(() => {
    const subscription = createSubscription(store)
    return {
      store,
      subscription,
      getServerState: serverState ? () => serverState : undefined,
    }
  }, [store, serverState])
  // 2.之前的state状态从store中直接获取
  const previousState = useMemo(() => store.getState(), [store])
  // 3.同构相关，跳过
  useIsomorphicLayoutEffect(() => {
    const { subscription } = contextValue
    subscription.onStateChange = subscription.notifyNestedSubs
    subscription.trySubscribe()

    if (previousState !== store.getState()) {
      subscription.notifyNestedSubs()
    }
    return () => {
      subscription.tryUnsubscribe()
      subscription.onStateChange = undefined
    }
  }, [contextValue, previousState])
  // 4.react-redux上下文
  const Context = context || ReactReduxContext

  // @ts-ignore 'AnyAction' is assignable to the constraint of type 'A', but 'A' could be instantiated with a different subtype
  return <Context.Provider value={contextValue}>{children}</Context.Provider> // 这行代码是不是非常熟悉了
}

export default Provider

```
## ReactReduxContext

```tsx
// ./components/Context.tsx
// 这个组件做的事情
// 1.创建个createContext
// 2.给个名字displayName

// ...类型代码不关注
export const ReactReduxContext =/*#__PURE__*/ React.createContext<ReactReduxContextValue>(null as any)

// ...类型代码不关注

if (process.env.NODE_ENV !== 'production') {
  ReactReduxContext.displayName = 'ReactRedux'
}

export default ReactReduxContext
```
## connect
```tsx
// ./components/connect.tsx
// 这个文件比较长，先不看
// hoist-non-react-statics这个依赖可以帮助我们自动拷贝非React的静态方法
```
## useDispatch、createDispatchHook
把ts类型删删，看上去更简单了

```ts
// ./hooks/useDispatch
// 用createDispatchHook钩子工厂创建了个钩子useDispatch
export function createDispatchHook(context) {
  // TODO: createStoreHook下面再看，先跳过
  const useStore = context === ReactReduxContext ? useDefaultStore : createStoreHook(context)
  return function useDispatch() {
    const store = useStore()
    // @ts-ignore
    return store.dispatch
  }
}
/**
 * A hook to access the redux `dispatch` function.
 *
 * @returns {any|function} redux store's `dispatch` function
 *
 * @example
 *
 * import React, { useCallback } from 'react'
 * import { useDispatch } from 'react-redux'
 *
 * export const CounterComponent = ({ value }) => {
 *   const dispatch = useDispatch()
 *   const increaseCounter = useCallback(() => dispatch({ type: 'increase-counter' }), [])
 *   return (
 *     <div>
 *       <span>{value}</span>
 *       <button onClick={increaseCounter}>Increase counter</button>
 *     </div>
 *   )
 * }
 */
export const useDispatch = /*#__PURE__*/ createDispatchHook()

```
## useSelector、createSelectorHook
```tsx
// ./hooks/useSelector
// 用 createSelectorHook 钩子工厂创建了个钩子 useSelector

let useSyncExternalStoreWithSelector = notInitialized as uSESWS
export const initializeUseSelector = (fn: uSESWS) => {
  useSyncExternalStoreWithSelector = fn
}

const refEquality: EqualityFn<any> = (a, b) => a === b

// 下面的代码保留范型，Selected
export function createSelectorHook(
  context = ReactReduxContext
): <TState = unknown, Selected = unknown>(
  selector: (state: TState) => Selected,
  equalityFn?: EqualityFn<Selected>
) => Selected {
  const useReduxContext =
    context === ReactReduxContext
      ? useDefaultReduxContext
      : () => useContext(context)

  return function useSelector(
    selector,
    equalityFn = refEquality
  ) {

    const { store, subscription, getServerState } = useReduxContext()!

    const selectedState = useSyncExternalStoreWithSelector(
      subscription.addNestedSub,
      store.getState,
      getServerState || store.getState,
      selector,
      equalityFn
    )

    useDebugValue(selectedState) // 标记

    return selectedState
  }
}

/**
 * A hook to access the redux store's state. This hook takes a selector function
 * as an argument. The selector is called with the store state.
 *
 * This hook takes an optional equality comparison function as the second parameter
 * that allows you to customize the way the selected state is compared to determine
 * whether the component needs to be re-rendered.
 *
 * @param {Function} selector the selector function
 * @param {Function=} equalityFn the function that will be used to determine equality
 *
 * @returns {any} the selected state
 *
 * @example
 *
 * import React from 'react'
 * import { useSelector } from 'react-redux'
 *
 * export const CounterComponent = () => {
 *   const counter = useSelector(state => state.counter)
 *   return <div>{counter}</div>
 * }
 */
export const useSelector = /*#__PURE__*/ createSelectorHook()
```
## useStore、createStoreHook
```ts 

// 1.用钩子工厂创建了个钩子
// 2.从   const { store } = useReduxContext()! 获取store

/**
 * Hook factory, which creates a `useStore` hook bound to a given context.
 *
 * @param {React.Context} [context=ReactReduxContext] Context passed to your `<Provider>`.
 * @returns {Function} A `useStore` hook bound to the specified context.
 */
export function createStoreHook<
  S = unknown,
  A extends BasicAction = AnyAction
  // @ts-ignore
>(context?: Context<ReactReduxContextValue<S, A>> = ReactReduxContext) {
  const useReduxContext =
    // @ts-ignore
    context === ReactReduxContext
      ? useDefaultReduxContext
      : () => useContext(context)
  return function useStore<
    State = S,
    Action extends BasicAction = A
    // @ts-ignore
  >() {
    const { store } = useReduxContext()!
    // @ts-ignore
    return store as Store<State, Action>
  }
}

/**
 * A hook to access the redux store.
 *
 * @returns {any} the redux store
 *
 * @example
 *
 * import React from 'react'
 * import { useStore } from 'react-redux'
 *
 * export const ExampleComponent = () => {
 *   const store = useStore()
 *   return <div>{store.getState()}</div>
 * }
 */
export const useStore = /*#__PURE__*/ createStoreHook()
```

## connect

 见：react-redux 源码2