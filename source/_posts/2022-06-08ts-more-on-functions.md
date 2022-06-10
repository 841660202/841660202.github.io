---
title: 5.Typescript手册 函数
date: 2022-06-07 21:21:19
categories:
tags: []
cover: https://img0.baidu.com/it/u=86492913,3057347241&fm=253&fmt=auto&app=138&f=JPEG?w=499&h=208
---

Functions are the basic building block of any application, whether they’re local functions, imported from another module, or methods on a class. They’re also values, and just like other values, TypeScript has many ways to describe how functions can be called. Let’s learn about how to write types that describe functions.

## Function Type Expressions

`函数类型表达式`
The simplest way to describe a function is with a function type expression. These types are syntactically similar to arrow functions:
`最简单描述一个函数的方式是使用函数类型表达式（function type expression）。**它的写法有点类似于箭头函数：`

```typescript
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);
```

The syntax (a: string) => void means “a function with one parameter, named a, of type string, that doesn’t have a return value”. Just like with function declarations, if a parameter type isn’t specified, it’s implicitly any.
`这个函数类型表达式的语法（a: string）=> void，意思是“一个参数，名为a，类型为string，没有返回值”。`
Note that the parameter name is required. The function type (string) => void means “a function with a parameter named string of type any“!
`注意，参数名是必需的。函数类型（string）=> void意思是“一个参数名为string，类型为any”！`
Of course, we can use a type alias to name a function type:
`类型别名，可以命名一个函数类型：`

```typescript
type GreetFunction = (a: string) => void;
function greeter(fn: GreetFunction) {
  // ...
}
```

## Call Signatures

`调用签名`

In JavaScript, functions can have properties in addition to being callable. However, the function type expression syntax doesn’t allow for declaring properties. If we want to describe something callable with properties, we can write a call signature in an object type:
`在JavaScript中，函数可以有属性，但是函数类型表达式语法不允许声明属性。`

```typescript
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}
```

Note that the syntax is slightly different compared to a function type expression - use : between the parameter list and the return type rather than =>.
`注意，语法与函数类型表达式不同，使用:在参数列表和返回类型之间。`

## Construct Signatures

`构造签名`
JavaScript functions can also be invoked with the new operator. TypeScript refers to these as constructors because they usually create a new object. You can write a construct signature by adding the new keyword in front of a call signature:
`JavaScript函数也可以使用new操作符。TypeScript将它们称为构造函数，因为它们通常会创建一个新的对象。`

```typescript
type SomeConstructor = {
  new (s: string): SomeObject;
};
function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}
```

Some objects, like JavaScript’s Date object, can be called with or without new. You can combine call and construct signatures in the same type arbitrarily:
`一些对象，如JavaScript的Date对象，可以使用或不使用new。你可以在同一类型中同时使用调用和构造签名：`

```typescript
interface CallOrConstruct {
  new (s: string): Date;
  (n?: number): number;
}
```

## Generic Functions

`泛型函数`
It’s common to write a function where the types of the input relate to the type of the output, or where the types of two inputs are related in some way. Let’s consider for a moment a function that returns the first element of an array:
`我们经常需要写这种函数，即函数的输出类型依赖函数的输入类型，或者两个输入的类型以某种形式相互关联。让我们考虑这样一个函数，它返回数组的第一个元素：`

```typescript
function firstElement(arr: any[]) {
  return arr[0];
}
```

This function does its job, but unfortunately has the return type any. It’d be better if the function returned the type of the array element.
`注意此时函数返回值的类型是 any，如果能返回第一个元素的具体类型就更好了。`
In TypeScript, generics are used when we want to describe a correspondence between two values. We do this by declaring a type parameter in the function signature:
`在TypeScript中，我们可以使用泛型来描述两个值之间的关系。我们这样做的目的是为了描述函数的输入和输出之间的关系。`

```typescript
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```

By adding a type parameter Type to this function and using it in two places, we’ve created a link between the input of the function (the array) and the output (the return value). Now when we call it, a more specific type comes out:
`在此函数中添加一个类型参数Type，并在两处使用它，我们创建了一个函数的输入和输出之间的关系。`

