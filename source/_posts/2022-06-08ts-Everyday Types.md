---
title: 3.Typescript 常见类型
date: 2022-06-06 16:40:41
categories: typescript
tags: [typescript]
cover: https://img0.baidu.com/it/u=86492913,3057347241&fm=253&fmt=auto&app=138&f=JPEG?w=499&h=208
---

## Everyday Types

`常见类型`
In this chapter, we’ll cover some of the most common types of values you’ll find in JavaScript code, and explain the corresponding ways to describe those types in TypeScript. This isn’t an exhaustive list, and future chapters will describe more ways to name and use other types.
`在这一章中，我们将探讨一些 JavaScript 代码中的常见类型，并在 TypeScript 中说明这些类型的相应方式。这并不是一个完整的列表，而且未来的章节将说明更多的方法来命名和使用其他类型。`
Types can also appear in many more places than just type annotations. As we learn about the types themselves, we’ll also learn about the places where we can refer to these types to form new constructs.
`类型也可以出现在类型注释之外。我们学习类型本身时，我们也会学习到哪些地方可以引用这些类型来形成新的构造。`
We’ll start by reviewing the most basic and common types you might encounter when writing JavaScript or TypeScript code. These will later form the core building blocks of more complex types.
`我们将开始介绍最基本的 JavaScript 或 TypeScript 代码中可能遇到的常见类型。这些类型将作为更复杂的类型的基础建筑块。`

## The primitives: string,number, and boolean

JavaScript has three very commonly used primitives: string, number, and boolean. Each has a corresponding type in TypeScript. As you might expect, these are the same names you’d see if you used the JavaScript typeof operator on a value of those types:
`JavaScript 有三个非常常见的原始类型：字符串，数字和布尔值。这三个类型在 TypeScript 中对应。如果你可以接受，这三个类型的名字都是相同的：`

- string represents string values like "Hello, world"
  `string 表示字符串，比如 "Hello, world"`
- number is for numbers like 42. JavaScript does not have a special runtime value for integers, so there’s no equivalent to int or float - everything is simply number
  `number 是数字，比如 42。JavaScript 不支持整数，所以没有相应的 int 或 float - 所有都是 number`
- boolean is for the two values true and false
  `boolean 是布尔值，比如 true 和 false`

:::warning

The type names String, Number, and Boolean (starting with capital letters) are legal, but refer to some special built-in types that will very rarely appear in your code. Always use string, number, or boolean for types.
`类型名 String ，Number 和 Boolean （首字母大写）也是合法的，但它们是一些非常少见的特殊内置类型。所以类型总是使用 string ，number 或者 boolean 。`
:::

## Arrays

`数组`
To specify the type of an array like [1, 2, 3], you can use the syntax number[]; this syntax works for any type (e.g. string[] is an array of strings, and so on). You may also see this written as Array<number>, which means the same thing. We’ll learn more about the syntax T<U> when we cover generics.
`指定数组的类型，可以使用 number[] 的语法，这种语法可以用于任何类型（比如 string[] 是一个字符串数组，而 so on）。你也可以看到这种写法 Array<number>，它表示相同的意思。我们将在接下来的章节中学习更多关于语法 T<U> 的详细信息。`
:::warning
Note that [number] is a different thing; refer to the section on Tuples.
`[number] 不是同一个东西，请参见关于元组的章节。`
:::

## any

TypeScript also has a special type, any, that you can use whenever you don’t want a particular value to cause typechecking errors.
`TypeScript 也有一个特殊的类型 any，可以用于指定你不想要某个值导致类型检查错误的情况。`
When a value is of type any, you can access any properties of it (which will in turn be of type any), call it like a function, assign it to (or from) a value of any type, or pretty much anything else that’s syntactically legal:
`当值是 any 类型时，你可以访问它的任何属性（这将导致它的类型为 any ），调用它，将它赋值给（或从）任何类型的值，或者其他任何合法的语法：`

