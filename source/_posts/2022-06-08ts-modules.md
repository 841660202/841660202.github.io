---
title: 9.Typescript手册 模块
date: 2022-06-08 22:47:47
categories: typescript
tags: [typescript]
cover: https://img0.baidu.com/it/u=86492913,3057347241&fm=253&fmt=auto&app=138&f=JPEG?w=499&h=208
---

JavaScript has a long history of different ways to handle modularizing code. TypeScript having been around since 2012, has implemented support for a lot of these formats, but over time the community and the JavaScript specification has converged on a format called ES Modules (or ES6 modules). You might know it as the import/export syntax.
`JavaScript 有很长的历史，不同的方式来处理代码的模块化。TypeScript 从 2012 年开始，就支持了大量的模块化格式，但是，在过去的时间，社区和 JavaScript 规范一致地聚合了一个模块化格式，叫做 ES Modules（或 ES6 模块）。你可能会知道它叫做 import/export 语法。`

ES Modules was added to the JavaScript spec in 2015, and by 2020 had broad support in most web browsers and JavaScript runtimes.
`ES Modules 在 2015 年添加到 JavaScript 规范，2020 年已经有广泛的支持在大部分的 web 浏览器和 JavaScript 运行时。`
For focus, the handbook will cover both ES Modules and its popular pre-cursor CommonJS module.exports = syntax, and you can find information about the other module patterns in the reference section under Modules.
`为了获得焦点，本手册将介绍 ES Modules 和其常用的先行模块 CommonJS module.exports = 同义词，并且你可以在 Modules 下的参考节中找到其他模块模式的信息。`

## How JavaScript Modules are Defined

In TypeScript, just as in ECMAScript 2015, any file containing a top-level import or export is considered a module.
`在 TypeScript 中，只要文件包含一个顶层的 import 或 export 就被视为一个模块。`
Conversely, a file without any top-level import or export declarations is treated as a script whose contents are available in the global scope (and therefore to modules as well).
`反之，一个没有顶层的 import 或 export 声明的文件就被视为一个脚本，其内容可以在全局作用域中使用（并且也可以作为模块使用）。`
Modules are executed within their own scope, not in the global scope. This means that variables, functions, classes, etc. declared in a module are not visible outside the module unless they are explicitly exported using one of the export forms. Conversely, to consume a variable, function, class, interface, etc. exported from a different module, it has to be imported using one of the import forms.
`模块是在自己的作用域中执行的，不是在全局作用域中执行的。这意味着在模块中声明的变量，函数，类，接口等等，只有在显式的使用 export 声明的时候才能在模块外被访问。反之，要从其他模块中消费一个变量，函数，类，接口等等，必须使用 import 声明来导入。`

## Non-modules

`非模块`
Before we start, it’s important to understand what TypeScript considers a module. The JavaScript specification declares that any JavaScript files without an export or top-level await should be considered a script and not a module.
`在开始之前，我们需要明白 TypeScript 认为什么是模块。JavaScript 规范定义了任何没有 export 或 top-level await 的 JavaScript 文件都被视为脚本而不是模块。`
Inside a script file variables and types are declared to be in the shared global scope, and it’s assumed that you’ll either use the outFile compiler option to join multiple input files into one output file, or use multiple <script> tags in your HTML to load these files (in the correct order!).
`在脚本文件中，变量和类型被声明为共享的全局作用域，并且我们假设你会使用 outFile 编译选项将多个输入文件合并成一个输出文件，或者使用多个 <script> 标签在你的 HTML 中加载这些文件（按照正确的顺序）。`
If you have a file that doesn’t currently have any imports or exports, but you want to be treated as a module, add the line:
`如果你有一个文件，它目前没有任何 import 或 export 声明，但是你想被视为一个模块，那么添加这一行：`

```ts
export {};
```

which will change the file to be a module exporting nothing. This syntax works regardless of your module target.
`这种语法对于你的模块目标无论如何都是可行的。`

## Modules in TypeScript