```typescript
// s is of type 'string'
const s = firstElement(["a", "b", "c"]);
// n is of type 'number'
const n = firstElement([1, 2, 3]);
// u is of type undefined
const u = firstElement([]);
```

## Inference

`接口`
Note that we didn’t have to specify Type in this sample. The type was inferred - chosen automatically - by TypeScript.
`注意，我们在这个例子中没有指定类型。TypeScript自动推断出来了。`
We can use multiple type parameters as well. For example, a standalone version of map would look like this:
`我们可以使用多个类型参数。例如，一个单独版本的map函数会如下所示：`

```ts
function map<Input, Output>(
  arr: Input[],
  func: (arg: Input) => Output
): Output[] {
  return arr.map(func);
}

// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));
```

Note that in this example, TypeScript could infer both the type of the Input type parameter (from the given string array), as well as the Output type parameter based on the return value of the function expression (number).
`在这个例子中，TypeScript可以推断出Input类型参数的类型（从给定的字符串数组），以及Output类型参数的类型，基于函数表达式的返回值（number）。`

## Constraints

`约束`
We’ve written some generic functions that can work on any kind of value. Sometimes we want to relate two values, but can only operate on a certain subset of values. In this case, we can use a constraint to limit the kinds of types that a type parameter can accept.
`我们写了一些可以操作任意类型的函数。有时候，我们可以只操作一个特定的类型集合。在这种情况下，我们可以使用约束来限制类型参数可以接受的类型。`
Let’s write a function that returns the longer of two values. To do this, we need a length property that’s a number. We constrain the type parameter to that type by writing an extends clause:
`我们写一个函数，返回两个值的长度。我们需要一个length属性，它是一个数字。我们通过写一个extends子句来限制类型参数：`

```typescript
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
// Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
```

There are a few interesting things to note in this example. We allowed TypeScript to infer the return type of longest. Return type inference also works on generic functions.
`在这个例子中，我们允许TypeScript推断longest的返回类型。返回类型推断也可以在泛型函数中使用。`
Because we constrained Type to { length: number }, we were allowed to access the .length property of the a and b parameters. Without the type constraint, we wouldn’t be able to access those properties because the values might have been some other type without a length property.
`因为我们限制了类型参数为{ length: number }，所以我们可以访问a和b参数的.length属性。没有类型约束，我们不能访问这些属性，因为值可能是其他类型而没有length属性。`
The types of longerArray and longerString were inferred based on the arguments. Remember, generics are all about relating two or more values with the same type!
`longerArray和longerString的类型是根据参数的类型推断出来的。记住，泛型是关于两个或多个值具有相同类型的问题！`
Finally, just as we’d like, the call to longest(10, 100) is rejected because the number type doesn’t have a .length property.
`最后，我们想要，调用longest(10, 100)会被拒绝，因为数字类型没有.length属性。`

## Working with Constrained Values

`工作中的约束值`
Here’s a common error when working with generic constraints:
`这里是工作中常见的错误：`

```typescript
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    return { length: minimum };
    // Type '{ length: number; }' is not assignable to type 'Type'.
    // '{ length: number; }' is assignable to the constraint of type 'Type', but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'.
  }
}
```

It might look like this function is OK - Type is constrained to { length: number }, and the function either returns Type or a value matching that constraint. The problem is that the function promises to return the same kind of object as was passed in, not just some object matching the constraint. If this code were legal, you could write code that definitely wouldn’t work:
`这个函数看起来是可以的，因为Type是约束为{ length: number }，函数可以返回Type或者匹配这个约束的值。问题是，函数承诺返回传入的同样类型的对象，而不是匹配约束的对象。如果这段代码是合法的，你可以写一段代码，它永远不会运行：`

```typescript
// 'arr' gets value { length: 6 }
const arr = minimumLength([1, 2, 3], 6);
// and crashes here because arrays have
// a 'slice' method, but not the returned object!
console.log(arr.slice(0));
```

