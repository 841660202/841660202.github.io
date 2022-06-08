---
title: Typescript手册 类型操作
date: 2022-06-07 09:20:35
categories: typescript
tags: [typescript]
cover: https://img0.baidu.com/it/u=86492913,3057347241&fm=253&fmt=auto&app=138&f=JPEG?w=499&h=208
---

## ts 类型如何调试

- 不是代码逻辑如何调试，没想到

## ts 自定义类型如何打印

- 不是 js 的结果如何打印，没想到

## Creating Types from Types

从已有类型中创建类型

TypeScript 的类型系统非常强大，因为它允许表达类型的另一种表达方式。
最简单的方式是泛型，我们实际上有一大堆的类型操作符可用。还可以表达类型的另一种表达方式，就是把已有的值作为类型。
通过合并多种类型操作符，我们可以表达复杂的操作和值，这里我们将介绍以另一个类型或值为基础如何表达一个新类型。

`简单来说：使用 范型 或 6种表达式 来创建新类型`

- 范型 - 类型需要参数

- Keyof Type Operator - 用 keyof 操作去创建新类型

- Typeof Type Operator - 用 typeof 操作去创建新类型

- Indexed Access Types - 使用 Type['a']语法去访问一个类型的一部分

- Conditional Types - 类型行为像 if 语句一样

- Mapped Types - 通过映射已有类型的每个属性来创建新类型

- Template Literal Types - 通过模板字符串来改变属性的映射类型

## Keyof Type Operator

- 这个操作符可以获取一个对象的所有 key，返回一个字符串或者数字的联合类型，接下来的类型 P 是这个类型的类型：

```ts
type P1 = keyof any; // 提示：type P1 = string | number | symbol
```

```ts
type Point = { x: number; y: number };
type P = keyof Point; // 提示：type P = keyof Point，这个提示等于没提示
```

- 如果这个类型有字符串或者数字索引，keyof 就会返回这个类型：

```ts
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish; //提示：type A = number

type Mapish = { [k: string]: boolean };
type M = keyof Mapish; // 提示：type M = string | number

// --------------------------------------------------------------
// 对于Arrayish

// 实例1:ok
var a: Arrayish = {
  1: "string",
  2: false,
};
// 实例2: ok
var a1: Arrayish = [1, 2, 3, 4];

// 对于 Mapish
var b: Mapish = {
  name: true,
  age: false,
};
```

注意，这个例子中，M 是 string | number — 这是因为 JavaScript 对象键是总是被强制为字符串，所以 obj[0] 总是和 obj["0"] 相同。

keyof 类型操作符可以获取一个对象的所有 key，返回一个字符串或者数字的联合类型，接下来的类型 P 是这个类型的类型：

## Typeof type operator

JavaScript 也有一个 typeof 操作符，可以用在表达式中：

```js
// Prints "string"
console.log(typeof "Hello world");
```

TypeScript 增加了一个 typeof 操作符，可以用在类型上：

```ts
let s = "hello";
let n: typeof s; // 提示：let n: string
```

## ReturnType

对于基本类型，typeof 操作符没有意义，但是与其他类型操作符结合使用，可以用 typeof 操作符来实现一些模式。例如，我们开始用 ReturnType<T> 来表示函数的返回类型：

```ts
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>; // 提示 type K = boolean
```

如果我们尝试使用 ReturnType 在函数名上，我们会看到一个指示性的错误：

```ts
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<f>;
// 提示：'f' refers to a value, but is being used as a type here. Did you mean 'typeof f'?
// 提示：'f' 涉及到一个值，但是在这里被使用作为类型。你是否想使用 'typeof f' 来代替 'f'？
```

记住，值和类型不是一回事。要引用值 f 所拥有的类型，我们使用 typeof：

```ts
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;

/**
 * 提示
 * type P = {
    x: number;
    y: number;
}
**/
```

**限制**

typescript 通常限制了 typeof 的表达式的类型。
特殊的，typeof 的表达式`只能用于标识符（即变量名）其属性`。这个限制是为了避免写一些你认为是执行的代码，但实际上并不是的：

```ts
// Meant to use = ReturnType<typeof msgbox>
let shouldContinue: typeof msgbox("Are you sure you want to continue?");
// ',' expected.
```

## Indexed Access Types

我们可以使用索引访问类型来查找一个类型的特定属性：

```ts
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"]; // 提示：type Age = number
```

这个索引类型本身是一个类型，所以我们可以使用联合，keyof 或者其他类型：

```ts
type I1 = Person["age" | "name"]; // 提示：type I1 = string | number

type I2 = Person[keyof Person]; // 提示：type I2 = string | number | boolean

type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName]; // 提示：type I3 = string | boolean
```

你会看到一个错误，如果你尝试索引一个不存在的属性：

```ts
type I1 = Person["alve"];
Property 'alve' does not exist on type 'Person'.
```

另一个例子是使用 number 来获取数组的元素类型。我们可以使用 typeof 来方便地捕获数组字面量的元素类型。

```ts
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];

type Person = typeof MyArray[number];

// 提示：type Person = { name: string; age: number; }

type Age = typeof MyArray[number]["age"]; // 提示 type Age = number;
// Or
type Age2 = Person["age"]; // 提示 type Age2 = number;
```