`TypeScript 中的模块`
Additional Reading:
`附加阅读：`
Impatient JS (Modules)
`不知道模块的 TypeScript`
MDN: JavaScript Modules
`MDN：JavaScript 模块`
There are three main things to consider when writing module-based code in TypeScript:
`在 TypeScript 中写模块基础的代码时，要考虑三个主要问题：`
Syntax: What syntax do I want to use to import and export things?
`语法：我想要使用什么语法来导入和导出东西？`
Module Resolution: What is the relationship between module names (or paths) and files on disk?
`模块解析：模块名（或路径）和磁盘上的文件之间的关系是什么？`
Module Output Target: What should my emitted JavaScript module look like?
`模块输出目标：我的输出的 JavaScript 模块应该怎样看？`

## ES Module Syntax

`ES 模块语法`
A file can declare a main export via export default:
`一个文件可以通过 export default 声明一个主要的导出：`

```ts
// @filename: hello.ts
export default function helloWorld() {
  console.log("Hello, world!");
}
```

This is then imported via:
`这是通过以下方式导入的：`

```ts
import helloWorld from "./hello.js";
helloWorld();
```

In addition to the default export, you can have more than one export of variables and functions via the export by omitting default:
`除了默认导出，你还可以有多个导出的变量和函数，通过将 default 去掉：`

```ts
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;

export class RandomNumberGenerator {}

export function absolute(num: number) {
if (num < 0) return num \* -1;
  return num;
}
```

These can be used in another file via the import syntax:
`这些可以在另一个文件中通过导入语法使用：`

```ts
import { pi, phi, absolute } from "./maths.js";

console.log(pi);
const absPhi = absolute(phi);

// const absPhi: number;
```

## Additional Import Syntax

`附加导入语法`
An import can be renamed using a format like import {old as new}:
`一个导入可以通过这样的格式：import {old as new}：`

```ts
import { pi as π } from "./maths.js";

console.log(π);

// (alias) var π: number
// import π
```

You can mix and match the above syntax into a single import:
`你可以混合这些语法到一个单独的导入：`

```ts
// @filename: maths.ts
export const pi = 3.14;
export default class RandomNumberGenerator {}

// @filename: app.ts
import RandomNumberGenerator, { pi as π } from "./maths.js";

RandomNumberGenerator;

// (alias) class RandomNumberGenerator
// import RandomNumberGenerator

console.log(π);

// (alias) const π: 3.14
// import π
```

You can take all of the exported objects and put them into a single namespace using \* as name:
`你可以将所有导出的对象放到一个单独的命名空间，使用 \* as name：`

```ts
// @filename: app.ts
import \* as math from "./maths.js";

console.log(math.pi);
const positivePhi = math.absolute(math.phi);

// const positivePhi: number
```

You can import a file and not include any variables into your current module via import "./file":
`你可以通过 import "./file" 导入一个文件，并且不包含任何变量到当前模块：`

```ts
// @filename: app.ts
import "./maths.js";

console.log("3.14");
```

In this case, the import does nothing. However, all of the code in maths.ts was evaluated, which could trigger side-effects which affect other objects.
`在这种情况下，导入并没有什么事情。但是，maths.ts 中的所有代码都会被评估，这可能会触发其他对象的副作用。`

## TypeScript Specific ES Module Syntax

`TypeScript 特定的 ES 模块语法`
Types can be exported and imported using the same syntax as JavaScript values:
`类型可以使用相同的语法来导出和导入 JavaScript 值：`

```ts
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };

export interface Dog {
  breeds: string[];
  yearOfBirth: number;
}

// @filename: app.ts
import { Cat, Dog } from "./animal.js";
type Animals = Cat | Dog;
```

TypeScript has extended the import syntax with two concepts for declaring an import of a type:
`TypeScript 已经扩展了导入类型的语法，它有两个概念来声明导入类型：`