```ts
let obj: any = { x: 0 };
// None of the following lines of code will throw compiler errors.
// 以下代码行都不会引发编译器错误。
// Using `any` disables all further type checking, and it is assumed
// 使用“any”将禁用所有进一步的类型检查，并且假定
// you know the environment better than TypeScript.
// 你知道环境优于TypeScript。
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```

The any type is useful when you don’t want to write out a long type just to convince TypeScript that a particular line of code is okay.
`any 类型是用于指定你不想要写出一个长的类型来说明 TypeScript 对某一行代码是合法的。`

## noImplicitAny

When you don’t specify a type, and TypeScript can’t infer it from context, the compiler will typically default to any.
`当你不指定类型，并且 TypeScript 不能从上下文中推断出来时，编译器默认使用 any。`
You usually want to avoid this, though, because any isn’t type-checked. Use the compiler flag noImplicitAny to flag any implicit any as an error.
`你通常想避免这种情况，但是 any 不会被类型检查。使用编译器标记 noImplicitAny 来标记 any 为错误。`

## Type Annotations on Variables

`变量上的类型注解`

When you declare a variable using const, var, or let, you can optionally add a type annotation to explicitly specify the type of the variable:
`使用 const ，var 或 let 声明变量时，可以添加一个类型注解来显式指定变量的类型：`

```ts
let myName: string = "Alice";
```

TypeScript doesn’t use “types on the left”-style declarations like int x = 0; Type annotations will always go after the thing being typed.
`TypeScript 不使用“左边的类型”的声明方式，如 int x = 0; 类型注解将总是在被类型的东西后面。`
In most cases, though, this isn’t needed. Wherever possible, TypeScript tries to automatically infer the types in your code. For example, the type of a variable is inferred based on the type of its initializer:
`在大多数情况下，不需要这样做。在每个变量的初始值的类型可以被自动推断出来。`

```ts
// No type annotation needed -- 'myName' inferred as type 'string'
// 没有类型注解需要 -- 'myName' 类型被推断为 'string'
let myName = "Alice";
```

For the most part you don’t need to explicitly learn the rules of inference. If you’re starting out, try using fewer type annotations than you think - you might be surprised how few you need for TypeScript to fully understand what’s going on.
`大多数情况下，你不需要显式地指定类型注解。如果你是新手，尝试使用比你认为更少的类型注解，你可能会意外地发现 TypeScript 可以完全理解你的代码。`

## Functions

`函数`

Functions are the primary means of passing data around in JavaScript. TypeScript allows you to specify the types of both the input and output values of functions.
`函数是 JavaScript 中传递数据的主要方式。TypeScript 允许你指定函数的输入和输出值的类型。`

## Parameter Type Annotations

`参数上的类型注解`

When you declare a function, you can add type annotations after each parameter to declare what types of parameters the function accepts. Parameter type annotations go after the parameter name:
`声明函数时，可以在每个参数后面添加类型注解来声明函数接受哪些类型的参数。参数类型注解在参数名后面：`

```ts
// Parameter type annotation
function greet(name: string) {
  console.log("Hello, " + name.toUpperCase() + "!!");
}
```

When a parameter has a type annotation, arguments to that function will be checked:
`当参数有类型注解时，函数的参数会被检查：`

```ts
// Would be a runtime error if executed!
// 如果执行，就会产生一个运行时错误！
greet(42);
// Argument of type 'number' is not assignable to parameter of type 'string'.
// 参数类型 'number' 不能赋值给参数类型 'string'。
```

Even if you don’t have type annotations on your parameters, TypeScript will still check that you passed the right number of arguments.
`即使你没有类型注解，TypeScript 也会检查你传入的参数是否正确。`

## Return Type Annotations

`返回值上的类型注解`

You can also add return type annotations. Return type annotations appear after the parameter list:
`你也可以添加返回值类型注解。返回值类型注解出现在参数列表后面：`

```ts
function getFavoriteNumber(): number {
  return 26;
}
```