你只能使用类型来索引，意味着你不能使用 const 来创建一个变量引用：

```ts
const key = "age";
type Age = Person[key];
// Type 'key' cannot be used as an index type.
// 这个错误是因为 key 是一个字面量，而不是一个变量。
// 'key' refers to a value, but is being used as a type here. Did you mean 'typeof key'?
// 这个错误是因为 key 涉及到一个值，但是在这里被使用作为类型。你是否想使用 'typeof key' 来代替 'key'？
```

然而，你可以使用一个类型别名来替换相同的风格的重构：

```ts
type key = "age";
type Age = Person[key];
```

## Conditional Types

At the heart of most useful programs, we have to make decisions based on input. JavaScript programs are no different, but given the fact that values can be easily introspected, those decisions are also based on the types of the inputs. Conditional types help describe the relation between the types of inputs and outputs.
在最常见的程序中，我们需要根据输入来做决策。 JavaScript 程序是不同的，但是给定了这个事实，那些决策是根据输入的类型来做的。条件类型帮助描述输入和输出类型之间的关系。

```ts
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}

type Example1 = Dog extends Animal ? number : string; // 提示：type Example1 = number

type Example2 = RegExp extends Animal ? number : string; // 提示：type Example2 = string
```

条件类型的表达式像 JavaScript 中的条件表达式一样：

```ts
 SomeType extends OtherType ? TrueType : FalseType;
```

**此段内容，原文保留**
When the type on the left of the extends is assignable to the one on the right, then you’ll get the type in the first branch (the “true” branch); otherwise you’ll get the type in the latter branch (the “false” branch).

当 extends 左边的类型可以赋值给右边的类型时，你会得到第一个分支的类型（“true”分支）；否则你会得到第二个分支的类型（“false”分支）。

From the examples above, conditional types might not immediately seem useful - we can tell ourselves whether or not Dog extends Animal and pick number or string! But the power of conditional types comes from using them with generics.
从上面的例子中可以看到条件类型可能不会立即看起来很有用，我们可以告诉自己 Dog 是否继承了 Animal，然后选择 number 或 string！但是条件类型的力量来自于使用它们与泛型。

For example, let’s take the following createLabel function:
例如，我们可以把下面的 createLabel 函数拿来说说：

```ts
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```

These overloads for createLabel describe a single JavaScript function that makes a choice based on the types of its inputs. Note a few things:
这些 createLabel 的重载描述了一个单一的 JavaScript 函数，它根据输入的类型来做决策。请注意一些事情：

If a library has to make the same sort of choice over and over throughout its API, this becomes cumbersome.
We have to create three overloads: one for each case when we’re sure of the type (one for string and one for number), and one for the most general case (taking a string | number). For every new type createLabel can handle, the number of overloads grows exponentially.
如果一个库需要在其 API 中重复使用相同的选择，这就变得非常麻烦。我们需要创建三个重载：一个当我们知道类型时，一个当我们知道类型时，一个当我们不知道类型时。对于每个新的类型 createLabel 可以处理，重载的数量就会指数增长。
Instead, we can encode that logic in a conditional type:
反之，我们可以使用条件类型来表示逻辑：

```ts
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
```

We can then use that conditional type to simplify our overloads down to a single function with no overloads.
我们可以使用这个条件类型来简化我们的重载，只有一个函数。

```ts
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}

let a = createLabel("typescript");

// 提示：let a: NameLabel;

let b = createLabel(2.8);

// 提示：let b: IdLabel;

let c = createLabel(Math.random() ? "hello" : 42);
// 提示：let c: NameLabel | IdLabel;
```

- Conditional Type Constraints

条件类型约束

Often, the checks in a conditional type will provide us with some new information. Just like with narrowing with type guards can give us a more specific type, the true branch of a conditional type will further constrain generics by the type we check against.
通常，在条件类型中的检查会提供我们一些新的信息。像类型检查一样，通过类型约束可以给我们更具体的类型，条件类型的 true 分支将通过我们检查的类型来约束泛型。
For example, let’s take the following:
例如，我们可以把下面的函数拿来说说：

```ts
type MessageOf<T> = T["message"];
// Type '"message"' cannot be used to index type 'T'.
```

In this example, TypeScript errors because T isn’t known to have a property called message. We could constrain T, and TypeScript would no longer complain:

在这个例子中，TypeScript 错误，因为 T 没有一个属性叫 message。我们可以约束 T，TypeScript 不会再报错了：

```ts
type MessageOf<T extends { message: unknown }> = T["message"];

interface Email {
  message: string;
}

type EmailMessageContents = MessageOf<Email>;

// 提示：type EmailMessageContents = string
```

However, what if we wanted MessageOf to take any type, and default to something like never if a message property isn’t available? We can do this by moving the constraint out and introducing a conditional type:
然而，如果我们想要 MessageOf 取任意类型，并且默认为没有 message 属性的情况，我们可以这样做：

