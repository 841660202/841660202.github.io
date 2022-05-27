---
title: redux-thunk源码
date: 2022-05-27 09:21:50
categories: redux
tags: [redux]
cover:
---

## 源码版本

[v2.4.1](https://github.com/reduxjs/redux-thunk/releases/tag/v2.4.1)

## 用途

## 源码

```ts
/** A function that accepts a potential "extra argument" value to be injected later,
 * and returns an instance of the thunk middleware that uses that value
 */
function createThunkMiddleware<
  State = any,
  BasicAction extends Action = AnyAction,
  ExtraThunkArg = undefined
>(extraArgument?: ExtraThunkArg) {
  // Standard Redux middleware definition pattern:
  // See: https://redux.js.org/tutorials/fundamentals/part-4-store#writing-custom-middleware
  const middleware: ThunkMiddleware<State, BasicAction, ExtraThunkArg> =
    ({ dispatch, getState }) =>
    (next) =>
    (action) => {
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