Much like variable type annotations, you usually don’t need a return type annotation because TypeScript will infer the function’s return type based on its return statements. The type annotation in the above example doesn’t change anything. Some codebases will explicitly specify a return type for documentation purposes, to prevent accidental changes, or just for personal preference.
`和变量类型注解一样，你通常不需要返回值类型注解，因为 TypeScript 将基于返回语句的类型推断出来。上面的示例示例不会改变任何东西。一些代码库将显式指定一个返回值类型，以防止意外的改变，或者只是为了个人偏好。`

## Anonymous Functions

`匿名函数`

Anonymous functions are a little bit different from function declarations. When a function appears in a place where TypeScript can determine how it’s going to be called, the parameters of that function are automatically given types.
`匿名函数和函数声明一样。当函数出现在 TypeScript 可以确定它会如何被调用时，函数的参数会被自动指定类型。`
Here’s an example:
`这里有一个示例：`

```ts
// No type annotations here, but TypeScript can spot the bug
// 没有类型注解，但 TypeScript 可以检测到错误
const names = ["Alice", "Bob", "Eve"];

// Contextual typing for function
// 函数上下文类型
names.forEach(function (s) {
  console.log(s.toUppercase());
  // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
  // 属性 'toUppercase' 不存在于类型 'string' 中。你可能想用 'toUpperCase' 吗？
});

// Contextual typing also applies to arrow functions
// 箭头函数上下文类型
names.forEach((s) => {
  console.log(s.toUppercase());
  // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
  // 属性 'toUppercase' 不存在于类型 'string' 中。你可能想用 'toUpperCase' 吗？
});
```

Even though the parameter s didn’t have a type annotation, TypeScript used the types of the forEach function, along with the inferred type of the array, to determine the type s will have.
`即使参数 s 没有类型注解，TypeScript 会使用 forEach 函数的类型，以及推断的数组类型，来确定 s 的类型。`
This process is called contextual typing because the context that the function occurred within informs what type it should have.
`这个过程是上下文类型的，因为函数发生在哪里的上下文，就会确定它应该有哪种类型。`
Similar to the inference rules, you don’t need to explicitly learn how this happens, but understanding that it does happen can help you notice when type annotations aren’t needed. Later, we’ll see more examples of how the context that a value occurs in can affect its type.
`与推断规则相似，你不需要显式学习这种过程，但是了解这种过程可以帮助你发现，当值不需要类型注解时，它会发生什么。之后，我们会看到更多的例子，如何值的上下文可以影响它的类型。`

## Object Types

`对象类型`

Apart from primitives, the most common sort of type you’ll encounter is an object type. This refers to any JavaScript value with properties, which is almost all of them! To define an object type, we simply list its properties and their types.
`除了原始类型，最常见的类型是对象类型。这指的是任何 JavaScript 值，它的属性都是很多的！为了定义对象类型，我们只需要列出它的属性和它们的类型。`
For example, here’s a function that takes a point-like object:
`这里有一个接受点类型对象的函数：`
```ts
// The parameter's type annotation is an object type
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

Here, we annotated the parameter with a type with two properties - x and y - which are both of type number. You can use , or ; to separate the properties, and the last separator is optional either way.
`这里，我们使用了一个有两个属性的类型，x 和 y，它们都是 number 类型。你可以使用 , 或 ; 分隔属性，最后的分隔符可以是任意的。`
The type part of each property is also optional. If you don’t specify a type, it will be assumed to be any.
`每个属性的类型部分都是可选的。如果你没有指定类型，它会被认为是 any 类型。`
## Optional Properties

`可选属性`

Object types can also specify that some or all of their properties are optional. To do this, add a ? after the property name:
`对象类型可以指定一些或全部的属性是可选的。要做到这一点，只需要在属性名后面加上 ? 就可以了。`
```ts
function printName(obj: { first: string; last?: string }) {
  // ...
}
// Both OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

In JavaScript, if you access a property that doesn’t exist, you’ll get the value undefined rather than a runtime error. Because of this, when you read from an optional property, you’ll have to check for undefined before using it.

