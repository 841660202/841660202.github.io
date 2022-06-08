---
title: 4.Typescript手册 收缩类型
date: 2022-06-08 09:21:19
categories: typescript
tags: [typescript]
cover:
---

## Narrowing

`缩小范围`

Imagine we have a function called padLeft.
`试想我们有这样一个函数，函数名为 padLeft：`

```ts
function padLeft(padding: number | string, input: string): string {
  throw new Error("Not implemented yet!");
}
```

If padding is a number, it will treat that as the number of spaces we want to prepend to input. If padding is a string, it should just prepend padding to input. Let’s try to implement the logic for when padLeft is passed a number for padding.

`如果 padding 是数字，它将会将 padding 视为我们要添加的空格数量，如果 padding 是字符串，它将会添加 padding 到 input 的前面。`

```ts
function padLeft(padding: number | string, input: string) {
  return " ".repeat(padding) + input;
  // Argument of type 'string | number' is not assignable to parameter of type 'number'.
  // 参数类型 'string | number' 不能赋值给参数类型 'number'。
  // Type 'string' is not assignable to type 'number'.
  // 类型 'string' 不能赋值给类型 'number'。
}
```

Uh-oh, we’re getting an error on padding.
`哇，我们得到一个错误，padding。`
TypeScript is warning us that adding a number | string to a number might not give us what we want, and it’s right. In other words, we haven’t explicitly checked if padding is a number first, nor are we handling the case where it’s a string, so let’s do exactly that.
`这是 TypeScript 在警告我们，如果把一个 number 类型 (即例子里的数字 1 )和一个 number | string 类型相加，也许并不会达到我们想要的结果。换句话说，我们应该先检查下 padding 是否是一个 number，或者处理下当 padding 是 string 的情况，那我们可以这样做：`