## Specifying Type Arguments

`明确指定类型参数`
TypeScript can usually infer the intended type arguments in a generic call, but not always. For example, let’s say you wrote a function to combine two arrays:
`Typescript通常可以在泛型调用中推断出意图的类型参数，但不是所有的情况。例如，如果你写了一个函数，用来合并两个数组：`

```typescript
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}
```

Normally it would be an error to call this function with mismatched arrays:
`通常情况下，如果调用这个函数传入不匹配的数组，就会报错：`

```typescript
const arr = combine([1, 2, 3], ["hello"]);
// Type 'string' is not assignable to type 'number'.
```

If you intended to do this, however, you could manually specify Type:
`如果你想这样做，你可以手动指定Type：`

```typescript
const arr = combine<string | number>([1, 2, 3], ["hello"]);
```

## Guidelines for Writing Good Generic Functions

`写好泛型函数的指南`
Writing generic functions is fun, and it can be easy to get carried away with type parameters. Having too many type parameters or using constraints where they aren’t needed can make inference less successful, frustrating callers of your function.
`写好泛型函数是很有趣的，也可以很容易地使用类型参数。有太多类型参数或者使用约束，而且这些约束不需要的话，推断就会更加不成功，使用者会困惑。`

## Push Type Parameters Down

`推下类型参数`
Here are two ways of writing a function that appear similar:
`这里有两种方式写一个函数，看起来像是一样的：`

```typescript
function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}

function firstElement2<Type extends any[]>(arr: Type) {
  return arr[0];
}

// a: number (good)
const a = firstElement1([1, 2, 3]);
// b: any (bad)
const b = firstElement2([1, 2, 3]);
```

These might seem identical at first glance, but firstElement1 is a much better way to write this function. Its inferred return type is Type, but firstElement2’s inferred return type is any because TypeScript has to resolve the arr[0] expression using the constraint type, rather than “waiting” to resolve the element during a call.
`这两个函数看起来像是一样的，但是firstElement1更好的写法。它的推断返回类型是Type，但firstElement2的推断返回类型是any，因为TypeScript要在调用时使用约束类型，而不是等待元素被解析。`
Rule: When possible, use the type parameter itself rather than constraining it
`当可能的话，尽量使用类型参数本身而不约束它`
Use Fewer Type Parameters
`使用更少的类型参数`
Here’s another pair of similar functions:
`这里有一对相似的函数：`

```typescript
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}

function filter2<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func);
}
```

We’ve created a type parameter Func that doesn’t relate two values. That’s always a red flag, because it means callers wanting to specify type arguments have to manually specify an extra type argument for no reason. Func doesn’t do anything but make the function harder to read and reason about!
`我们创建了一个类型参数Func，它不关联两个值。这是一个红线，因为它意味着调用者希望指定类型参数时，必须手动指定一个额外的类型参数。Func不做任何事情，只是让这个函数更难读，理解。`
Rule: Always use as few type parameters as possible
`总是使用最少的类型参数`

## Type Parameters Should Appear Twice

`类型参数应该出现两次`
Sometimes we forget that a function might not need to be generic:
`有时候我们忘记了一个函数可能不需要泛型：`

```ts
function greet<Str extends string>(s: Str) {
  console.log("Hello, " + s);
}

greet("world");
```

We could just as easily have written a simpler version:
`我们可以简单的写一个更简单的版本：`

```ts
function greet(s: string) {
  console.log("Hello, " + s);
}
```

Remember, type parameters are for relating the types of multiple values. If a type parameter is only used once in the function signature, it’s not relating anything.
`记住，类型参数是用来关联多个值的类型的。如果一个类型参数只被一次使用在函数签名中，它不关联任何东西。`
Rule: If a type parameter only appears in one location, strongly reconsider if you actually need it
`如果一个类型参数只出现在一个位置，强烈建议如果你实际上需要它的话，`

## Optional Parameters

`可选参数`
Functions in JavaScript often take a variable number of arguments. For example, the toFixed method of number takes an optional digit count:
`在 JavaScript 中，函数通常会接受一个可变数量的参数。例如，number 的 toFixed 方法接受一个可选的位数：`

