---
title: 10.Typescript 工具类型
date: 2022-06-08 22:49:28
categories: typescript
tags: [typescript]
cover: https://img0.baidu.com/it/u=86492913,3057347241&fm=253&fmt=auto&app=138&f=JPEG?w=499&h=208
---

TypeScript provides several utility types to facilitate common type transformations. These utilities are available globally.
`Typescript提供了一些帮助类型转换的工具类型，这些工具类型可以在全局范围内使用。`

## Partial<Type>

Released: 2.1

Constructs a type with all properties of Type set to optional. This utility will return a type that represents all subsets of a given type.
`构造一个具有所有属性类型的可选属性的类型。这个工具将返回一个表示给定类型的所有子集的类型。`

```ts
// Example
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};

const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
```

## 原理

**使用映射类型（Mapped Types）**

- 首先通过 keyof T，遍历出类型 T 的所有属性，然后通过 in 操作符进行遍历，最后在属性后加上?，将属性变为可选属性。
- 注意 这个 `in` 不是`收缩类型操作符in` ,而是`映射类型`中的`in`

```ts
// https://github.com/microsoft/TypeScript/blob/HEAD/src/lib/es5.d.ts#L1517
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

## Required<Type>

Released:2.8

Constructs a type consisting of all properties of Type set to required. The opposite of Partial.
`构造一个具有所有属性类型的必需属性的类型。与Partial相反。`

```ts
// Example
interface Props {
a?: number;
b?: string;
}

const obj: Props = { a: 5 };

const obj2: Required<Props> = { a: 5 };
Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.
```

## 原理

原理：**使用映射类型（Mapped Types）** 用于将 T 类型的所有属性设置为必选状态，首先通过 keyof T，取出类型 T 的所有属性， 然后通过 in 操作符进行遍历，最后在属性后的 ? 前加上 -，将属性变为必选属性。

这里顺便讲下-这个符号的作用，这是 TypeScript 2.8 为映射类型增加了添加或删除特定修饰符的能力。具体来说，readonly 和?映射类型中的属性修饰符现在可以加上+或-前缀，以指示应该添加或删除该修饰符，当然一般+号是可以省略的。[ts 官网 类型操作符/映射类型](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers:~:text=You%20can%20remove%20or%20add%20these%20modifiers%20by%20prefixing%20with%20%2D%20or%20%2B.%20If%20you%20don%E2%80%99t%20add%20a%20prefix%2C%20then%20%2B%20is%20assumed.)

```ts
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

## Readonly<Type>

Released:2.1

Constructs a type with all properties of Type set to readonly, meaning the properties of the constructed type cannot be reassigned.
`构造一个具有所有属性类型的只读属性的类型。`

```ts
// Example
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
};

todo.title = "Hello";
// Cannot assign to 'title' because it is a read-only property.
```

This utility is useful for representing assignment expressions that will fail at runtime (i.e. when attempting to reassign properties of a frozen object).
`这个工具是用来表示在运行时将失败的赋值表达式的用途（即尝试重新分配一个冻结对象的属性）。`
**Object.freeze**

```ts
function freeze<Type>(obj: Type): Readonly<Type>;
```

## 原理

原理：**使用映射类型（Mapped Types）** 接收两个泛型，K 为 string | number | symbol 可以继承的类型，这三个也是对象 key 所支持的基础类型，然后通过 in 操作符对 K 进行遍历，每一个属性的类型为 T 类型。

```ts
type Record<K extends string | number | symbol, T> = {
  [P in K]: T;
};
```

## Record<Keys, Type>

Released:2.1

Constructs an object type whose property keys are Keys and whose property values are Type. This utility can be used to map the properties of a type to another type.
`用于构造一个对象类型，它所有的key(键)都是Keys类型，它所有的value(值)都是Type类型。这个工具类型可以被用于映射一个类型的属性到另一个类型。`

```ts
// Example
interface CatInfo {
  age: number;
  breed: string;
}

type CatName = "miffy" | "boris" | "mordred";

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};

cats.boris;

const cats: Record<CatName, CatInfo>;
```