```ts
function printName(obj: { first: string; last?: string }) {
  // Error - might crash if 'obj.last' wasn't provided!
  console.log(obj.last.toUpperCase());
Object is possibly 'undefined'.
  if (obj.last !== undefined) {
    // OK
    console.log(obj.last.toUpperCase());
  }

  // A safe alternative using modern JavaScript syntax:
  console.log(obj.last?.toUpperCase());
}
```

## Union Types

`联合类型`

TypeScript’s type system allows you to build new types out of existing ones using a large variety of operators. Now that we know how to write a few types, it’s time to start combining them in interesting ways.

## Defining a Union Type

`定义一个联合类型`

The first way to combine types you might see is a union type. A union type is a type formed from two or more other types, representing values that may be any one of those types. We refer to each of these types as the union’s members.

Let’s write a function that can operate on strings or numbers:

```ts
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// Error
printId({ myID: 22342 });
// Argument of type '{ myID: number; }' is not assignable to parameter of type 'string | number'.
```

## Working with Union Types

`使用联合类型`

It’s easy to provide a value matching a union type - simply provide a type matching any of the union’s members. If you have a value of a union type, how do you work with it?

TypeScript will only allow an operation if it is valid for every member of the union. For example, if you have the union string | number, you can’t use methods that are only available on string:

```ts
function printId(id: number | string) {
  console.log(id.toUpperCase());
Property 'toUpperCase' does not exist on type 'string | number'.
  Property 'toUpperCase' does not exist on type 'number'.
}
```

The solution is to narrow the union with code, the same as you would in JavaScript without type annotations. Narrowing occurs when TypeScript can deduce a more specific type for a value based on the structure of the code.

For example, TypeScript knows that only a string value will have a typeof value "string":

```ts
function printId(id: number | string) {
  if (typeof id === "string") {
    // In this branch, id is of type 'string'
    console.log(id.toUpperCase());
  } else {
    // Here, id is of type 'number'
    console.log(id);
  }
}
```

Another example is to use a function like Array.isArray:

```ts
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // Here: 'x' is 'string[]'
    console.log("Hello, " + x.join(" and "));
  } else {
    // Here: 'x' is 'string'
    console.log("Welcome lone traveler " + x);
  }
}
```

Notice that in the else branch, we don’t need to do anything special - if x wasn’t a string[], then it must have been a string.

Sometimes you’ll have a union where all the members have something in common. For example, both arrays and strings have a slice method. If every member in a union has a property in common, you can use that property without narrowing:

```ts
// Return type is inferred as number[] | string
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}
```

It might be confusing that a union of types appears to have the intersection of those types’ properties. This is not an accident - the name union comes from type theory. The union number | string is composed by taking the union of the values from each type. Notice that given two sets with corresponding facts about each set, only the intersection of those facts applies to the union of the sets themselves. For example, if we had a room of tall people wearing hats, and another room of Spanish speakers wearing hats, after combining those rooms, the only thing we know about every person is that they must be wearing a hat.

## Type Aliases

`类型别名`

We’ve been using object types and union types by writing them directly in type annotations. This is convenient, but it’s common to want to use the same type more than once and refer to it by a single name.

A type alias is exactly that - a name for any type. The syntax for a type alias is:

```ts
type Point = {
  x: number;
  y: number;
};

// Exactly the same as the earlier example
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

You can actually use a type alias to give a name to any type at all, not just an object type. For example, a type alias can name a union type:

```ts
type ID = number | string;
```

Note that aliases are only aliases - you cannot use type aliases to create different/distinct “versions” of the same type. When you use the alias, it’s exactly as if you had written the aliased type. In other words, this code might look illegal, but is OK according to TypeScript because both types are aliases for the same type:

```ts
type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
  return sanitize(str);
}

// Create a sanitized input
let userInput = sanitizeInput(getInput());

// Can still be re-assigned with a string though
userInput = "new input";
```

## Interfaces

`接口`

An interface declaration is another way to name an object type:

```ts
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

Just like when we used a type alias above, the example works just as if we had used an anonymous object type. TypeScript is only concerned with the structure of the value we passed to printCoord - it only cares that it has the expected properties. Being concerned only with the structure and capabilities of types is why we call TypeScript a structurally typed type system.