```typescript
function f(n: number) {
  console.log(n.toFixed()); // 0 arguments
  console.log(n.toFixed(3)); // 1 argument
}
```

We can model this in TypeScript by marking the parameter as optional with ?:
`我们可以在 TypeScript 中使用 ?: 来标记可选参数`

```typescript
function f(x?: number) {
  // ...
}
f(); // OK
f(10); // OK
```

Although the parameter is specified as type number, the x parameter will actually have the type number | undefined because unspecified parameters in JavaScript get the value undefined.
`在 JavaScript 中，未指定参数的值会被设置为 undefined。`
You can also provide a parameter default:
`你也可以提供一个参数默认值：`

```typescript
function f(x = 10) {
  // ...
}
```

Now in the body of f, x will have type number because any undefined argument will be replaced with 10. Note that when a parameter is optional, callers can always pass undefined, as this simply simulates a “missing” argument:
`在 f 中的 body 中，x 将有 number 类型，因为任何未定义的参数都会被替换为 10。`

```ts
declare function f(x?: number): void;
// cut
// All OK
f();
f(10);
f(undefined);
```

## Optional Parameters in Callbacks

`回调函数中的可选参数`
Once you’ve learned about optional parameters and function type expressions, it’s very easy to make the following mistakes when writing functions that invoke callbacks:
`一旦你学会了可选参数和函数类型表达式，写函数调用回调函数时很容易出错：`

```ts
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}
```

What people usually intend when writing index? as an optional parameter is that they want both of these calls to be legal:
`人们常常希望写 index 作为可选参数，这意味着它们都是合法的：`

```ts
myForEach([1, 2, 3], (a) => console.log(a));
myForEach([1, 2, 3], (a, i) => console.log(a, i));
```

What this actually means is that callback might get invoked with one argument. In other words, the function definition says that the implementation might look like this:
`这实际上意味着回调函数可能会被调用一个参数。`

```ts
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    // I don't feel like providing the index today
    callback(arr[i]);
  }
}
```

In turn, TypeScript will enforce this meaning and issue errors that aren’t really possible:
`在 TypeScript 中，会发出这些不可能的错误：`

```ts
myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed());
  // Object is possibly 'undefined'.
});
```

In JavaScript, if you call a function with more arguments than there are parameters, the extra arguments are simply ignored. TypeScript behaves the same way. Functions with fewer parameters (of the same types) can always take the place of functions with more parameters.
`在 JavaScript 中，如果调用函数的参数多于参数，那么这些多余的参数将被忽略。TypeScript 也会像这样。函数可以接受多个参数，但是参数的类型必须是相同的。`
When writing a function type for a callback, never write an optional parameter unless you intend to call the function without passing that argument
`写一个回调函数类型时，如果你不想传递这个参数，就不要写可选参数。`

## Function Overloads

`函数重载`
Some JavaScript functions can be called in a variety of argument counts and types. For example, you might write a function to produce a Date that takes either a timestamp (one argument) or a month/day/year specification (three arguments).
`在 JavaScript 中，可以调用一个函数，参数的数量和类型都不一样。例如，你可以写一个函数，用来生成一个 Date 对象，可以接受一个时间戳（一个参数）或一个月/日/年 的指定（三个参数）。`
In TypeScript, we can specify a function that can be called in different ways by writing overload signatures. To do this, write some number of function signatures (usually two or more), followed by the body of the function:
`在 TypeScript 中，我们可以写一个函数，它可以被调用不同的参数和类型，通过写出多个函数类型（通常是两个或多个），然后写出函数的 body：`

```ts
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);
// No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
```

In this example, we wrote two overloads: one accepting one argument, and another accepting three arguments. These first two signatures are called the overload signatures.
`在这个例子中，我们写了两个函数类型：一个只接受一个参数，一个只接受三个参数。这两个第一个类型是函数类型。`
Then, we wrote a function implementation with a compatible signature. Functions have an implementation signature, but this signature can’t be called directly. Even though we wrote a function with two optional parameters after the required one, it can’t be called with two parameters!
`然后，我们写了一个函数实现，这个函数类型不能直接调用。即使我们写了一个参数后，再写了一个可选参数，也不能调用两个参数。虽然我们写了两个参数，但是不能调用两个参数。`