```ts
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {
  message: string;
}

interface Dog {
  bark(): void;
}

type EmailMessageContents = MessageOf<Email>;

// 提示：type EmailMessageContents = string;

type DogMessageContents = MessageOf<Dog>;

// 提示：type DogMessageContents = never;
```

Within the true branch, TypeScript knows that T will have a message property.
在 true 分支中，TypeScript 知道 T 有一个 message 属性。

As another example, we could also write a type called Flatten that flattens array types to their element types, but leaves them alone otherwise:
作为另一个示例，我们还可以编写一个名为 Flatten 的类型，该类型将数组类型展平为其元素类型，但在其他情况下不使用它们：

```ts
type Flatten<T> = T extends any[] ? T[number] : T;

// Extracts out the element type. 提取元素类型。
type Str = Flatten<string[]>;

type Str = string;

// Leaves the type alone. 保留该类型。
type Num = Flatten<number>;

type Num = number;
```

When Flatten is given an array type, it uses an indexed access with number to fetch out string[]’s element type. Otherwise, it just returns the type it was given.
当 Flatten 给定一个数组类型，它使用 number 下标得到 string[]元素类型，否则，仅返回所给类型

Inferring Within Conditional Types
在条件类型内推断

We just found ourselves using conditional types to apply constraints and then extract out types. This ends up being such a common operation that conditional types make it easier.

我们只是发现自己使用条件类型来应用约束，然后提取出类型。这最终是一种常见的操作，条件类型使其更容易实现。

Conditional types provide us with a way to infer from types we compare against in the true branch using the infer keyword. For example, we could have inferred the element type in Flatten instead of fetching it out “manually” with an indexed access type:

条件类型为我们提供了一种使用 infer 关键字从 true 分支中比较的类型推断的方法。例如，我们可以在 Flatten 中推断元素类型，而不是使用索引访问类型“手动”提取它：

```ts
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

Here, we used the infer keyword to declaratively introduce a new generic type variable named Item instead of specifying how to retrieve the element type of T within the true branch. This frees us from having to think about how to dig through and probing apart the structure of the types we’re interested in.

在这里，我们使用 infer 关键字声明性地引入一个名为 Item 的新泛型类型变量，而不是指定如何在 true 分支中检索 T 的元素类型。这使我们不必思考如何挖掘和探索我们感兴趣的类型的结构。

We can write some useful helper type aliases using the infer keyword. For example, for simple cases, we can extract the return type out from function types:

我们可以使用 infer 关键字编写一些有用的助手类型别名。例如，对于简单的情况，我们可以从函数类型中提取返回类型：

```ts
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>;

// 提示： type Num = number

type Str = GetReturnType<(x: string) => string>;

// 提示：type Str = string

type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;

// 提示： type Bools = boolean[]
```

When inferring from a type with multiple call signatures (such as the type of an overloaded function), inferences are made from the last signature (which, presumably, is the most permissive catch-all case). It is not possible to perform overload resolution based on a list of argument types.
当从具有多个调用签名的类型（例如重载函数的类型）进行推断时，将从最后一个签名进行推断（这可能是最允许的一网打尽的情况）。无法基于参数类型列表执行重载解析。

```ts
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;

type T1 = ReturnType<typeof stringOrNum>;

// 提示：type T1 = string | number;
```

## Distributive Conditional Types

分布条件类型

When conditional types act on a generic type, they become distributive when given a union type. For example, take the following:
当条件类型作用于泛型类型时，当给定一个联合类型时，它们将成为分布式的。例如，以以下内容为例：

```ts
type ToArray<Type> = Type extends any ? Type[] : never;
```

If we plug a union type into ToArray, then the conditional type will be applied to each member of that union.
如果我们将一个联合类型插入 ToArray，那么条件类型将应用于该联合的每个成员。

```ts
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;

// 提示：type StrArrOrNumArr = string[] | number[];
```

What happens here is that StrArrOrNumArr distributes on:
这里发生了什么？

```ts
string | number;
```

and maps over each member type of the union, to what is effectively:
并映射到联合类型每个成员类型

```ts
  ToArray<string> | ToArray<number>;
```

which leaves us with:
这给我们留下了：

```ts
string[] | number[];
```

Typically, distributivity is the desired behavior. To avoid that behavior, you can surround each side of the extends keyword with square brackets.
通常情况下，分布式是所需的行为。要避免这种行为，你可以在每边 extends 关键字之前使用方括号。

```ts
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// 'StrArrOrNumArr' is no longer a union.
type StrArrOrNumArr = ToArrayNonDist<string | number>;
// 提示：type StrArrOrNumArr = (string | number)[];
```

## Return 待完善

## Mapped Types
映射类型

When you don’t want to repeat yourself, sometimes a type needs to be based on another type.
当你不想重复自己的时候，有时候一个类型需要基于另一个类型。
Mapped types build on the syntax for index signatures, which are used to declare the types of properties which have not been declared ahead of time:
映射类型建立基于索引签名的语法，用于声明在预先定义的属性类型之前没有被声明的属性类型：

```ts
type OnlyBoolsAndHorses = {
  [key: string]: boolean | Horse;
};
 
const conforms: OnlyBoolsAndHorses = {
  del: true,
  rodney: false,
};

```


