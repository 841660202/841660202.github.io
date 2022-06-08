---
title: 10.Typescript Utility Type
date: 2022-06-08 22:49:28
categories: typescript
tags: [typescript]
cover:
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

## Required<Type>

Released:2.8

Constructs a type consisting of all properties of Type set to required. The opposite of Partial.
`构造一个具有所有属性类型的必需属性的类型。反对Partial。`

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
Cannot assign to 'title' because it is a read-only property.
```

This utility is useful for representing assignment expressions that will fail at runtime (i.e. when attempting to reassign properties of a frozen object).
`这个工具是用来表示在运行时将失败的赋值表达式的用途（即尝试重新分配一个冻结对象的属性）。`
**Object.freeze**

```ts
function freeze<Type>(obj: Type): Readonly<Type>;
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

## Exclude<UnionType, ExcludedMembers>

Released:2.8

Constructs a type by excluding from UnionType all union members that are assignable to ExcludedMembers.
`用于构造一个类型，它是从UnionType联合类型里面排除了所有可以赋给ExcludedMembers的类型。`

```ts
// Example;
type T0 = Exclude<"a" | "b" | "c", "a">;

type T0 = "b" | "c";

type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
type T1 = "c";

type T2 = Exclude<string | number | (() => void), Function>;
type T2 = string | number;
```

## Extract<Type, Union>

Released:2.8

Constructs a type by extracting from Type all union members that are assignable to Union.
`用于构造一个类型，它是从Type类型里面提取了所有可以赋给Union的类型。`

```ts
// Example
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
type T0 = "a";

type T1 = Extract<string | number | (() => void), Function>;
type T1 = () => void;
```

## NonNullable<Type>

Released:2.8

Constructs a type by excluding null and undefined from Type.
`用于构造一个类型，这个类型从Type中排除了所有的null、undefined的类型。`

```ts
// Example
type T0 = NonNullable<string | number | undefined>;

type T0 = string | number;
type T1 = NonNullable<string[] | null | undefined>;

type T1 = string[];
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

## InstanceType<Type>

Released:2.8

Constructs a type consisting of the instance type of a constructor function in Type.
`用于构造一个由所有Type的构造函数的实例类型组成的类型。`

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