## Overload Signatures and the Implementation Signature

`重载签名和实现签名`
This is a common source of confusion. Often people will write code like this and not understand why there is an error:
`这是一个常见的混乱源。很多人写了这样的代码，但是不知道为什么会有错误。`

```ts
function fn(x: string): void;
function fn() {
  // ...
}
// Expected to be able to call with zero arguments
fn();
// Expected 1 arguments, but got 0.
```

Again, the signature used to write the function body can’t be “seen” from the outside.
`再次，写出函数的 body 的签名不能被外部看到。`
The signature of the implementation is not visible from the outside. When writing an overloaded function, you should always have two or more signatures above the implementation of the function.
`在写一个重载函数时，你应该总是写两个或多个签名，在函数的实现之上。你应该总是写两个或多个签名，在函数的实现之上。`
The implementation signature must also be compatible with the overload signatures. For example, these functions have errors because the implementation signature doesn’t match the overloads in a correct way:
`实现签名必须与重载签名一致。例如，这些函数有错误，因为实现签名不正确。`

```ts
function fn(x: boolean): void;
// Argument type isn't right
function fn(x: string): void;
// This overload signature is not compatible with its implementation signature.
function fn(x: boolean) {}

function fn(x: string): string;
// Return type isn't right
function fn(x: number): boolean;
// This overload signature is not compatible with its implementation signature.
function fn(x: string | number) {
  return "oops";
}
```

## Writing Good Overloads

`写好重载`
Like generics, there are a few guidelines you should follow when using function overloads. Following these principles will make your function easier to call, easier to understand, and easier to implement.
`就像泛型一样，也有一些建议提供给你。遵循这些原则，可以让你的函数更方便调用、理解。`
Let’s consider a function that returns the length of a string or an array:
`我们来考虑一个函数，它返回一个字符串或数组的长度：`

```ts
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
  return x.length;
}
```

This function is fine; we can invoke it with strings or arrays. However, we can’t invoke it with a value that might be a string or an array, because TypeScript can only resolve a function call to a single overload:
`这个函数代码功能实现了，也没有什么报错，但我们不能传入一个可能是字符串或者是数组的值，因为 TypeScript 只能一次用一个函数重载处理一次函数调用。`

```ts
len(""); // OK
len([0]); // OK
len(Math.random() > 0.5 ? "hello" : [0]);
// No overload matches this call.
// 没有匹配的重载函数。
// Overload 1 of 2, '(s: string): number', gave the following error.
// 重载 1 和 2 之间的函数调用报错。
// Argument of type 'number[] | "hello"' is not assignable to parameter of type 'string'.
//  参数类型 'number[] | "hello"' 不能赋值给参数类型 'string'。
// Type 'number[]' is not assignable to type 'string'.
// 类型 'number[]' 不能赋值给类型 'string'。
// Overload 2 of 2, '(arr: any[]): number', gave the following error.
// 重载 2 和 2 之间的函数调用报错。
// Argument of type 'number[] | "hello"' is not assignable to parameter of type 'any[]'.
// 参数类型 'number[] | "hello"' 不能赋值给参数类型 'any[]'。
// Type 'string' is not assignable to type 'any[]'.
// 类型 'string' 不能赋值给类型 'any[]'。
```

Because both overloads have the same argument count and same return type, we can instead write a non-overloaded version of the function:
`因为两个重载函数的参数数量和返回值类型都一样，我们可以写一个不重载的函数：`

```ts
function len(x: any[] | string) {
  return x.length;
}
```

This is much better! Callers can invoke this with either sort of value, and as an added bonus, we don’t have to figure out a correct implementation signature.
`这更好了！调用者可以传入任意类型的值，并且我们不需要再去找一个正确的实现签名。`
Always prefer parameters with union types instead of overloads when possible
`如果可以的话，尽量使用联合类型而不是重载函数。`