```ts
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

If this mostly looks like uninteresting JavaScript code, that’s sort of the point. Apart from the annotations we put in place, this TypeScript code looks like JavaScript. The idea is that TypeScript’s type system aims to make it as easy as possible to write typical JavaScript code without bending over backwards to get type safety.
`如果这个代码看起来没有什么意思，那就是 TypeScript 的类型系统希望我们能写出一些比较普通的 JavaScript 代码，而不是折腾至最后才知道类型安全。`
While it might not look like much, there’s actually a lot going under the covers here. Much like how TypeScript analyzes runtime values using static types, it overlays type analysis on JavaScript’s runtime control flow constructs like if/else, conditional ternaries, loops, truthiness checks, etc., which can all affect those types.
`这里的实现比较简单，但是它真的是一个类型检查器，它会在 JavaScript 中的 if/else、条件表达式、循环、真假值检查等控制流中进行类型检查。`
Within our if check, TypeScript sees typeof padding === "number" and understands that as a special form of code called a type guard. TypeScript follows possible paths of execution that our programs can take to analyze the most specific possible type of a value at a given position. It looks at these special checks (called type guards) and assignments, and the process of refining types to more specific types than declared is called narrowing. In many editors we can observe these types as they change, and we’ll even do so in our examples.
`在我们的 if 检查中，TypeScript 会看到 typeof padding === "number"，并且会解释这个表达式为一个特殊的代码，这个代码被称为类型检查。TypeScript 会根据我们的程序的执行流，来检查一个值的最具体的类型。这些特殊的检查（称为类型检查）和赋值，会影响到类型的精确性。在编辑器中，我们可以看到这些类型的变化，我们也会在我们的例子中看到。`

```ts
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;

    // (parameter) padding: number
  }
  return padding + input;

  // (parameter) padding: string
}
```

There are a couple of different constructs TypeScript understands for narrowing.
`TypeScript 会理解一些更加精确的构造。`

## typeof type guards

`类型保护`

As we’ve seen, JavaScript supports a typeof operator which can give very basic information about the type of values we have at runtime. TypeScript expects this to return a certain set of strings:
`JavaScript 支持一个 typeof 操作符，它可以给我们的值返回一些基本的信息。TypeScript 期望这些信息是一个特定的集合：`

"string"
"number"
"bigint"
"boolean"
"symbol"
"undefined"
"object"
"function"

Like we saw with padLeft, this operator comes up pretty often in a number of JavaScript libraries, and TypeScript can understand it to narrow types in different branches.
`和 padLeft 一样，这个操作符在 JavaScript 库中很常见，TypeScript 可以理解它来缩小不同的分支的类型。`
In TypeScript, checking against the value returned by typeof is a type guard. Because TypeScript encodes how typeof operates on different values, it knows about some of its quirks in JavaScript. For example, notice that in the list above, typeof doesn’t return the string null. Check out the following example:
`在 TypeScript 中，检查 typeof 返回的值就是一种类型保护。TypeScript 知道 typeof 不同值的结果，它也能识别 JavaScript 中一些怪异的地方，就比如在上面的列表中，typeof 并没有返回字符串 null，看下面这个例子：`

```ts
function printAll(strs: string | string[] | null) {
  if (typeof strs === "object") {
    for (const s of strs) {
      // Object is possibly 'null'.
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  } else {
    // do nothing
  }
}
```

In the printAll function, we try to check if strs is an object to see if it’s an array type (now might be a good time to reinforce that arrays are object types in JavaScript). But it turns out that in JavaScript, typeof null is actually "object"! This is one of those unfortunate accidents of history.
`在这个 printAll 函数中，我们尝试判断 strs 是否是一个对象，原本的目的是判断它是否是一个数组类型，但是在 JavaScript 中，typeof null 也会返回 object。而这是 JavaScript 一个不幸的历史事故。`
Users with enough experience might not be surprised, but not everyone has run into this in JavaScript; luckily, TypeScript lets us know that strs was only narrowed down to string[] | null instead of just string[].
`熟练的用户自然不会感到惊讶，但也并不是所有人都如此熟练。不过幸运的是，TypeScript 会让我们知道 strs 被收窄为 strings[] | null ，而不仅仅是 string[]。`
This might be a good segue into what we’ll call “truthiness” checking.
`这可能是一个好的转折点。`

## Truthiness narrowing

`真实性缩减`

Truthiness might not be a word you’ll find in the dictionary, but it’s very much something you’ll hear about in JavaScript.
`真实性可能不是在字典里面找到的，但是你会听到 JavaScript 中的真实性。`
In JavaScript, we can use any expression in conditionals, &&s, ||s, if statements, Boolean negations (!), and more. As an example, if statements don’t expect their condition to always have the type boolean.
`这是因为 JavaScript 会做隐式类型转换，像 0 、NaN、""、0n、null undefined 这些值都会被转为 false，其他的值则会被转为 true。当然你也可以使用 Boolean 函数强制转为 boolean 值，或者使用更加简短的!!：`

```ts
function getUsersOnlineMessage(numUsersOnline: number) {
  if (numUsersOnline) {
    return `There are ${numUsersOnline} online now!`;
  }
  return "Nobody's here. :(";
}
```

In JavaScript, constructs like if first “coerce” their conditions to booleans to make sense of them, and then choose their branches depending on whether the result is true or false. Values like
`0、NaN、""、0n、null undefined 这些值都会被转为 false，其他的值则会被转为 true。当然你也可以使用 Boolean 函数强制转为 boolean 值，或者使用更加简短的!!：`

- 0
- NaN
- "" (the empty string)
- 0n (the bigint version of zero)
- null
- undefined

all coerce to false, and other values get coerced true. You can always coerce values to booleans by running them through the Boolean function, or by using the shorter double-Boolean negation. (The latter has the advantage that TypeScript infers a narrow literal boolean type true, while inferring the first as type boolean.)
所有 这些值都会被转为 false，其他的值则会被转为 true。你可以通过调用 Boolean 函数强制转为 boolean 值，或者使用更加简短的!!。(这种情况下，TypeScript 会推断一个简单的布尔值类型 true，而不是类型 boolean。)

```ts
// both of these result in 'true'
Boolean("hello"); // type: boolean, value: true
!!"world"; // type: true,    value: true
```

It’s fairly popular to leverage this behavior, especially for guarding against values like null or undefined. As an example, let’s ```using it for our printAll function.`这种使用方式非常流行，尤其适用于防范 null 和 undefiend 这种值的时候。举个例子，我们可以在 printAll 函数中这样使用：`

```ts
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === "object") {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  }
}
```

You’ll notice that we’ve gotten rid of the error above by checking if strs is truthy. This at least prevents us from dreaded errors when we run our code like:
`这里我们获得了一个错误，因为我们检查了 strs 是否为真。这至少防止了我们在运行代码时出现的错误。`

```ts
// TypeError: null is not iterable
```

Keep in mind though that truthiness checking on primitives can often be error prone. As an example, consider a different attempt at writing printAll
`但还是要注意，在基本类型上的真值检查很容易导致错误，比如，如果我们这样写 printAll 函数：`

```ts
function printAll(strs: string | string[] | null) {
  // !!!!!!!!!!!!!!!!
  // DON'T DO THIS!
  // KEEP READING
  // !!!!!!!!!!!!!!!!
  if (strs) {
    if (typeof strs === "object") {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
    }
  }
}
```

We wrapped the entire body of the function in a truthy check, but this has a subtle downside: we may no longer be handling the empty string case correctly.
`我们将整个函数包裹在真值检查中，但这有一个潜在的问题：我们可能不再正确处理空字符串的情况。`
TypeScript doesn’t hurt us here at all, but this is behavior worth noting if you’re less familiar with JavaScript. TypeScript can often help you catch bugs early on, but if you choose to do nothing with a value, there’s only so much that it can do without being overly prescriptive. If you want, you can make sure you handle situations like these with a linter.
`TypeScript 不会给我们任何麻烦，但如果你不了解 JavaScript，这可能是一个很有用的技巧。TypeScript 可以帮助你提前发现错误，但如果你选择不做任何事情，那么只能是有限的。如果你想，你可以使用一个 linter 来确保你在这种情况下正确处理。`
One last word on narrowing by truthiness is that Boolean negations with ! filter out from negated branches.
`另外一个通过真值检查收窄类型的方式是通过!操作符。`

```ts
function multiplyAll(values: number[] | undefined, factor: number): number[] | undefined {
  if (!values) {
    return values;
  } else {
    return values.map((x) => x \* factor);
  }
}
```

## Equality narrowing

`等值缩减`

TypeScript also uses switch statements and equality checks like ===, !==, ==, and != to narrow types. For example:
`TypeScript 也使用了 switch 语句和等值检查，比如 ===、!==、==、!=。`

```ts
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // We can now call any 'string' method on 'x' or 'y'.
    x.toUpperCase();

    // (method) String.toUpperCase(): string
    y.toLowerCase();

    // (method) String.toLowerCase(): string
  } else {
    console.log(x);

    // (parameter) x: string | number
    console.log(y);

    // (parameter) y: string | boolean
  }
}
```

When we checked that x and y are both equal in the above example, TypeScript knew their types also had to be equal. Since string is the only common type that both x and y could take on, TypeScript knows that x and y must be a string in the first branch.
`在上面的例子中，我们检查了 x 和 y 是否相等。TypeScript 知道 x 和 y 的类型也必须相等。因为 string 是所有 x 和 y 可能取得的类型的共同类型，所以 TypeScript 知道 x 和 y 必须是 string 的第一个分支。`
Checking against specific literal values (as opposed to variables) works also. In our section about truthiness narrowing, we wrote a printAll function which was error-prone because it accidentally didn’t handle empty strings properly. Instead we could have done a specific check to block out nulls, and TypeScript still correctly removes null from the type of strs.
`检查特定的字面值（而不是变量）也可以工作。在我们提到的真值收窄中，我们写了一个 printAll 函数，它错误地处理了空字符串，而不是通过检查 null 来做。可以通过检查 null 来阻止 null，TypeScript 仍然能正确地从 strs 的类型中去除 null。`

```ts
function printAll(strs: string | string[] | null) {
  if (strs !== null) {
    if (typeof strs === "object") {
      for (const s of strs) {
        // (parameter) strs: string[]
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);

      // (parameter) strs: string
    }
  }
}
```

JavaScript’s looser equality checks with == and != also get narrowed correctly. If you’re unfamiliar, checking whether something == null actually not only checks whether it is specifically the value null - it also checks whether it’s potentially undefined. The same applies to == undefined: it checks whether a value is either null or undefined.
`JavaScript 的更粗糙的等值检查，比如 == 和 !=，也能正确收窄类型。如果你不了解，检查 something == null 是否不仅检查了 something 是否是特定的值 null，还检查了它是否可能是未定义的。同样的道理，检查 something == undefined 是否不仅检查了 something 是否是特定的值 undefined，还检查了它是否可能是未定义的。`

```ts
interface Container {
  value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
  // Remove both 'null' and 'undefined' from the type.
  if (container.value != null) {
    console.log(container.value);

    // (property) Container.value: number

    // Now we can safely multiply 'container.value'.
    container.value *= factor;
  }
}
```

## The in operator narrowing

`in操作符缩减`

JavaScript has an operator for determining if an object has a property with a name: the in operator. TypeScript takes this into account as a way to narrow down potential types.
`JavaScript 有一个操作符用来确定对象是否有一个属性名：in 操作符。TypeScript 使用这种方式来收窄可能的类型。`
For example, with the code: "value" in x. where "value" is a string literal and x is a union type. The “true” branch narrows x’s types which have either an optional or required property value, and the “false” branch narrows to types which have an optional or missing property value.
`例如，在 x 中，“value” 是一个字面量字符串，x 是一个联合类型。“true” 分支收窄 x 的类型，其中有一个可选或必须的属性值，而“false” 分支收窄到有一个可选或缺少的属性值。`

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim();
  }

  return animal.fly();
}
```

To reiterate optional properties will exist in both sides for narrowing, for example a human could both swim and fly (with the right equipment) and thus should show up in both sides of the in check:
`为了收窄可选属性，人类可以同时飞行和游泳（有正确的装备），因此应该在 in 检查的两侧显示。`

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void; fly?: () => void };

function move(animal: Fish | Bird | Human) {
  if ("swim" in animal) {
    animal;

    // (parameter) animal: Fish | Human
  } else {
    animal;

    // (parameter) animal: Bird | Human
  }
}
```