```ts
import type
// Which is an import statement which can only import types:
// 只能导入类型的导入语句：
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
// 'createCatName' cannot be used as a value because it was imported using 'import type'.
// 'createCatName' 不能被用作值，因为它被导入使用了 'import type'。
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "fluffy";

// @filename: valid.ts
import type { Cat, Dog } from "./animal.js";
export type Animals = Cat | Dog;

// @filename: app.ts
import type { createCatName } from "./animal.js";
const name = createCatName();
```

Inline type imports
`内联类型导入`

TypeScript 4.5 also allows for individual imports to be prefixed with type to indicate that the imported reference is a type:
`TypeScript 4.5 可以使用 type 前缀来声明导入的引用是一个类型：`

```ts
// @filename: app.ts
import { createCatName, type Cat, type Dog } from "./animal.js";

export type Animals = Cat | Dog;
const name = createCatName();
```

Together these allow a non-TypeScript transpiler like Babel, swc or esbuild to know what imports can be safely removed.
`这些同时允许一个非 TypeScript 编译器，如 Babel、swc 或 esbuild 知道哪些导入可以安全地移除。`

## ES Module Syntax with CommonJS Behavior

`ES 模块语法与 CommonJS 行为`
TypeScript has ES Module syntax which directly correlates to a CommonJS and AMD require. Imports using ES Module are for most cases the same as the require from those environments, but this syntax ensures you have a 1 to 1 match in your TypeScript file with the CommonJS output:
`TypeScript 有 ES 模块语法，它相对于 CommonJS 和 AMD require。使用 ES Module 的导入是为了大多数情况下与这些环境的 require 一致，但这种语法确保了你的 TypeScript 文件与 CommonJS 输出有一个 1 到 1 的匹配。`

```ts
import fs = require("fs");
const code = fs.readFileSync("hello.ts", "utf8");
```

You can learn more about this syntax in the modules reference page.
`你可以在模块参考页面了解更多关于这种语法。`
## CommonJS Syntax
`CommonJS 语法`

CommonJS is the format which most modules on npm are delivered in. Even if you are writing using the ES Modules syntax above, having a brief understanding of how CommonJS syntax works will help you debug easier.
`CommonJS 是 npm 上大多数模块的格式。即使你正在使用上面的 ES 模块语法，也会有一个简单的了解 CommonJS 语法的方式帮助你调试更容易。`

## Exporting
`导出`

Identifiers are exported via setting the exports property on a global called module.
`标识符通过设置 module.exports 属性来导出。`

```ts
function absolute(num: number) {
    if (num < 0) return num \* -1;
    return num;
}

module.exports = {
  pi: 3.14,
  squareTwo: 1.41,
  phi: 1.61,
  absolute,
};
```

Then these files can be imported via a require statement:
`然后，这些文件可以通过 require 语句来导入：`

```ts
const maths = require("maths");
maths.pi;

// any;
```

Or you can simplify a bit using the destructuring feature in JavaScript:
`或者，你可以使用 JavaScript 的解构特性来简化一些：`

```ts
const { squareTwo } = require("maths");
squareTwo;

// const squareTwo: any;
```

## CommonJS and ES Modules interop
`CommonJS 和 ES 模块的互操作`

There is a mis-match in features between CommonJS and ES Modules regarding the distinction between a default import and a module namespace object import. TypeScript has a compiler flag to reduce the friction between the two different sets of constraints with esModuleInterop.
`在 CommonJS 和 ES 模块之间存在不匹配的特性，关于默认导入和模块命名空间对象导入的区别。TypeScript 有一个编译器标志来减少 CommonJS 和 ES 模块之间的摩擦。`

## TypeScript’s Module Resolution Options
`TypeScript 的模块解析选项`

Module resolution is the process of taking a string from the import or require statement, and determining what file that string refers to.
`模块解析是从 import 或 require 语句中获取字符串，并确定该字符串所引用的文件。`