## 原理

**使用映射类型（Mapped Types）**

接收两个泛型，K 为 string | number | symbol 可以继承的类型，这三个也是对象 key 所支持的基础类型，然后通过 in 操作符对 K 进行遍历，每一个属性的类型为 T 类型。

```ts
type Record<K extends string | number | symbol, T> = {
  [P in K]: T;
};
```

## Pick<Type, Keys>

Released:2.1

Constructs a type by picking the set of properties Keys (string literal or union of string literals) from Type.
`用于构造一个对象类型，它所有的key(键)都是Keys类型，它所有的value(值)都是Type类型。这个工具类型可以被用于映射一个类型的属性到另一个类型。`

```ts
// Example
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

todo;

// const todo: TodoPreview;
```

## 原理

从 T 类型中提取部分属性，作为新的返回类型。

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

## Omit<Type, Keys>

Released:3.5

Constructs a type by picking all properties from Type and then removing Keys (string literal or union of string literals).
`用于构造一个类型，它是从Type类型里面过滤了一些属性Keys(Keys是字符串字面量 或者 字符串字面量的联合类型)`

```ts
// Example
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  createdAt: 1615544252770,
};

todo;

// const todo: TodoPreview;

type TodoInfo = Omit<Todo, "completed" | "createdAt">;

const todoInfo: TodoInfo = {
  title: "Pick up kids",
  description: "Kindergarten closes at 5pm",
};

todoInfo;

// const todoInfo: TodoInfo
```

## 原理

使用 **keyof 类型操作符号**、**extends**、**类型操作符 Exclude**、 **类型操作符 Pick**