## instanceof narrowing

`instanceof缩减`

JavaScript has an operator for checking whether or not a value is an “instance” of another value. More specifically, in JavaScript x instanceof Foo checks whether the prototype chain of x contains Foo.prototype. While we won’t dive deep here, and you’ll see more of this when we get into classes, they can still be useful for most values that can be constructed with new. As you might have guessed, instanceof is also a type guard, and TypeScript narrows in branches guarded by instanceofs.
`JavaScript 有一个操作符用来检查一个值是否是另一个值的实例：in 操作符。更详细的说，在 JavaScript x instanceof Foo 检查 x 的原型链是否包含 Foo.prototype。但我们这里不会深入，当我们接触到类时，它们仍然可以用于构造函数。你可能会猜到，instanceof 是一个类型检查，而 TypeScript 收窄在 instanceof 检查的分支。`

```ts
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString());

    // (parameter) x: Date
  } else {
    console.log(x.toUpperCase());

    // (parameter) x: string
  }
}
```

## Assignments

`赋值`

As we mentioned earlier, when we assign to any variable, TypeScript looks at the right side of the assignment and narrows the left side appropriately.
`我们前面提到过，当我们给任何变量赋值时，TypeScript 会检查赋值右侧并收窄左侧适当的类型。`

```ts
let x = Math.random() < 0.5 ? 10 : "hello world!";

let x: string | number;
x = 1;

console.log(x);

let x: number;
x = "goodbye!";

console.log(x);

let x: string;
```