TypeScript includes two resolution strategies: Classic and Node. Classic, the default when the compiler option module is not commonjs, is included for backwards compatibility. The Node strategy replicates how Node.js works in CommonJS mode, with additional checks for .ts and .d.ts.
`TypeScript 包含两种解析策略：经典和 Node。经典，默认情况下，当编译器选项 module 不是 commonjs 时，包含了向后兼容性。Node 策略重复了 Node.js 在 CommonJS 模式下工作的方式，并且添加了 .ts 和 .d.ts 的检查。`
There are many TSConfig flags which influence the module strategy within TypeScript: moduleResolution, baseUrl, paths, rootDirs.
`在 TypeScript 中，有很多 TSConfig 标志影响模块策略：moduleResolution、baseUrl、paths、rootDirs。`
For the full details on how these strategies work, you can consult the Module Resolution.
`关于如何工作的详细信息，你可以参考模块解析。`

## TypeScript’s Module Output Options

`TypeScript 的模块输出选项`
There are two options which affect the emitted JavaScript output:
`有两个影响输出的 JavaScript 的选项：`

- target which determines which JS features are downleveled (converted to run in older JavaScript runtimes) and which are left intact
  `target 是指定哪些 JS 特性被下游（转换为在旧的 JavaScript 运行时运行），哪些被保留。`
- module which determines what code is used for modules to interact with each other
  `module 是指定哪些代码用于模块交互。`

Which target you use is determined by the features available in the JavaScript runtime you expect to run the TypeScript code in. That could be: the oldest web browser you support, the lowest version of Node.js you expect to run on or could come from unique constraints from your runtime - like Electron for example.
`哪个目标你使用是由你期望在 JavaScript 运行时运行 TypeScript 代码的功能决定的。这可能是：最旧的 web 浏览器，最低版本的 Node.js，或者来自你运行时的唯一约束 - 例如，Electron。`
All communication between modules happens via a module loader, the compiler option module determines which one is used. At runtime the module loader is responsible for locating and executing all dependencies of a module before executing it.
`模块之间的通信都是通过模块加载器来完成的，编译器选项 module 是指定哪个被使用。在运行时，模块加载器负责定位并执行所有模块的依赖之前执行它。`
For example, here is a TypeScript file using ES Modules syntax, showcasing a few different options for module:
`例如，这里是一个使用 ES Modules 语法的 TypeScript 文件，展示了一些模块的选项：`

```ts
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi _ 2;
```

## ES2020

```ts
import { valueOfPi } from "./constants.js";
export const twoPi = valueOfPi _ 2;
```

## CommonJS

```ts
"use strict";
Object.defineProperty(exports, "\_\_esModule", { value: true });
exports.twoPi = void 0;
const constants_js_1 = require("./constants.js");
exports.twoPi = constants_js_1.valueOfPi \* 2;
```

## UMD

```ts
(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  }
  else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "./constants.js"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "\_\_esModule", { value: true });
  exports.twoPi = void 0;
  const constants_js_1 = require("./constants.js");
  exports.twoPi = constants_js_1.valueOfPi \* 2;
});

```

Note that ES2020 is effectively the same as the original index.ts.
`ES2020 是一样的于原始 index.ts。`
You can see all of the available options and what their emitted JavaScript code looks like in the TSConfig Reference for module.
`你可以看到所有可用的选项和他们的输出 JavaScript 代码的样子在 module 的 TSConfig 参考中。`

## TypeScript namespaces

`TypeScript 命名空间`
TypeScript has its own module format called namespaces which pre-dates the ES Modules standard. This syntax has a lot of useful features for creating complex definition files, and still sees active use in DefinitelyTyped. While not deprecated, the majority of the features in namespaces exist in ES Modules and we recommend you use that to align with JavaScript’s direction. You can learn more about namespaces in the namespaces reference page.
`TypeScript 有自己的模块格式命名空间，它是先期的 ES Modules 标准。这种语法具有很多有用的功能创建复杂的定义文件，仍然在 DefinitelyTyped 中有活跃使用。尽管不被弃用，大多数的功能在命名空间中存在于 ES Modules，我们建议你使用它与 JavaScript 的方向对齐。你可以在命名空间参考页面上了解更多关于命名空间。`
