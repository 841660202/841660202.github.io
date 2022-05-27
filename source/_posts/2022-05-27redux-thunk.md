---
title: redux-thunk源码
date: 2022-05-27 09:21:50
categories: redux
tags: [redux-thunk,redux]
cover:
---

## 源码版本

[v2.4.1](https://github.com/reduxjs/redux-thunk/releases/tag/v2.4.1)

## 用途
- 通过redux源码applyMiddleware了解到，是对store.dispatch进行增强
- 可以接受一个返回函数的action creator。如果这个action creator 返回的是一个函数，就执行它，如果不是，就按照原来的next(action)执行。
- 可以在这个函数中执行一些异步的操作

```ts
export function addCount() {
  return {type: ADD_COUNT}
} 
export function addCountAsync() {
  return dispatch => {
    setTimeout( () => {
      dispatch(addCount())
    },2000)
  }
}
```
- addCountAsync函数就返回了一个函数，将dispatch作为函数的第一个参数传递进去，在函数内进行异步操作就可以了。
## package.json

- 这个文件结构与redux、react-redux相比，没有什么特别之处，这里及以后如无必要不在进行阅读
- 简单扫一眼就好
## 源码

```ts
/** A function that accepts a potential "extra argument" value to be injected later,
 * and returns an instance of the thunk middleware that uses that value
 */
/** 一个函数接收一个可能的"extra argument"值，并返回一个thunk中间件，它使用这个值 */
function createThunkMiddleware<
  State = any,
  BasicAction extends Action = AnyAction,
  ExtraThunkArg = undefined
>(extraArgument?: ExtraThunkArg) {
  // Standard Redux middleware definition pattern:
  // 标准Redux中间件定义模式:
  // See: https://redux.js.org/tutorials/fundamentals/part-4-store#writing-custom-middleware
  const middleware: ThunkMiddleware<State, BasicAction, ExtraThunkArg> =
    ({ dispatch, getState }) => (next) =>  (action) => {
      // The thunk middleware looks for any functions that were passed to `store.dispatch`.
      // If this "action" is really a function, call it and return the result.
      // 这个thunk中间件会查找store.dispatch传入的任何函数。如果这个"action"是一个函数，调用它并返回结果。
      if (typeof action === "function") {
        // Inject the store's `dispatch` and `getState` methods, as well as any "extra arg"
        // 注入store的dispatch和getState方法，以及任意的"extra arg"
        return action(dispatch, getState, extraArgument);
      }
      // 否则，像往常一样将操作传递给中间件链
      // Otherwise, pass the action down the middleware chain as usual
      return next(action);
    };
  return middleware;
}
```
**中间件模式**

柯里化：将一个函数的参数分解成多个参数，并且返回一个新的函数，这个新的函数可以被调用，并且返回原函数的结果。

```ts
const anotherExampleMiddleware = storeAPI => next => action => {
  // Do something in here, when each action is dispatched

  return next(action)
}
```
**storeAPI**

```ts
// storeAPI

const store = {
  dispatch: dispatch as Dispatch<A>,
  subscribe,
  getState,
  replaceReducer,
  [$$observable]: observable
} as unknown as Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext
```
*工厂模式*

```ts

const thunk = createThunkMiddleware() as ThunkMiddleware & {
  withExtraArgument<
    ExtraThunkArg,
    State = any,
    BasicAction extends Action = AnyAction
  >(
    extraArgument: ExtraThunkArg
  ): ThunkMiddleware<State, BasicAction, ExtraThunkArg>
}

// Attach the factory function so users can create a customized version
// with whatever "extra arg" they want to inject into their thunks
// 尝试将工厂函数附加到用户可以创建任何额外的"extra arg"的thunk中间件
thunk.withExtraArgument = createThunkMiddleware

export default thunk
```
## 参考
[redux-thunk源码](https://github.com/reduxjs/redux-thunk/blob/master/src/index.ts)
[Redux中间件之redux-thunk使用详解](https://blog.csdn.net/hsany330/article/details/105951197)