## Declaring this in a Function

`在函数中声明 this`
TypeScript will infer what the this should be in a function via code flow analysis, for example in the following:
`TypeScript 会根据代码流分析来决定函数中 this 的值。例如，在下面的代码中：`

```ts
const user = {
  id: 123,

  admin: false,
  becomeAdmin: function () {
    this.admin = true;
  },
};
```

TypeScript understands that the function user.becomeAdmin has a corresponding this which is the outer object user. this, heh, can be enough for a lot of cases, but there are a lot of cases where you need more control over what object this represents. The JavaScript specification states that you cannot have a parameter called this, and so TypeScript uses that syntax space to let you declare the type for this in the function body.
`TypeScript 知道函数 user.becomeAdmin 有一个对应的 this，这个 this 可以足够大部分的情况，但有很多情况需要更多的控制权。 JavaScript 规范禁止使用 this 参数，因此 TypeScript 使用这种语法空间来声明函数体中 this 的类型。`

```ts
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(function (this: User) {
  return this.admin;
});
```

This pattern is common with callback-style APIs, where another object typically controls when your function is called. Note that you need to use function and not arrow functions to get this behavior:
`这种模式通常出现在回调函数风格的 API 中，其中另一个对象通常控制函数调用的时机。请注意，你需要使用 function 而不是 arrow function 来获取这种行为。`

```ts
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(() => this.admin);
// The containing arrow function captures the global value of 'this'.
// 这个包含的箭头函数捕获了全局值 'this'。
// Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.
// 元素隐式有一个 'any' 类型，因为类型 'typeof globalThis' 没有索引签名。
```

## Other Types to Know About

`其他需要知道的类型`
There are some additional types you’ll want to recognize that appear often when working with function types. Like all types, you can use them everywhere, but these are especially relevant in the context of functions.
`这里介绍一些也会经常出现的类型。像其他的类型一样，你也可以在任何地方使用它们，但它们经常与函数搭配使用。`
**void**

void represents the return value of functions which don’t return a value. It’s the inferred type any time a function doesn’t have any return statements, or doesn’t return any explicit value from those return statements:
`void 类型表示函数没有返回值的情况。它在函数没有返回值的情况下被推断为 any 类型。`

```ts
// The inferred return type is void
function noop() {
  return;
}
```

In JavaScript, a function that doesn’t return any value will implicitly return the value undefined. However, void and undefined are not the same thing in TypeScript. There are further details at the end of this chapter.
`在 JavaScript 中，函数没有返回值的情况下，函数会自动返回 undefined。但是在 TypeScript 中，void 和 undefined 的类型不一样。有更多详情在本章末尾。`
void is not the same as undefined.
`void 类型不是 undefined 类型。`

**object**

The special type object refers to any value that isn’t a primitive (string, number, bigint, boolean, symbol, null, or undefined). This is different from the empty object type { }, and also different from the global type Object. It’s very likely you will never use Object.
`这个特殊的类型 object 可以表示任何不是原始类型（primitive）的值 (string、number、bigint、boolean、symbol、null、undefined)。object 不同于空对象类型 { }，也不同于全局类型 Object。很有可能你也用不到 Object`

> object is not Object. Always use object!
> `object 不同于 Object ，总是用 object!`

Note that in JavaScript, function values are objects: They have properties, have Object.prototype in their prototype chain, are instanceof Object, you can call Object.keys on them, and so on. For this reason, function types are considered to be objects in TypeScript.
`注意在 JavaScript 中，函数就是对象，他们可以有属性，在他们的原型链上有 Object.prototype，并且 instanceof Object。你可以对函数使用 Object.keys 等等。由于这些原因，在 TypeScript 中，函数也被认为是 object。`

**unknown**

The unknown type represents any value. This is similar to the any type, but is safer because it’s not legal to do anything with an unknown value:
`unknown 类型可以表示任何值。有点类似于 any，但是更安全，因为对 unknown 类型的值做任何事情都是不合法的：`