Notice that each of these assignments is valid. Even though the observed type of x changed to number after our first assignment, we were still able to assign a string to x. This is because the declared type of x - the type that x started with - is string | number, and assignability is always checked against the declared type.
`注意，每一个赋值都是有效的。即使 x 的发现类型改变为 number 之后，我们仍然能够给 x 赋值一个字符串。这是因为 x 的声明类型是 string | number，而赋值时是检查赋值类型是否可以赋值给它。`
If we’d assigned a boolean to x, we’d have seen an error since that wasn’t part of the declared type.

```ts
let x = Math.random() < 0.5 ? 10 : "hello world!";

let x: string | number;
x = 1;

console.log(x);

let x: number;
x = true;
// Type 'boolean' is not assignable to type 'string | number'.

console.log(x);

let x: string | number;
```

## Control flow analysis

`控制流分析`

Up until this point, we’ve gone through some basic examples of how TypeScript narrows within specific branches. But there’s a bit more going on than just walking up from every variable and looking for type guards in ifs, whiles, conditionals, etc. For example
`在这个点之前，我们已经探索了一些基本的例子，如何收窄在特定分支中。但这里有一些比较复杂的事情，比如从每个变量上来看，如果有一个 if 语句，while 语句，条件表达式等，都可以看到收窄。例如`

