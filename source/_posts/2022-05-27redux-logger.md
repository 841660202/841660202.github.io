---
title: redux-logger源码
date: 2022-05-27 13:52:01
categories: react
tags: [redux, 源码]
cover:
---

## redux 日志中间件
```js
.
├── core.js
├── defaults.js
├── diff.js
├── helpers.js // 一些帮助函数
└── index.js

0 directories, 5 files
```
## defaultLogger

**v3 版本，破坏性变更**

之前

```ts
import createLogger from "redux-logger";
```

之后

```tsx
import { createLogger } from "redux-logger";
```

**源码**

```js
// src/index.js

const defaultLogger = ({ dispatch, getState } = {}) => {
  if (typeof dispatch === "function" || typeof getState === "function") {
    // createLogger，柯里化 工厂模式
    return createLogger()({ dispatch, getState });
  }
  // 如果没有传递dispatch和getState，打印错误信息
  // v3版本，破坏性变更, 根据《语义化版本》不看内容也知道有破坏性变更
  // Since 3.0.0 redux-logger exports by default logger with default settings
  // import createLogger from 'redux-logger' => import { createLogger } from 'redux-logger'
  console.error(`
[redux-logger v3] BREAKING CHANGE
[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.
[redux-logger v3] Change
[redux-logger v3] import createLogger from 'redux-logger'
[redux-logger v3] to
[redux-logger v3] import { createLogger } from 'redux-logger'
`);
};

export { defaults, createLogger, defaultLogger as logger };

export default defaultLogger;
```

## createLogger

- 使用传入的 options， 创建日志记录器

```js
/**
 * Creates logger with following options
 * 创建日志记录器，配置如下：
 * @namespace
 * @param {object} options - options for logger
 * @param {string | function | object} options.level - console[level] 日志级别
 * @param {boolean} options.duration - print duration of each action? 打印每个action的时间
 * @param {boolean} options.timestamp - print timestamp with each action? 打印每个action的时间戳
 * @param {object} options.colors - custom colors 定制颜色
 * @param {object} options.logger - implementation of the `console` API 打印日志的实现
 * @param {boolean} options.logErrors - should errors in action execution be caught, logged, and re-thrown? 是否捕获action执行错误，打印错误，并重新抛出
 * @param {boolean} options.collapsed - is group collapsed? 是否折叠组
 * @param {boolean} options.predicate - condition which resolves logger behavior 条件，决定日志记录器行为
 * @param {function} options.stateTransformer - transform state before print 打印前的状态转换
 * @param {function} options.actionTransformer - transform action before print 打印前的action转换
 * @param {function} options.errorTransformer - transform error before print  打印前的错误转换
 *
 * @returns {function} logger middleware 返回中间件
 */
function createLogger(options = {}) {
  const loggerOptions = Object.assign({}, defaults, options);

  const {
    logger,
    stateTransformer,
    errorTransformer,
    predicate,
    logErrors,
    diffPredicate,
  } = loggerOptions;

  // Return if 'console' object is not defined
  // 如果'console'对象未定义，返回
  if (typeof logger === "undefined") {
    return () => (next) => (action) => next(action);
  }

  // Detect if 'createLogger' was passed directly to 'applyMiddleware'.
  // 判断是否传递给applyMiddleware
  if (options.getState && options.dispatch) {
    // eslint-disable-next-line no-console
    console.error(`[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:
// Logger with default options
import { logger } from 'redux-logger'
const store = createStore(
  reducer,
  applyMiddleware(logger)
)
// Or you can create your own logger with custom options http://bit.ly/redux-logger-options
import { createLogger } from 'redux-logger'
const logger = createLogger({
  // ...options
});
const store = createStore(
  reducer,
  applyMiddleware(logger)
)
`);
    // 中间件书写套路
    return () => (next) => (action) => next(action);
  }

  const logBuffer = [];

  return ({ getState }) =>
    (next) =>
    (action) => {
      // Exit early if predicate function returns 'false' 如果predicate函数返回false，退出
      if (typeof predicate === "function" && !predicate(getState, action)) {
        return next(action);
      }

      const logEntry = {};

      logBuffer.push(logEntry);

      logEntry.started = timer.now();
      logEntry.startedTime = new Date();
      logEntry.prevState = stateTransformer(getState());
      logEntry.action = action;

      let returnedValue;
      if (logErrors) {
        try {
          returnedValue = next(action);
        } catch (e) {
          logEntry.error = errorTransformer(e);
        }
      } else {
        returnedValue = next(action);
      }

      logEntry.took = timer.now() - logEntry.started;
      logEntry.nextState = stateTransformer(getState());

      const diff =
        loggerOptions.diff && typeof diffPredicate === "function"
          ? diffPredicate(getState, action)
          : loggerOptions.diff;

      printBuffer(logBuffer, Object.assign({}, loggerOptions, { diff }));
      logBuffer.length = 0;

      if (logEntry.error) throw logEntry.error;
      return returnedValue;
    };
}
```

**defaults 默认配置**

```js
// src/default.js
export default {
  level: "log",
  logger: console,
  logErrors: true,
  collapsed: undefined,
  predicate: undefined,
  duration: false,
  timestamp: true,
  stateTransformer: (state) => state,
  actionTransformer: (action) => action,
  errorTransformer: (error) => error,
  colors: {
    title: () => "inherit",
    prevState: () => "#9E9E9E",
    action: () => "#03A9F4",
    nextState: () => "#4CAF50",
    error: () => "#F20404",
  },
  diff: false,
  diffPredicate: undefined,

  // Deprecated options 已废弃配置
  transformer: undefined,
};
// 字段释义
/**
 * Creates logger with following options
 * 创建日志记录器，配置如下：
 * @namespace
 * @param {object} options - options for logger
 * @param {string | function | object} options.level - console[level] 日志级别
 * @param {boolean} options.duration - print duration of each action? 打印每个action的时间
 * @param {boolean} options.timestamp - print timestamp with each action? 打印每个action的时间戳
 * @param {object} options.colors - custom colors 定制颜色
 * @param {object} options.logger - implementation of the `console` API 打印日志的实现
 * @param {boolean} options.logErrors - should errors in action execution be caught, logged, and re-thrown? 是否捕获action执行错误，打印错误，并重新抛出
 * @param {boolean} options.collapsed - is group collapsed? 是否折叠组
 * @param {boolean} options.predicate - condition which resolves logger behavior 条件，决定日志记录器行为
 * @param {function} options.stateTransformer - transform state before print 打印前的状态转换
 * @param {function} options.actionTransformer - transform action before print 打印前的action转换
 * @param {function} options.errorTransformer - transform error before print  打印前的错误转换
 *
 * @returns {function} logger middleware 返回中间件
 */
```

**奇怪**

- 这两个配置在测试文件中，没找到相关测试代码

```js
 // 配置
 diff: false, //
 diffPredicate: undefined,

 // ...

 const diff =
       loggerOptions.diff && typeof diffPredicate === "function"
         ? diffPredicate(getState, action)
         : loggerOptions.diff;
 // 打印日志中
 printBuffer(logBuffer, Object.assign({}, loggerOptions, { diff }));

 // src/core.js printBuffer的定义
function printBuffer(buffer, options) {
   const {
     // ...
       diff,
   } = options;
   // 如果开启
   if (diff) {
     // 执行了 diffLogger
     diffLogger(prevState, nextState, logger, isCollapsed);
   }
}
// src/diff.js
export default function diffLogger(prevState, newState, logger, isCollapsed) {
  // import differ from 'deep-diff';计算对象差异化的包
  const diff = differ(prevState, newState);

  try {
    if (isCollapsed) {
      logger.groupCollapsed('diff');
    } else {
      logger.group('diff');
    }
  } catch (e) {
    logger.log('diff');
  }
  // 有差异执行输出，这个差异包含类型kind E:编辑 N:新增 D:删除 A:数组
  // dictionary为对象，对kind值进行枚举
  // 遍历输出
  if (diff) {
    diff.forEach((elem) => {
      const { kind } = elem;
      const output = render(elem);

      logger.log(`%c ${dictionary[kind].text}`, style(kind), ...output);
    });
  } else {
    logger.log('—— no diff ——');
  }

  try {
    logger.groupEnd();
  } catch (e) {
    logger.log('—— diff end —— ');
  }
}

```

## helpers 

```js
// repeat + pad = padLeft 左侧补零， es多少有个api
export const repeat = (str, times) => (new Array(times + 1)).join(str);

export const pad = (num, maxLength) => repeat('0', maxLength - num.toString().length) + num;
// 时间格式化
export const formatTime = time => `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`;

// Use performance API if it's available in order to get better precision
export const timer =
(typeof performance !== 'undefined' && performance !== null) && typeof performance.now === 'function' ?
  performance :
  Date;
```
**运行测试下**


```js
const repeat = (str, times) => (new Array(times + 1)).join(str);

const pad = (num, maxLength) => repeat('0', maxLength - num.toString().length) + num;

const formatTime = time => `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`;

console.log(formatTime(new Date()))
// 输出
18:58:15.667

```

## 源码图
![](http://t-blog-images.aijs.top/img/20220527190102.webp)
## deep-diff

- 看下两个对象比较的事例

```js
var lhs = {
	name: 'my object',
	description: 'it\'s an object!',
	details: {
		it: 'has',
		an: 'array',
		with: ['a', 'few', 'elements']
	}
};

var rhs = {
	name: 'updated object',
	description: 'it\'s an object!',
	details: {
		it: 'has',
		an: 'array',
		with: ['a', 'few', 'more', 'elements', { than: 'before' }]
	}
};

var differences = deep.diff(lhs, rhs);


// 输出


27 May 17:27:12 - [
  DiffEdit {
    kind: 'E',
    path: [ 'name' ],
    lhs: 'my object',
    rhs: 'updated object'
  },
  DiffArray {
    kind: 'A',
    path: [ 'details', 'with' ],
    index: 4,
    item: DiffNew { kind: 'N', rhs: { than: 'before' } }
  },
  DiffArray {
    kind: 'A',
    path: [ 'details', 'with' ],
    index: 3,
    item: DiffNew { kind: 'N', rhs: 'elements' }
  },
  DiffEdit {
    kind: 'E',
    path: [ 'details', 'with', 2 ],
    lhs: 'elements',
    rhs: 'more'
  }
]
```