```ts
function f1(a: any) {
  a.b(); // OK
}
function f2(a: unknown) {
  a.b();
  // Object is of type 'unknown'.
}
```

This is useful when describing function types because you can describe functions that accept any value without having any values in your function body.
`有的时候用来描述函数类型，还是蛮有用的。你可以描述一个函数可以接受传入任何值，但是在函数体内又不用到 any 类型的值。`
Conversely, you can describe a function that returns a value of unknown type:
`相反，你可以描述一个函数返回一个不知道什么类型的值，比如：`

```ts
function safeParse(s: string): unknown {
  return JSON.parse(s);
}

// Need to be careful with 'obj'!
const obj = safeParse(someRandomString);
```

**never**

Some functions never return a value:
`一些函数从来不返回值：`

```ts
function fail(msg: string): never {
  throw new Error(msg);
}
```

The never type represents values which are never observed. In a return type, this means that the function throws an exception or terminates execution of the program.
`never 类型表示一个值不会再被观察到 (observed)。作为一个返回类型时，它表示这个函数会丢一个异常，或者会结束程序的执行。`
never also appears when TypeScript determines there’s nothing left in a union.
`当 TypeScript 确定在联合类型中已经没有可能是其中的类型的时候，never 类型也会出现：`

```ts
function fn(x: string | number) {
  if (typeof x === "string") {
    // do something
  } else if (typeof x === "number") {
    // do something else
  } else {
    x; // has type 'never'!
  }
}
```

**Function**

The global type Function describes properties like bind, call, apply, and others present on all function values in JavaScript. It also has the special property that values of type Function can always be called; these calls return any:
`Function 类型描述了所有函数值的属性，比如 bind、call、apply 等等。这个类型也有一个特殊的属性，可以被调用，这些调用会返回任何类型的值：`

```ts
function doSomething(f: Function) {
  return f(1, 2, 3);
}
```

This is an untyped function call and is generally best avoided because of the unsafe any return type.
`这是一个无类型函数调用 (untyped function call)，这种调用最好被避免，因为它返回的是一个不安全的 any类型。`
If you need to accept an arbitrary function but don’t intend to call it, the type () => void is generally safer.
`如果你准备接受一个黑盒的函数，但是又不打算调用它，() => void 会更安全一些。`

## Rest Parameters and Arguments

`剩余参数`
**Background Reading:**

- Rest Parameters
- Spread Syntax

## Rest Parameters

`剩余参数`
In addition to using optional parameters or overloads to make functions that can accept a variety of fixed argument counts, we can also define functions that take an unbounded number of arguments using rest parameters.
`除了用可选参数、重载能让函数接收不同数量的函数参数，我们也可以通过使用剩余参数语法（rest parameters），定义一个可以传入数量不受限制的函数参数的函数：`
A rest parameter appears after all other parameters, and uses the ... syntax:
`剩余参数必须放在所有参数的最后面，并使用 ... 语法：`

```ts
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n \* x);
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```

In TypeScript, the type annotation on these parameters is implicitly any[] instead of any, and any type annotation given must be of the form Array<T>or T[], or a tuple type (which we’ll learn about later).
`在 TypeScript 中，剩余参数的类型会被隐式设置为 any[] 而不是 any，如果你要设置具体的类型，必须是 Array<T> 或者 T[]的形式，再或者就是元组类型（tuple type）。`

## Rest Arguments

`剩余参数`
Conversely, we can provide a variable number of arguments from an array using the spread syntax. For example, the push method of arrays takes any number of arguments:
`我们可以借助一个使用 ... 语法的数组，为函数提供不定数量的实参。举个例子，数组的 push 方法就可以接受任何数量的实参：`

```ts
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2);
```

Note that in general, TypeScript does not assume that arrays are immutable. This can lead to some surprising behavior:
`注意一般情况下，TypeScript 并不会假定数组是不变的(immutable)，这会导致一些意外的行为：`