```ts
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

padLeft returns from within its first if block. TypeScript was able to analyze this code and see that the rest of the body (return padding + input;) is unreachable in the case where padding is a number. As a result, it was able to remove number from the type of padding (narrowing from string | number to string) for the rest of the function.
`padLeft 返回在它的第一个 if 块中。TypeScript 可以分析这段代码，并且发现 rest of the body (return padding + input;) 是不可达的，在 padding 是一个 number 的情况下。因此，它可以移除 padding 的声明类型（收窄从 string | number 到 string），从而移除了 padding 的类型。`
This analysis of code based on reachability is called control flow analysis, and TypeScript uses this flow analysis to narrow types as it encounters type guards and assignments. When a variable is analyzed, control flow can split off and re-merge over and over again, and that variable can be observed to have a different type at each point.
`这段代码基于可达性的分析是控制流分析，TypeScript 使用这个分析来收窄类型，当遇到类型检查和赋值时。当一个变量被分析时，控制流可以分裂和重新合并，并且这个变量在每个点都会有不同的类型。`

```ts
function example() {
  let x: string | number | boolean;

  x = Math.random() < 0.5;

  console.log(x);

  let x: boolean;

  if (Math.random() < 0.5) {
    x = "hello";
    console.log(x);

    let x: string;
  } else {
    x = 100;
    console.log(x);

    let x: number;
  }

  return x;

  let x: string | number;
}
```

## Using type predicates

`使用类型断言`

We’ve worked with existing JavaScript constructs to handle narrowing so far, however sometimes you want more direct control over how types change throughout your code.
`我们已经使用了现有的 JavaScript 工具来处理收窄，但有时候你想更加直接控制类型在你的代码中的变化。`
To define a user-defined type guard, we simply need to define a function whose return type is a type predicate:
`定义一个用户定义的类型断言，我们只需要定义一个返回类型为类型断言的函数：`

```ts
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

pet is Fish is our type predicate in this example. A predicate takes the form parameterName is Type, where parameterName must be the name of a parameter from the current function signature.
`pet is Fish 是我们的类型断言。一个断言的格式是 parameterName is Type，其中 parameterName 必须是当前函数签名中的一个参数名。`
Any time isFish is called with some variable, TypeScript will narrow that variable to that specific type if the original type is compatible.
`任何时候，isFish 被调用，TypeScript 将会收窄这个变量的类型，如果原始类型是兼容的。`