- 结合 Pick 和 Exclude 方法，提取出不含 K 属性的类型。
- 1.keyof T 返回的是联合类型
- 2.[extends](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- 3.Exclude<T, K> 返回的是联合类型， 可以接收一个联合类型和一个联合类型，返回一个联合类型
- 4.把 K 中的 key, 从 T 中排除掉，剩下的就是 Omit 的类型。

```ts
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

## Exclude<UnionType, ExcludedMembers>

Released:2.8

Constructs a type by excluding from UnionType all union members that are assignable to ExcludedMembers.
`用于构造一个类型，它是从UnionType联合类型里面排除了所有可以赋给ExcludedMembers的类型。`

```ts
// Example;
type T0 = Exclude<"a" | "b" | "c", "a">;
// type T0 = "b" | "c";

type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
// type T1 = "c";

type T2 = Exclude<string | number | (() => void), Function>;
// type T2 = string | number;
```

## extends 关键字

不学 extends，Exclude 和 Extract，很难理解

extends 关键字在 TS 编程中出现的频率挺高的，而且`不同场景下代表的含义不一样`，特此总结一下：

- 表示继承/拓展的含义

- 表示约束的含义

- 表示分配的含义

<hr/>

### **表示继承/拓展**

extends 是 ts 里一个很常见的关键字，同时也是 es6 里引入的一个新的关键字。在 js 里，extends 一般和 class 一起使用

- es6 继承父类的方法和属性

```js
class Animal {
  kind = "animal";
  constructor(kind) {
    this.kind = kind;
  }
  sayHello() {
    console.log(`Hello, I am a ${this.kind}!`);
  }
}

class Dog extends Animal {
  constructor(kind) {
    super(kind);
  }
  bark() {
    console.log("wang wang");
  }
}

const dog = new Dog("dog");
dog.name; //  => 'dog'
dog.sayHello(); // => Hello, I am a dog!
```

这里 Dog 继承了父类的 sayHello 方法，因为可以在 Dog 实例 dog 上调用。

- ts 继承某个类型
  在 ts 里，extends 除了可以像 js 继承值，还可以继承/扩展类型：

```
 interface Animal {
   kind: string;
 }

 interface Dog extends Animal {
   bark(): void;
 }
 // Dog => { name: string; bark(): void }
```

<hr/>

### 泛型约束

在书写泛型的时候，我们往往需要对类型参数作一定的限制，比如希望传入的参数都有 name 属性的数组我们可以这么写：

```ts
function getCnames<T extends { name: string }>(entities: T[]): string[] {
  return entities.map((entity) => entity.cname);
}
```

这里 extends 对传入的参数作了一个限制，就是 entities 的每一项可以是一个对象，但是必须含有类型为 string 的 cname 属性。

再比如，redux 里 dispatch 一个 action，必须包含 type 属性：

```ts
// https://github.com/841660202/redux/blob/2edd0363271af46e327e118f3d92e78e258bf0cd/src/types/store.ts#L83

// Dispatch
export interface Dispatch<A extends Action = AnyAction> {
  <T extends A>(action: T, ...extraArgs: any[]): T;
}

// AnyAction
export interface AnyAction extends Action {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
}
// Action
export interface Action<T = any> {
  type: T;
}

// 上述代码 简化
interface Dispatch<T extends { type: string }> {
  (action: T): T;
}
```

### 条件类型与高阶类型

```ts
SomeType extends OtherType ? TrueType : FalseType;

```

When the type on the left of the extendsis assignable to the one on the right, then you’ll get the type in the first branch (the “true” branch); otherwise you’ll get the type in the latter branch (the “false” branch).
`当左边的类型可以赋值给右边的类型，那么你就会得到第一个分支的类型，否则你就会得到第二个分支的类型。`

extends 还有一大用途就是用来判断一个类型是不是可以分配给另一个类型，这在写高级类型的时候非常有用，举个 ????：

```ts
type Human = {
  name: string;
};
type Duck = {
  name: string;
};
type Bool = Duck extends Human ? "yes" : "no"; // Bool => 'yes'
```

在 vscode 里或者 ts playground 里输入这段代码，你会发现 Bool 的类型是'yes'。这是因为 Human 和 Duck 的类型完全相同，或者说 Human 类型的一切约束条件，Duck 都具备；换言之，类型为 Human 的值可以分配给类型为 Duck 的值（分配成功的前提是，Duck 里面得的类型得有一样的），反之亦然。需要理解的是，这里 A extends B，是指类型 A 可以分配给类型 B，而不是说类型 A 是类型 B 的子集。稍微扩展下来详细说明这个问题：

```ts
type Human = {
  name: string;
  occupation: string;
};
type Duck = {
  name: string;
};
type Bool = Duck extends Human ? "yes" : "no"; // Bool => 'no'
```

当我们给 Human 加上一个 occupation 属性，发现此时 Bool 是'no'，这是因为 Duck 没有类型为 string 的 occupation 属性，类型 Duck 不满足类型 Human 的类型约束。因此，A extends B，是指类型 A 可以分配给类型 B，而不是说类型 A 是类型 B 的子集，理解 extends 在类型三元表达式里的用法非常重要。

继续看示例

```ts
type A1 = "x" extends "x" ? string : number; // string
type A2 = "x" | "y" extends "x" ? string : number; // number

type P<T> = T extends "x" ? string : number;
type A3 = P<"x" | "y">; // ?
```

A1 和 A2 是 extends 条件判断的普通用法，和上面的判断方法一样。

P 是带参数 T 的泛型类型，其表达式和 A1，A2 的形式完全相同，A3 是泛型类型 P 传入参数'x' | 'y'得到的类型，如果将'x' | 'y'带入泛型类的表达式，可以看到和 A2 类型的形式是完全一样的，那是不是说明，A3 和 A2 的类型就是完全一样的呢？

有兴趣可以自己试一试，这里就直接给结论了

```ts
type P<T> = T extends "x" ? string : number;
type A3 = P<"x" | "y">; // A3 的类型是 string | number
```

是不是很反直觉？这个反直觉结果的原因就是所谓的分配条件类型（Distributive Conditional Types）

When conditional types act on a generic type, they become distributive when given a union type
`当条件类型作用于泛型类型时，它们变成分配条件类型（Distributive Conditional Types）`

这句话翻译过来也还是看不懂，大白话

> 对于使用 extends 关键字的条件类型（即上面的三元表达式类型），**如果 extends 前面的参数是一个泛型类型，当传入该参数的是联合类型，则使用分配律计算最终的结果。分配律是指，将联合类型的联合项拆成单项，分别代入条件类型，然后将每个单项代入得到的结果再联合起来，得到最终的判断结果。**

If we plug a union type into ToArray, then the conditional type will be applied to each member of that union.
`如果将联合类型传入 ToArray，则条件类型将会应用到联合类型的每一个成员。`

还是用上面的例子说明

```ts
type P<T> = T extends "x" ? string : number;
type A3 = P<"x" | "y">; // A3 的类型是 string | number
```

该例中，extends 的前参为 T，T 是一个泛型参数。在 A3 的定义中，给 T 传入的是'x'和'y'的联合类型'x' | 'y'，满足分配律，于是'x'和'y'被拆开，分别代入 P<T>

```
P<'x' | 'y'> => P<'x'> | P<'y'>

'x'代入得到

'x' extends 'x' ? string : number => string

'y'代入得到

'y' extends 'x' ? string : number => number

然后将每一项代入得到的结果联合起来，得到 string | number

```

总之，满足两个要点即可适用分配律：第一，参数是泛型类型，第二，代入参数的是联合类型

特殊的 never

```ts
// never 是所有类型的子类型
type A1 = never extends "x" ? string : number; // string

type P<T> = T extends "x" ? string : number;
type A2 = P<never>; // never
```

上面的示例中，A2 和 A1 的结果竟然不一样，看起来 never 并不是一个联合类型，所以直接代入条件类型的定义即可，获取的结果应该和 A1 一直才对啊？

实际上，这里还是条件分配类型在起作用。never 被认为是空的联合类型，也就是说，没有联合项的联合类型，所以还是满足上面的分配律，然而因为没有联合项可以分配，所以 P<T>的表达式其实根本就没有执行，所以 A2 的定义也就类似于永远没有返回的函数一样，是 never 类型的。

防止条件判断中的分配

```ts
type P<T> = [T] extends ["x"] ? string : number;
type A1 = P<"x" | "y">; // number
type A2 = P<never>; // string
```

在条件判断类型的定义中，将泛型参数使用[]括起来，即可阻断条件判断类型的分配，此时，传入参数 T 的类型将被当做一个整体，不再分配。

<hr/>

## 原理(注意)

:::tip

需前置学习 extends 关键字

:::

- 源码很简单，判断联合类型 T 是否可以赋值给联合类型 U，是则返回 never，否则返回 T
- never 是一个特殊的类型，在这里可以表示为空的联合类型，在于与其他类型的联合后，结果为其他类型。
- 没有遍历，怎么也能实现呢? `这里还涉及到extends条件类型的特殊情况，extends的前参T如果是一个泛型参数。对于使用extends关键字的条件类型（即上面的三元表达式类型），如果extends前面的参数是一个泛型类型，当传入该参数的是联合类型，两个类型会成为分配条件类型（Distributive Conditional Types）。分配条件类型是指，将联合类型的联合项拆成单项，分别代入条件类型，然后将每个单项代入得到的结果再联合起来，得到最终的判断结果。`

```ts
type Exclude<T, U> = T extends U ? never : T;
```

## Extract<Type, Union>

Released:2.8

Constructs a type by extracting from Type all union members that are assignable to Union.
`用于构造一个类型，它是从Type类型里面提取了所有可以赋给Union的类型。`

```ts
// Example
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
// type T0 = "a";

type T1 = Extract<string | number | (() => void), Function>;
// type T1 = () => void;
```

## 原理(注意)

:::tip

需前置学习 extends 关键字

:::

原理：与 Exclude 相反，判断联合类型 T 是否可以赋值给联合类型 U，是则返回 T，否则返回 never。

```ts
type Extract<T, U> = T extends U ? T : never;
```

## NonNullable<Type>

Released:2.8

Constructs a type by excluding null and undefined from Type.
`用于构造一个类型，这个类型从Type中排除了所有的null、undefined的类型。`

```ts
// Example
type T0 = NonNullable<string | number | undefined>;

// type T0 = string | number;

type T1 = NonNullable<string[] | null | undefined>;

// type T1 = string[];
```

## 原理

判断 T 是否可以赋值给 null 或者 undefined 类型，是则返回 never，否则返回 T，如果这段看不明白的可以再看下 Exclude 那段关于 extends 的补充说明。

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

## Parameters<Type>

Released:3.1

Constructs a tuple type from the types used in the parameters of a function type Type.
`用于根据所有Type中函数类型的参数构造一个元祖类型。`

```ts
// Example
declare function f1(arg: { a: number; b: string }): void;

type T0 = Parameters<() => string>;
// type T0 = []

type T1 = Parameters<(s: string) => void>;
// type T1 = [s: string]

type T2 = Parameters<<T>(arg: T) => T>;
// type T2 = [arg: unknown]

type T3 = Parameters<typeof f1>;
// type T3 = [arg: {
//   a: number;
//   b: string;
// }]

type T4 = Parameters<any>;
// type T4 = unknown[]

type T5 = Parameters<never>;
// type T5 = never

type T6 = Parameters<string>;
// Type 'string' does not satisfy the constraint '(...args: any) => any'.
// type T6 = never

type T7 = Parameters<Function>;
// Type 'Function' does not satisfy the constraint '(...args: any) => any'.
// Type 'Function' provides no match for the signature '(...args: any): any'.

type T7 = never;
```

## 原理：

- `Parameters` 首先约束参数 `T `必须是个函数类型
- 判断 `T` 是否是函数类型，如果是则使用 `infer P` 暂时存一下函数的参数类型，直接用 P 即可得到这个类型并返回，否则就返回 `never`

```ts
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

这里用到了`infer`，`infer P`标记一个泛型，表示这个泛型是一个待推断的类型，并且可以直接使用。

## ConstructorParameters<Type>

`构造参数类型`
Released:3.1

Constructs a tuple or array type from the types of a constructor function type. It produces a tuple type with all the parameter types (or the type never if Type is not a function).
`构造一个从构造函数类型Type中提取的元组或数组类型。如果Type不是函数，则生成never类型。`

```ts
// Example
type T0 = ConstructorParameters<ErrorConstructor>;
// type T0 = [message?: string]

type T1 = ConstructorParameters<FunctionConstructor>;
// type T1 = string[]

type T2 = ConstructorParameters<RegExpConstructor>;
// type T2 = [pattern: string | RegExp, flags?: string]

type T3 = ConstructorParameters<any>;
// type T3 = unknown[]

type T4 = ConstructorParameters<Function>;
// Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
// Type 'Function' provides no match for the signature 'new (...args: any): any'.

// type T4 = never
```

## ReturnType<Type>

Released:2.8

Constructs a type consisting of the return type of function Type.
`用于构造一个含有Type函数的返回值的类型。`

```ts
// Example
declare function f1(): { a: number; b: string };

type T0 = ReturnType<() => string>;
// type T0 = string

type T1 = ReturnType<(s: string) => void>;
// type T1 = void

type T2 = ReturnType<<T>() => T>;
// type T2 = unknown

type T3 = ReturnType<<T extends U, U extends number[]>() => T>;
// type T3 = number[]

type T4 = ReturnType<typeof f1>;
// type T4 = {
// a: number;
// b: string;
// }

type T5 = ReturnType<any>;
// type T5 = any

type T6 = ReturnType<never>;
// type T6 = never

type T7 = ReturnType<string>;
// Type 'string' does not satisfy the constraint '(...args: any) => any'.
// type T7 = any

type T8 = ReturnType<Function>;
// Type 'Function' does not satisfy the constraint '(...args: any) => any'.
// Type 'Function' provides no match for the signature '(...args: any): any'.

// type T8 = any
```

## 原理

与 Parameters 类似

ReturnType 首先约束参数 T 必须是个函数类型
判断 T 是否是函数类型，如果是则使用 infer R 暂时存一下函数的返回值类型，后面的语句直接用 R 即可得到这个类型并返回，否则就返回 any

```ts
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```

## InstanceType<Type>

Released:2.8

Constructs a type consisting of the instance type of a constructor function in Type.
`返回构造函数类型T的实例类型`

```ts
// Example
class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>;
// type T0 = C

type T1 = InstanceType<any>;
// type T1 = any

type T2 = InstanceType<never>;
// type T2 = never

type T3 = InstanceType<string>;
// Type 'string' does not satisfy the constraint 'abstract new (...args: any) => any'.
// type T3 = any

type T4 = InstanceType<Function>;
// Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
// Type 'Function' provides no match for the signature 'new (...args: any): any'.

// type T4 = any
```
## 原理

`type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any`
与ResultType 类似
`type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;`
## ThisParameterType<Type>

Released:3.3

Extracts the type of the this parameter for a function type, or unknown if the function type has no this parameter.
`用于提取一个函数类型Type的this (opens new window)参数类型，返回unknown (opens new window)如果这个函数类型没有this参数。`

```ts
// Example
function toHex(this: Number) {
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```

## OmitThisParameter<Type>

Released:3.3

Removes the this parameter from Type. If Type has no explicitly declared this parameter, the result is simply Type. Otherwise, a new function type with no this parameter is created from Type. Generics are erased and only the last overload signature is propagated into the new function type.
`用于移除一个函数类型Type的this (opens new window)参数类型。如果Type没有明确的声明this 类型，那么这个返回的结果就是Type，不然的话，就返回一个新的函数类型，基于Type，但不再有this参数。范型会被抹去，只有最后重载的签名被传播进了返回的新的函数类型。`

```ts
// Example
function toHex(this: Number) {
  return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);

console.log(fiveToHex());
```

## ThisType<Type>

Released:2.3

This utility does not return a transformed type. Instead, it serves as a marker for a contextual this type. Note that the noImplicitThis flag must be enabled to use this utility.
`这个类型不返回一个转换过的类型，它被用作标记一个上下文的this类型。注意下如果想使用这个工具类型，noImplicitThis (opens new window)的flag必须启用。`

```ts
// Example
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    },
  },
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```

In the example above, the methods object in the argument to makeObject has a contextual type that includes ThisType<D & M> and therefore the type of this in methods within the methods object is { x: number, y: number } & { moveBy(dx: number, dy: number): number }. Notice how the type of the methods property simultaneously is an inference target and a source for the this type in methods.
`在上面的示例中，makeObject的参数中的methods对象包含了一个上下文类型，该类型包含了ThisType<D & M>，因此methods对象中的this类型是{ x: number, y: number } & { moveBy(dx: number, dy: number): number }。请注意，methods属性的类型同时是一个推断目标和一个methods对象中的this类型的源。`
The ThisType<T> marker interface is simply an empty interface declared in lib.d.ts. Beyond being recognized in the contextual type of an object literal, the interface acts like any empty interface.
`ThisType<T>标记接口是在lib.d.ts中声明的空接口。它只是在对象字面量的上下文类型中被识别而已，该接口的行为与空接口一样。`

## Intrinsic String Manipulation Types

`内部字符串操作类型`
Uppercase<StringType>
Lowercase<StringType>
Capitalize<StringType>
Uncapitalize<StringType>

To help with string manipulation around template string literals, TypeScript includes a set of types which can be used in string manipulation within the type system. You can find those in the Template Literal Types documentation.
`为了帮助模板字符串操作，TypeScript包含一组可以在字符串操作中使用的类型。你可以在模板字符串类型文档中找到它们。`

## 参考链接

[typescript handbook utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
[工具类型](https://ts.yayujs.com/reference/UtilityTypes.html#intrinsic-string-manipulation-types)
[Typescript 中的 extends 关键字](https://blog.csdn.net/qq_34998786/article/details/120300361)Exclude 与 Extract 前置学习项
[Typescript Classes extends-clauses](https://www.typescriptlang.org/docs/handbook/2/classes.html#extends-clauses)
[彻底搞懂 typescript 工具类型及其原理](https://blog.csdn.net/qq_32438227/article/details/125058423) 该文有错误内容，要注意哦