```ts
// Inferred type is number[] -- "an array with zero or more numbers",
// not specifically two numbers
const args = [8, 5];
const angle = Math.atan2(...args);
// A spread argument must either have a tuple type or be passed to a rest parameter.
```

The best fix for this situation depends a bit on your code, but in general a const context is the most straightforward solution:
`这种情况的最佳解决方案可能是一个更简单的方案：`

```ts
// Inferred as 2-length tuple
const args = [8, 5] as const;
// OK
const angle = Math.atan2(...args);
```

Using rest arguments may require turning on downlevelIteration when targeting older runtimes.
`使用剩余参数可能需要在更旧的运行时配合 downlevelIteration 参数。`

## Parameter Destructuring

`你可以使用参数解构方便的将作为参数提供的对象解构为函数体内一个或者多个局部变量，在 JavaScript 中，是这样的：`

**Background Reading:**

- Destructuring Assignment

You can use parameter destructuring to conveniently unpack objects provided as an argument into one or more local variables in the function body. In JavaScript, it looks like this:
`你可以使用参数解构来轻松地将一个作为参数提供的对象解构为函数体内一个或者多个局部变量。在 JavaScript 中，它的样子是这样的：`

```ts
function sum({ a, b, c }) {
  console.log(a + b + c);
}
sum({ a: 10, b: 3, c: 9 });
// The type annotation for the object goes after the destructuring syntax:

function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}
```

This can look a bit verbose, but you can use a named type here as well:
`这可能会太长，但你可以使用一个命名类型：`

```ts
// Same as prior example
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```

## Assignability of Functions

`函数的可赋值性`
Return type void
`返回void`
The void return type for functions can produce some unusual, but expected behavior.
`函数的返回类型为void时，可能会产生一些有意想不到的行为。`
Contextual typing with a return type of void does not force functions to not return something. Another way to say this is a contextual function type with a void return type (type vf = () => void), when implemented, can return any other value, but it will be ignored.
`在一个返回类型为void的函数中，不会强制函数不返回什么东西。另一种说法是一个上下文函数类型，它的返回类型为void，当实现的时候，可以返回任何值，但是它将被忽略。`
Thus, the following implementations of the type () => void are valid:
`因此，下面的实现是有效的：`

```ts
type voidFunc = () => void;

const f1: voidFunc = () => {
  return true;
};

const f2: voidFunc = () => true;

const f3: voidFunc = function () {
  return true;
};
```

And when the return value of one of these functions is assigned to another variable, it will retain the type of void:
`当一个函数的返回值被赋值给另一个变量时，它将保持返回类型为void的类型：`

```ts
const v1 = f1();

const v2 = f2();

const v3 = f3();
```

This behavior exists so that the following code is valid even though Array.prototype.push returns a number and the Array.prototype.forEach method expects a function with a return type of void.
`这种行为存在，这样就可以保证下面的代码是有效的，即使 Array.prototype.push 返回一个数字，Array.prototype.forEach 方法也期望一个返回类型为void的函数。`

```ts
const src = [1, 2, 3];
const dst = [0];

src.forEach((el) => dst.push(el));
```

There is one other special case to be aware of, when a literal function definition has a void return type, that function must not return anything.
`当一个字面量函数定义有一个返回类型为void的函数，那么函数必须不返回任何东西。`

```ts
function f2(): void {
  // @ts-expect-error
  return true;
}

const f3 = function (): void {
  // @ts-expect-error , Type 'boolean' is not assignable to type 'void'.
  return true;
};
```

For more on void please refer to these other documentation entries:
`更多关于void的文档请参见这些其他文档条目：`
[v1 handbook](https://www.typescriptlang.org/docs/handbook/basic-types.html#void)
[v2 handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html#void)
FAQ - “Why are functions returning non-void assignable to function returning void?”
`为什么函数返回非void类型可以赋值给函数返回void类型？`

## 参考链接

[TypeScript 手册 functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
[函数（More On Functions）](https://ts.yayujs.com/handbook/MoreOnFunctions.html#%E5%87%BD%E6%95%B0-more-on-functions)