```ts
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

Notice that TypeScript not only knows that pet is a Fish in the if branch; it also knows that in the else branch, you don’t have a Fish, so you must have a Bird.
`TypeScript 知道 pet 是一个 Fish 在 if 分支；它也知道在 else 分支，你没有一个 Fish，所以你必须有一个 Bird。`
You may use the type guard isFish to filter an array of Fish | Bird and obtain an array of Fish:
`你可以使用 isFish 来过滤 Fish | Bird 数组，并获得一个 Fish 数组。`

```ts
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// or, equivalently
const underWater2: Fish[] = zoo.filter(isFish) as Fish[];

// The predicate may need repeating for more complex examples
const underWater3: Fish[] = zoo.filter((pet): pet is Fish => {
  if (pet.name === "sharkey") return false;
  return isFish(pet);
});
```

In addition, classes can use this is Type to narrow their type.We’ve worked with existing JavaScript constructs to handle narrowing so far, however sometimes you want more direct control over how types change throughout your code.
`类可以使用 is Type 来收窄类型。我们已经使用了现有的 JavaScript 工具来处理收窄，但有时候你想更加直接控制类型在你的代码中的变化。`
To define a user-defined type guard, we simply need to define a function whose return type is a type predicate:
`定义一个用户定义的类型断言，我们只需要定义一个返回类型为类型断言的函数：`

```ts
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

pet is Fish is our type predicate in this example. A predicate takes the form parameterName is Type, where parameterName must be the name of a parameter from the current function signature.
`pet is Fish 是我们的类型断言。一个断言的格式是 parameterName is Type，其中 parameterName 必须是当前函数签名中的一个参数名。`
Any time isFish is called with some variable, TypeScript will narrow that variable to that specific type if the original type is compatible.
`任何时候，isFish 被调用，TypeScript 将会收窄这个变量的类型，如果原始类型是兼容的。`

```ts
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

Notice that TypeScript not only knows that pet is a Fish in the if branch; it also knows that in the else branch, you don’t have a Fish, so you must have a Bird.
`TypeScript 知道 pet 是一个 Fish 在 if 分支；它也知道在 else 分支，你没有一个 Fish，所以你必须有一个 Bird。`
You may use the type guard isFish to filter an array of Fish | Bird and obtain an array of Fish:
`你可以使用 isFish 来过滤 Fish | Bird 数组，并获得一个 Fish 数组。`

```ts
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// or, equivalently
const underWater2: Fish[] = zoo.filter(isFish) as Fish[];