## Differences Between Type Aliases and Interfaces

`类型别名和接口的区别`

Type aliases and interfaces are very similar, and in many cases you can choose between them freely. Almost all features of an interface are available in type, the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable.

**Interface**

```ts
// Extending an interface

interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}

const bear = getBear();
bear.name;
bear.honey;
```

**Type**

```ts
// Extending a type via intersections

type Animal = {
  name: string;
};

type Bear = Animal & {
  honey: boolean;
};

const bear = getBear();
bear.name;
bear.honey;
```

Adding new fields to an existing interface

```ts
interface Window {
  title: string;
}

interface Window {
  ts: TypeScriptAPI;
}

const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
```

A type cannot be changed after being created

```ts
type Window = {
  title: string;
};

type Window = {
  ts: TypeScriptAPI;
};

// Error: Duplicate identifier 'Window'.
```

You’ll learn more about these concepts in later chapters, so don’t worry if you don’t understand all of these right away.

- Prior to TypeScript version 4.2, type alias names may appear in error messages, sometimes in place of the equivalent anonymous type (which may or may not be desirable). Interfaces will always be named in error messages.
- Type aliases may not participate in declaration merging, but interfaces can.
- Interfaces may only be used to declare the shapes of objects, not rename primitives.
- Interface names will always appear in their original form in error messages, but only when they are used by name.

For the most part, you can choose based on personal preference, and TypeScript will tell you if it needs something to be the other kind of declaration. If you would like a heuristic, use interface until you need to use features from type.

## Type Assertions

`类型断言`

Sometimes you will have information about the type of a value that TypeScript can’t know about.

For example, if you’re using document.getElementById, TypeScript only knows that this will return some kind of HTMLElement, but you might know that your page will always have an HTMLCanvasElement with a given ID.

In this situation, you can use a type assertion to specify a more specific type:

```ts
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

Like a type annotation, type assertions are removed by the compiler and won’t affect the runtime behavior of your code.

You can also use the angle-bracket syntax (except if the code is in a .tsx file), which is equivalent:

```ts
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

Reminder: Because type assertions are removed at compile-time, there is no runtime checking associated with a type assertion. There won’t be an exception or null generated if the type assertion is wrong.

TypeScript only allows type assertions which convert to a more specific or less specific version of a type. This rule prevents “impossible” coercions like:

```ts
const x = "hello" as number;
// Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
```

Sometimes this rule can be too conservative and will disallow more complex coercions that might be valid. If this happens, you can use two assertions, first to any (or unknown, which we’ll introduce later), then to the desired type:

```ts
const a = expr as any as T;
```

## Literal Types

`字面量类型`

In addition to the general types string and number, we can refer to specific strings and numbers in type positions.

One way to think about this is to consider how JavaScript comes with different ways to declare a variable. Both var and let allow for changing what is held inside the variable, and const does not. This is reflected in how TypeScript creates types for literals.

```ts
let changingString = "Hello World";
changingString = "Olá Mundo";
// Because `changingString` can represent any possible string, that
// is how TypeScript describes it in the type system
changingString;

let changingString: string;

const constantString = "Hello World";
// Because `constantString` can only represent 1 possible string, it
// has a literal type representation
constantString;

const constantString: "Hello World";
```

By themselves, literal types aren’t very valuable:

```ts
let x: "hello" = "hello";
// OK
x = "hello";
// ...
x = "howdy";
// Type '"howdy"' is not assignable to type '"hello"'.
```

It’s not much use to have a variable that can only have one value!

But by combining literals into unions, you can express a much more useful concept - for example, functions that only accept a certain set of known values:

```ts
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.
```

Numeric literal types work the same way:

```ts
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

Of course, you can combine these with non-literal types:

```ts
interface Options {
  width: number;
}
function configure(x: Options | "auto") {
  // ...
}
configure({ width: 100 });
configure("auto");
configure("automatic");
Argument of type '"automatic"' is not assignable to parameter of type 'Options | "auto"'.
```

There’s one more kind of literal type: boolean literals. There are only two boolean literal types, and as you might guess, they are the types true and false. The type boolean itself is actually just an alias for the union true | false.

## Literal Inference

`字面量推断`
When you initialize a variable with an object, TypeScript assumes that the properties of that object might change values later. For example, if you wrote code like this:

```ts
const obj = { counter: 0 };
if (someCondition) {
  obj.counter = 1;
}
```

TypeScript doesn’t assume the assignment of 1 to a field which previously had 0 is an error. Another way of saying this is that obj.counter must have the type number, not 0, because types are used to determine both reading and writing behavior.

The same applies to strings:

```ts
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.
```

In the above example req.method is inferred to be string, not "GET". Because code can be evaluated between the creation of req and the call of handleRequest which could assign a new string like "GUESS" to req.method, TypeScript considers this code to have an error.

There are two ways to work around this.

You can change the inference by adding a type assertion in either location:

```ts
// Change 1:
const req = { url: "https://example.com", method: "GET" as "GET" };
// Change 2
handleRequest(req.url, req.method as "GET");
```

Change 1 means “I intend for req.method to always have the literal type "GET"”, preventing the possible assignment of "GUESS" to that field after. Change 2 means “I know for other reasons that req.method has the value "GET"“.

You can use as const to convert the entire object to be type literals:

```ts
const req = { url: "https://example.com", method: "GET" } as const;
handleRequest(req.url, req.method);
```

The as const suffix acts like const but for the type system, ensuring that all properties are assigned the literal type instead of a more general version like string or number.

## null and undefined

`null和undefined`

JavaScript has two primitive values used to signal absent or uninitialized value: null and undefined.

TypeScript has two corresponding types by the same names. How these types behave depends on whether you have the strictNullChecks option on.

## strictNullChecks off

`strictNullChecks关闭`

With strictNullChecks off, values that might be null or undefined can still be accessed normally, and the values null and undefined can be assigned to a property of any type. This is similar to how languages without null checks (e.g. C#, Java) behave. The lack of checking for these values tends to be a major source of bugs; we always recommend people turn strictNullChecks on if it’s practical to do so in their codebase.

## strictNullChecks on

`strictNullChecks开启`

With strictNullChecks on, when a value is null or undefined, you will need to test for those values before using methods or properties on that value. Just like checking for undefined before using an optional property, we can use narrowing to check for values that might be null:

```ts
function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```

## Non-null Assertion Operator (Postfix !)

`非空断言运算符`

TypeScript also has a special syntax for removing null and undefined from a type without doing any explicit checking. Writing ! after any expression is effectively a type assertion that the value isn’t null or undefined:

```ts
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

Just like other type assertions, this doesn’t change the runtime behavior of your code, so it’s important to only use ! when you know that the value can’t be null or undefined.

## Enums

`枚举`

Enums are a feature added to JavaScript by TypeScript which allows for describing a value which could be one of a set of possible named constants. Unlike most TypeScript features, this is not a type-level addition to JavaScript but something added to the language and runtime. Because of this, it’s a feature which you should know exists, but maybe hold off on using unless you are sure. You can read more about enums in the Enum reference page.

## Less Common Primitives

`更少常见的原始类型`
It’s worth mentioning the rest of the primitives in JavaScript which are represented in the type system. Though we will not go into depth here.

bigint
From ES2020 onwards, there is a primitive in JavaScript used for very large integers, BigInt:

```ts
// Creating a bigint via the BigInt function
const oneHundred: bigint = BigInt(100);

// Creating a BigInt via the literal syntax
const anotherHundred: bigint = 100n;
```

You can learn more about BigInt in the TypeScript 3.2 release notes.

## symbol

There is a primitive in JavaScript used to create a globally unique reference via the function Symbol():

```ts
const firstName = Symbol("name");
const secondName = Symbol("name");

if (firstName === secondName) {
This condition will always return 'false' since the types 'typeof firstName' and 'typeof secondName' have no overlap.
  // Can't ever happen
}
```

You can learn more about them in Symbols reference page.

## 参考文档

[Typescript 常见类型](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean)