// The predicate may need repeating for more complex examples
const underWater3: Fish[] = zoo.filter((pet): pet is Fish => {
  if (pet.name === "sharkey") return false;
  return isFish(pet);
});
```

In addition, classes can use this is Type to narrow their type.
`除此之外，类中可以使用this is Type来缩减类型。`

## Discriminated unions

`分区联合`

Most of the examples we’ve looked at so far have focused around narrowing single variables with simple types like string, boolean, and number. While this is common, most of the time in JavaScript we’ll be dealing with slightly more complex structures.
For some motivation, let’s imagine we’re trying to encode shapes like circles and squares.
Circles keep track of their radiuses and squares keep track of their side lengths. We’ll use a field called kind to tell which shape we’re dealing with. Here’s a first attempt at defining Shape.
`让我们试想有这样一个处理 Shape （比如 Circles、Squares ）的函数，Circles 会记录它的半径属性，Squares 会记录它的边长属性，我们使用一个 kind 字段来区分判断处理的是 Circles 还是 Squares，这是初始的 Shape 定义：`

```ts
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}
```

Notice we’re using a union of string literal types: "circle" and "square" to tell us whether we should treat the shape as a circle or square respectively. By using "circle" | "square" instead of string, we can avoid misspelling issues.
`我们使用一个字符串字面量类型的联合："circle" 和 "square"，来告诉我们是处理一个圆形还是一个正方形。`

```ts
function handleShape(shape: Shape) {
  // oops!
  if (shape.kind === "rect") {
    // This condition will always return 'false' since the types '"circle" | "square"' and '"rect"' have no overlap.
    // 此条件将总是返回 'false'，因为类型 '"circle" | "square"' 和 '"rect"' 没有重叠。
    // ...
  }
}
```

We can write a getArea function that applies the right logic based on if it’s dealing with a circle or square. We’ll first try dealing with circles.
`我们可以写一个 getArea 函数，用来处理圆形。`

```ts
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
  // Object is possibly 'undefined'.
}
```

Under strictNullChecks that gives us an error - which is appropriate since radius might not be defined. But what if we perform the appropriate checks on the kind property?
`在严格的 null 检查下，我们会得到一个错误 - 因为 radius 可能不存在。但是如果我们对 kind 属性进行正确的检查，就不会出现错误。`

```ts
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
    // Object is possibly 'undefined'.
  }
}
```

Hmm, TypeScript still doesn’t know what to do here. We’ve hit a point where we know more about our values than the type checker does. We could try to use a non-null assertion (a ! after shape.radius) to say that radius is definitely present.
`哇，TypeScript 还不知道怎么办。我们已经碰到了一个点，我们知道更多的信息了，比类型检查器更多。我们可以尝试使用一个非空断言（shape.radius 后面加一个 !）来告诉 TypeScript radius 是一定存在的。`

```ts
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius! ** 2;
  }
}
```

But this doesn’t feel ideal. We had to shout a bit at the type-checker with those non-null assertions (!) to convince it that shape.radius was defined, but those assertions are error-prone if we start to move code around. Additionally, outside of strictNullChecks we’re able to accidentally access any of those fields anyway (since optional properties are just assumed to always be present when reading them). We can definitely do better.
`但这不太好。我们必须向类型检查器发出一些非空断言（!）来告诉它 shape.radius 存在，但这些断言是错误的，如果我们开始移动代码。同时，在非严格的 null 检查下，我们还是可以随意访问这些字段（因为可选属性是被假定为总是存在的，当读取它们时）。我们可以很好地做。`
The problem with this encoding of Shape is that the type-checker doesn’t have any way to know whether or not radius or sideLength are present based on the kind property. We need to communicate what we know to the type checker. With that in mind, let’s take another swing at defining Shape.
`这个 Shape 的编码有点问题，因为类型检查器没有任何方式可以告诉我们 radius 或 sideLength 存在。我们需要向类型检查器通报我们知道的信息。`

```ts
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;
```

Here, we’ve properly separated Shape out into two types with different values for the kind property, but radius and sideLength are declared as required properties in their respective types.
`这里，我们已经将 Shape 分成了两种类型，其中 kind 属性的值不同，radius 和 sideLength 在它们的类型中声明为必须的属性。`
Let’s see what happens here when we try to access the radius of a Shape.
`我们看看这里如何访问 Shape 的 radius。`

```ts
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
  // Property 'radius' does not exist on type 'Shape'.
  // Property 'radius' does not exist on type 'Square'.
}
```

Like with our first definition of Shape, this is still an error. When radius was optional, we got an error (with strictNullChecks enabled) because TypeScript couldn’t tell whether the property was present. Now that Shape is a union, TypeScript is telling us that shape might be a Square, and Squares don’t have radius defined on them! Both interpretations are correct, but only the union encoding of Shape will cause an error regardless of how strictNullChecks is configured.
`与我们第一次定义 Shape 的例子相同，这还是一个错误。当 radius 是可选的时，我们得到一个错误（与 strictNullChecks 启用时），因为 TypeScript 不能告诉我们这个属性是否存在。`
But what if we tried checking the kind property again?
`如果我们再次检查 kind 属性？`

```ts
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
    // (parameter) shape: Circle
  }
}
```

That got rid of the error! When every type in a union contains a common property with literal types, TypeScript considers that to be a discriminated union, and can narrow out the members of the union.
`这消除了错误！当一个联合里的每个类型都包含常量类型的共同属性，TypeScript 认为这是一个分区联合，可以缩小联合的成员。`
In this case, kind was that common property (which is what’s considered a discriminant property of Shape). Checking whether the kind property was "circle" got rid of every type in Shape that didn’t have a kind property with the type "circle". That narrowed shape down to the type Circle.
`在这种情况下，kind 属性是那个被认为是 Shape 的分区属性（这是被认为是 Shape 的分区属性）。检查 kind 属性是否是 "circle" 可以消除掉没有 kind 属性的类型。这缩小了 shape 到 Circle 类型。`
The same checking works with switch statements as well. Now we can try to write our complete getArea without any pesky ! non-null assertions.
`在这里，我们可以尝试写我们的完整 getArea 没有任何非空断言！`

```ts
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;

    // (parameter) shape: Circle
    case "square":
      return shape.sideLength ** 2;

    // (parameter) shape: Square
  }
}
```

The important thing here was the encoding of Shape. Communicating the right information to TypeScript - that Circle and Square were really two separate types with specific kind fields - was crucial. Doing that let us write type-safe TypeScript code that looks no different than the JavaScript we would’ve written otherwise. From there, the type system was able to do the “right” thing and figure out the types in each branch of our switch statement.
`这里有重要的事情，需要通过编码 Shape 来告诉 TypeScript，Circle 和 Square 是真正的两个类型，具有特定的 kind 属性。这样就可以写出类型安全的 TypeScript 代码，看起来和 JavaScript 一样。`
As an aside, try playing around with the above example and remove some of the return keywords. You’ll see that type-checking can help avoid bugs when accidentally falling through different clauses in a switch statement.
`作为一个例子，试着玩一下上面的例子，并删除一些 return 关键字。你会发现，类型检查可以帮助避免在意外的情况下跳过不同的分支。`
Discriminated unions are useful for more than just talking about circles and squares. They’re good for representing any sort of messaging scheme in JavaScript, like when sending messages over the network (client/server communication), or encoding mutations in a state management framework.
`分区联合是用来表示任何类型的消息协议，比如在网络上发送消息（客户端/服务器通信），或者编码状态管理框架的变化。`

## The never type

`never类型`

When narrowing, you can reduce the options of a union to a point where you have removed all possibilities and have nothing left. In those cases, TypeScript will use a never type to represent a state which shouldn’t exist.
`在缩小联合的时候，你可以将联合的可能性降低到没有任何可能性的状态。在这种情况下，TypeScript 会使用 never 类型来表示不应该存在的状态。`

## Exhaustiveness checking

`推断性检查`

The never type is assignable to every type; however, no type is assignable to never (except never itself). This means you can use narrowing and rely on never turning up to do exhaustive checking in a switch statement.
`never类型可以赋值给所有类型，但是不可以赋值给 never（除了 never 本身）。这意味着你可以使用缩小，并且可以在 switch 语句中使用推断性检查。`
For example, adding a default to our getArea function which tries to assign the shape to never will raise when every possible case has not been handled.
`添加一个默认到 getArea 函数中，这样就会抛出异常，因为没有处理所有可能性。`

```ts
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

Adding a new member to the Shape union, will cause a TypeScript error:
`添加一个新的成员到 Shape 联合，会导致一个 TypeScript 错误：`

```ts
interface Triangle {
  kind: "triangle";
  sideLength: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      // Type 'Triangle' is not assignable to type 'never'.
      // 类型 'Triangle' 不能赋值给类型 'never'。
      return _exhaustiveCheck;
  }
}
```

因为 TypeScript 的收窄特性，执行到 default 的时候，类型被收窄为 Triangle，但因为任何类型都不能赋值给 never 类型，这就会产生一个编译错误。通过这种方式，你就可以确保 getArea 函数总是穷尽了所有 shape 的可能性。
