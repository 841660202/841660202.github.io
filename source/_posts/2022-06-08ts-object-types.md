---
title: 6.Typescript手册 对象类型
date: 2022-06-08 09:21:19
categories: typescript
tags: [typescript]
cover: https://img0.baidu.com/it/u=86492913,3057347241&fm=253&fmt=auto&app=138&f=JPEG?w=499&h=208
---

In JavaScript, the fundamental way that we group and pass around data is through objects. In TypeScript, we represent those through object types.
`在 JavaScript 中，我们通过对象来组织和传递数据。在 TypeScript 中，我们通过对象类型来表示这些对象。`
As we’ve seen, they can be anonymous:
`我们可以看到，它们可以是匿名的：`

```typescript
function greet(person: { name: string; age: number }) {
  return "Hello " + person.name;
}
```

or they can be named by using either an interface
`或者，它们可以使用接口来命名`

```typescript
interface Person {
  name: string;
  age: number;
}

function greet(person: Person) {
  return "Hello " + person.name;
}
```

or a type alias.
`或者，它们可以使用类型别名`

```typescript
type Person = {
  name: string;
  age: number;
};

function greet(person: Person) {
  return "Hello " + person.name;
}
```

In all three examples above, we’ve written functions that take objects that contain the property name (which must be a string) and age (which must be a number).
`在上面三个例子中，我们已经写了一个函数，它接受包含属性 name（必须是字符串）和 age（必须是数字）的对象。`

## Property Modifiers

`属性修饰符`
Each property in an object type can specify a couple of things: the type, whether the property is optional, and whether the property can be written to.
`对象类型中的每个属性都可以指定一些东西：类型、是否是可选的，以及是否可以写入。`

## Optional Properties

`可选属性`
Much of the time, we’ll find ourselves dealing with objects that might have a property set. In those cases, we can mark those properties as optional by adding a question mark (?) to the end of their names.
`大多数时候，我们会发现我们在对对象进行操作的时候，可能会有属性被设置。在这些情况下，我们可以通过在属性名的末尾添加问号来标记这些属性为可选的。`

```typescript
interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}

function paintShape(opts: PaintOptions) {
  // ...
}

const shape = getShape();
paintShape({ shape });
paintShape({ shape, xPos: 100 });
paintShape({ shape, yPos: 100 });
paintShape({ shape, xPos: 100, yPos: 100 });
```

In this example, both xPos and yPos are considered optional. We can choose to provide either of them, so every call above to paintShape is valid. All optionality really says is that if the property is set, it better have a specific type.
`在这个例子中，xPos和yPos都被认为是可选的。我们可以选择提供其中一个，因此每次调用paintShape都是有效的。所有的可选性都说是，如果属性被设置，它应该有一个特定的类型。`
We can also read from those properties - but when we do under strictNullChecks, TypeScript will tell us they’re potentially undefined.
`我们也可以读取这些属性，但是在严格的 null 检查下，TypeScript 将会告诉我们这些属性可能是 undefined。`

```typescript
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos;
  // (property) PaintOptions.xPos?: number | undefined

  let yPos = opts.yPos;
  // (property) PaintOptions.yPos?: number | undefined
  // ...
}
```

In JavaScript, even if the property has never been set, we can still access it - it’s just going to give us the value undefined. We can just handle undefined specially.
`在 JavaScript 中，即使属性没有被设置，我们仍然可以访问它，它只是给我们一个值 undefined。我们可以特别处理 undefined。`

```typescript
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos === undefined ? 0 : opts.xPos;
  // let xPos: number;

  let yPos = opts.yPos === undefined ? 0 : opts.yPos;
  // let yPos: number;
  // ...
}
```

Note that this pattern of setting defaults for unspecified values is so common that JavaScript has syntax to support it.
`注意，这种设置默认值的方式很常见，因此 JavaScript 有一种语法来支持它。`

```typescript
function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
  console.log("x coordinate at", xPos);
  // (parameter) xPos: number

  console.log("y coordinate at", yPos);
  // (parameter) yPos: number
  // ...
}
```

Here we used a destructuring pattern for paintShape’s parameter, and provided default values for xPos and yPos. Now xPos and yPos are both definitely present within the body of paintShape, but optional for any callers to paintShape.
`在这里，我们使用了 paintShape 的参数的析构模式，并为 xPos 和 yPos 提供了默认值。现在 xPos 和 yPos 在 paintShape 的主体中都是必须的，但是任何调用者调用 paintShape 的值都是可选的。`
Note that there is currently no way to place type annotations within destructuring patterns. This is because the following syntax already means something different in JavaScript.
`注意，目前没有办法在析构模式中放置类型标注。因为这个语法已经在 JavaScript 中表示了不同的意思。`

```typescript
function draw({ shape: Shape, xPos: number = 100 /_..._/ }) {
render(shape);
// Cannot find name 'shape'. Did you mean 'Shape'?
render(xPos);
// Cannot find name 'xPos'.
}
```

In an object destructuring pattern, shape: Shape means “grab the property shape and redefine it locally as a variable named Shape. Likewise xPos: number creates a variable named number whose value is based on the parameter’s xPos.
`在一个对象析构模式中，shape: Shape 表示“抓取属性 shape 并重新定义它作为名为 Shape 的变量。同样的，xPos: number 创建了一个名为 number 的变量，其值是基于参数的 xPos。`
Using mapping modifiers, you can remove optional attributes.
`使用映射修饰符，你可以移除可选属性。`

## Readonly Properties

`只读属性`
Properties can also be marked as readonly for TypeScript. While it won’t change any behavior at runtime, a property marked as readonly can’t be written to during type-checking.
`只读属性`

```typescript
interface SomeType {
  readonly prop: string;
}

function doSomething(obj: SomeType) {
  // We can read from 'obj.prop'.
  console.log(`prop has the value '${obj.prop}'.`);

  // But we can't re-assign it.
  obj.prop = "hello";
  // Cannot assign to 'prop' because it is a read-only property.
}
```

Using the readonly modifier doesn’t necessarily imply that a value is totally immutable - or in other words, that its internal contents can’t be changed. It just means the property itself can’t be re-written to.
`使用 readonly 修饰符并不意味着一个值是完全不可变的，也就是说，它的内部内容不能被改变。它只是说，属性本身不能被重写。`

```typescript
interface Home {
  readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
  // We can read and update properties from 'home.resident'.
  // 我们可以从 'home.resident' 中读取和更新属性。
  console.log(`Happy birthday ${home.resident.name}!`);
  home.resident.age++;
}

function evict(home: Home) {
  // But we can't write to the 'resident' property itself on a 'Home'.
  // 但是，我们不能在 'Home' 上写入 'resident' 属性。
  home.resident = {
    // Cannot assign to 'resident' because it is a read-only property.
    name: "Victor the Evictor",
    age: 42,
  };
}
```

It’s important to manage expectations of what readonly implies. It’s useful to signal intent during development time for TypeScript on how an object should be used. TypeScript doesn’t factor in whether properties on two types are readonly when checking whether those types are compatible, so readonly properties can also change via aliasing.

**注意**

`TypeScript 在检查两个类型是否兼容的时候，并不会考虑两个类型里的属性是否是 readonly，这就意味着，readonly 的值是可以通过别名修改的。`

```typescript
interface Person {
  name: string;
  age: number;
}

interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}

let writablePerson: Person = {
  name: "Person McPersonface",
  age: 42,
};

// works
let readonlyPerson: ReadonlyPerson = writablePerson;

console.log(readonlyPerson.age); // prints '42'
writablePerson.age++;
console.log(readonlyPerson.age); // prints '43'
```

Using mapping modifiers, you can remove readonly attributes.

## Index Signatures

`索引签名`
Sometimes you don’t know all the names of a type’s properties ahead of time, but you do know the shape of the values.
`有时候，你不知道一个类型的所有属性的名字，但是你知道值的形状。`

In those cases you can use an index signature to describe the types of possible values, for example:
`在这些情况下，你可以使用索引签名来描述可能的值的类型，例如：`

```typescript
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = getStringArray();
const secondItem = myArray[1];

const secondItem: string;
```

Above, we have a StringArray interface which has an index signature. This index signature states that when a StringArray is indexed with a number, it will return a string.
`上面，我们有一个 StringArray 接口，它有一个索引签名。这个索引签名说明，当一个 StringArray 被索引为一个数字时，它会返回一个字符串。`
An index signature property type must be either ‘string’ or ‘number’.
`索引签名属性类型必须是‘string’或‘number’。`
It is possible to support both types of indexers...
`可以支持两种类型的索引器...`

While string index signatures are a powerful way to describe the “dictionary” pattern, they also enforce that all properties match their return type. This is because a string index declares that obj.property is also available as obj["property"]. In the following example, name’s type does not match the string index’s type, and the type checker gives an error:
`尽管字符串索引用来描述字典模式（dictionary pattern）非常的有效，但也会强制要求所有的属性要匹配索引签名的返回类型。这是因为一个声明类似于 obj.property 的字符串索引，跟 obj["property"]是一样的。在下面的例子中，name 的类型并不匹配字符串索引的类型，所以类型检查器会给出报错：`

```typescript
interface NumberDictionary {
  [index: string]: number;

  length: number; // ok
  name: string;
  // Property 'name' of type 'string' is not assignable to 'string' index type 'number'.
}
```

However, properties of different types are acceptable if the index signature is a union of the property types:
`但是，不同类型的属性是可以接受的，如果索引签名是属性类型的联合：`

```typescript
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length is a number
  name: string; // ok, name is a string
}
```

Finally, you can make index signatures readonly in order to prevent assignment to their indices:
`最后，你可以使索引签名变成只读，以防止索引赋值：`

```typescript
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

let myArray: ReadonlyStringArray = getReadOnlyStringArray();
myArray[2] = "Mallory";
// Index signature in type 'ReadonlyStringArray' only permits reading.
```

You can’t set myArray[2] because the index signature is readonly.
`你不能设置 myArray[2]，因为索引签名是只读的。`

## Extending Types

`扩展类型`
It’s pretty common to have types that might be more specific versions of other types. For example, we might have a BasicAddress type that describes the fields necessary for sending letters and packages in the U.S.
`我们可能有一个基本的地址类型，它描述了在美国发送信件和包裹的必要字段。`

```typescript
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
```

In some situations that’s enough, but addresses often have a unit number associated with them if the building at an address has multiple units. We can then describe an AddressWithUnit.
`在某些情况下，这样就足够了，但是地址有时候会有单元号码，如果地址的建筑有多个单元。我们可以描述一个 AddressWithUnit。`

```typescript
interface AddressWithUnit {
  name?: string;
  unit: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
```

This does the job, but the downside here is that we had to repeat all the other fields from BasicAddress when our changes were purely additive. Instead, we can extend the original BasicAddress type and just add the new fields that are unique to AddressWithUnit.
`这样做就可以了，但是有一个缺点，就是我们必须重复所有的字段来自 BasicAddress，当我们的改动只是增加性的时候。我们可以扩展原来的 BasicAddress 类型，并且只需要增加 AddressWithUnit 的唯一字段。`

```typescript
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
  unit: string;
}
```

The extends keyword on an interface allows us to effectively copy members from other named types, and add whatever new members we want. This can be useful for cutting down the amount of type declaration boilerplate we have to write, and for signaling intent that several different declarations of the same property might be related. For example, AddressWithUnit didn’t need to repeat the street property, and because street originates from BasicAddress, a reader will know that those two types are related in some way.
`在一个接口上使用 extends 关键字，我们可以从其他命名类型复制成员，并且添加我们想要的新成员。这可以用来缩短我们写的类型声明的热身，以及为同一属性的多个声明提供相关性的信号。例如，AddressWithUnit 不需要重复 street 属性，因为 street 来自 BasicAddress，读者知道这两个类型是相关的。`
interfaces can also extend from multiple types.
`接口也可以扩展多个类型。`

```typescript
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = {
  color: "red",
  radius: 42,
};
```

## Intersection Types

`交叉类型`
interfaces allowed us to build up new types from other types by extending them. TypeScript provides another construct called intersection types that is mainly used to combine existing object types.
`接口允许我们从其他类型扩展新类型。TypeScript 提供了一种合并现有对象类型的交叉类型。`
An intersection type is defined using the & operator.
`交叉类型用 & 运算符定义。`

```typescript
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;
```

Here, we’ve intersected Colorful and Circle to produce a new type that has all the members of Colorful and Circle.
`这里，我们将 Colorful 和 Circle 进行交叉，以生成一个新类型，它包含了 Colorful 和 Circle 的所有成员。`

```typescript
function draw(circle: Colorful & Circle) {
  console.log(`Color was ${circle.color}`);
  console.log(`Radius was ${circle.radius}`);
}

// okay
draw({ color: "blue", radius: 42 });

// oops
draw({ color: "red", raidus: 42 });
// Argument of type '{ color: string; raidus: number; }' is not assignable to parameter of type 'Colorful & Circle'.
// Object literal may only specify known properties, but 'raidus' does not exist in type 'Colorful & Circle'. Did you mean to write 'radius'?
```

## Interfaces vs. Intersections

`接口与交叉类型`
We just looked at two ways to combine types which are similar, but are actually subtly different. With interfaces, we could use an extends clause to extend from other types, and we were able to do something similar with intersections and name the result with a type alias. The principle difference between the two is how conflicts are handled, and that difference is typically one of the main reasons why you’d pick one over the other between an interface and a type alias of an intersection type.
`我们只看到了两种方式来合并类型，但是实际上是有着微妙的区别。接口使用 extends 关键字扩展其他类型，而交叉类型使用类型别名定义。接口与交叉类型之间的主要区别是如何处理冲突，这个区别通常是在选择一个接口或者类型别名的时候，接口或者类型别名是否更好。`

这两种方式在合并类型上看起来很相似，但实际上还是有很大的不同。最原则性的不同就是在于冲突怎么处理，这也是你决定选择那种方式的主要原因。

```ts
interface Colorful {
  color: string;
}

interface ColorfulSub extends Colorful {
  color: number;
}
// Interface 'ColorfulSub' incorrectly extends interface 'Colorful'.
// Types of property 'color' are incompatible.
// Type 'number' is not assignable to type 'string'.
```

使用继承的方式，如果重写类型会导致编译错误，但交叉类型不会：

```ts
interface Colorful {
  color: string;
}

type ColorfulSub = Colorful & {
  color: number;
};
```

虽然不会报错，那 color 属性的类型是什么呢，答案是 never，取得是 string 和 number 的交集。

## Generic Object Types

`泛型对象类型`
Let’s imagine a Box type that can contain any value - strings, numbers, Giraffes, whatever.
`想想一个可以包含任何值的盒子类型，例如字符串、数字、狮子等。`

```typescript
interface Box {
  contents: any;
}
```

Right now, the contents property is typed as any, which works, but can lead to accidents down the line.
`现在，contents 属性是任意类型，这就可以工作，但是有可能会在未来出现意外。`
We could instead use unknown, but that would mean that in cases where we already know the type of contents, we’d need to do precautionary checks, or use error-prone type assertions.
`我们可以使用 unknown，但是这会导致在我们已经知道 contents 的类型的情况下，我们需要做一些预防性检查，或者使用错误性的类型断言。`

```typescript
interface Box {
  contents: unknown;
}

let x: Box = {
  contents: "hello world",
};

// we could check 'x.contents'
if (typeof x.contents === "string") {
  console.log(x.contents.toLowerCase());
}

// or we could use a type assertion
console.log((x.contents as string).toLowerCase());
```

One type safe approach would be to instead scaffold out different Box types for every type of contents.
`一种安全的解决方案就是把不同的盒子类型用于不同的类型的内容。`

```typescript
interface NumberBox {
  contents: number;
}

interface StringBox {
  contents: string;
}

interface BooleanBox {
  contents: boolean;
}
```

But that means we’ll have to create different functions, or overloads of functions, to operate on these types.
`但是，这会导致我们需要创建不同的函数，或者重载函数，来操作这些类型。`

```typescript
function setContents(box: StringBox, newContents: string): void;
function setContents(box: NumberBox, newContents: number): void;
function setContents(box: BooleanBox, newContents: boolean): void;
function setContents(box: { contents: any }, newContents: any) {
  box.contents = newContents;
}
```

That’s a lot of boilerplate. Moreover, we might later need to introduce new types and overloads. This is frustrating, since our box types and overloads are all effectively the same.
`这就是一大堆的烧饼，同时，我们可能需要在未来添加新的类型和重载。这是困难的，因为我们的盒子类型和重载都是一样的。`
Instead, we can make a generic Box type which declares a type parameter.
`而不是，我们可以把盒子类型变成泛型类型，它声明了一个类型参数。`

```typescript
interface Box<Type> {
  contents: Type;
}
```

You might read this as “A Box of Type is something whose contents have type Type”. Later on, when we refer to Box, we have to give a type argument in place of Type.
`你可以读这个为“一个类型为 Type 的盒子”。之后，当我们引用 Box 时，我们需要给它一个类型参数。`

```typescript
let box: Box<string>;
```

Think of Box as a template for a real type, where Type is a placeholder that will get replaced with some other type. When TypeScript sees Box<string>, it will replace every instance of Type in Box<Type> with string, and end up working with something like { contents: string }. In other words, Box<string> and our earlier StringBox work identically.
`想想 Box<string> 和 StringBox 类型，它们都是一样的。`

```typescript
interface Box<Type> {
contents: Type;
}
interface StringBox {
contents: string;
}

let boxA: Box<string> = { contents: "hello" };
boxA.contents;

(property) Box<string>.contents: string

let boxB: StringBox = { contents: "world" };
boxB.contents;

(property) StringBox.contents: string
```

Box is reusable in that Type can be substituted with anything. That means that when we need a box for a new type, we don’t need to declare a new Box type at all (though we certainly could if we wanted to).
`Box 可以重用，因为 Type 可以被替换成任何类型。`

```typescript
interface Box<Type> {
  contents: Type;
}

interface Apple {
  // ....
}

// Same as '{ contents: Apple }'.
type AppleBox = Box<Apple>;
```

This also means that we can avoid overloads entirely by instead using generic functions.

```typescript
function setContents<Type>(box: Box<Type>, newContents: Type) {
  box.contents = newContents;
}
```

It is worth noting that type aliases can also be generic. We could have defined our new Box<Type> interface, which was:
`我们可以定义一个新的盒子类型，它是：`

```typescript
interface Box<Type> {
  contents: Type;
}
```

by using a type alias instead:
`使用类型别名来代替：`

```typescript
type Box<Type> = {
  contents: Type;
};
```

Since type aliases, unlike interfaces, can describe more than just object types, we can also use them to write other kinds of generic helper types.
`类型别名，跟接口不同，它可以描述除了对象类型之外的其他类型，我们也可以用它来写其他类型的辅助类型。`

```typescript
type OrNull<Type> = Type | null;

type OneOrMany<Type> = Type | Type[];

// 这组结果一样
type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
type OneOrManyOrNull<Type> = OneOrMany<Type> | null;

// 这组结果一样
type OneOrManyOrNullStrings = OneOrManyOrNull<string>;
type OneOrManyOrNullStrings = OneOrMany<string> | null;
```

We’ll circle back to type aliases in just a little bit.
`我们会在稍后回到类型别名。`

## The Array Type

`数组类型`
Generic object types are often some sort of container type that work independently of the type of elements they contain. It’s ideal for data structures to work this way so that they’re re-usable across different data types.
`泛型对象类型通常是一种可以独立于其包含元素的类型的容器类型。这样，它们可以在不同的数据类型之间重用。`
It turns out we’ve been working with a type just like that throughout this handbook: the Array type. Whenever we write out types like number[] or string[], that’s really just a shorthand for Array<number> and Array<string>.
`我们在这本手册中已经使用过一样的类型：数组类型。`

```typescript
function doSomething(value: Array<string>) {
  // ...
}

let myArray: string[] = ["hello", "world"];

// either of these work!
doSomething(myArray);
doSomething(new Array("hello", "world"));
```

Much like the Box type above, Array itself is a generic type.
`数组本身是一个泛型类型。`

```typescript
interface Array<Type> {
  /**
   * Gets or sets the length of the array.
   */
  length: number;

  /**
   * Removes the last element from an array and returns it.
   */
  pop(): Type | undefined;

  /**
   * Appends new elements to an array, and returns the new length of the array.
   */
  push(...items: Type[]): number;

  // ...
}
```

Modern JavaScript also provides other data structures which are generic, like Map<K, V>, Set<T>, and Promise<T>. All this really means is that because of how Map, Set, and Promise behave, they can work with any sets of types.
`现代 JavaScript 也提供了其他的数据结构，比如 Map<K, V>, Set<T>, Promise<T>。`

## The ReadonlyArray Type

`只读数组类型`

The ReadonlyArray is a special type that describes arrays that shouldn’t be changed.
`只读数组是一个描述不能被修改的数组的特殊类型。`

```typescript
function doStuff(values: ReadonlyArray<string>) {
  // We can read from 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);

  // ...but we can't mutate 'values'.
  values.push("hello!");
  // Property 'push' does not exist on type 'readonly string[]'.
}
```

Much like the readonly modifier for properties, it’s mainly a tool we can use for intent. When we see a function that returns ReadonlyArrays, it tells us we’re not meant to change the contents at all, and when we see a function that consumes ReadonlyArrays, it tells us that we can pass any array into that function without worrying that it will change its contents.
`ReadonlyArray 主要是用来做意图声明。当我们看到一个函数返回 ReadonlyArray，就是在告诉我们不能去更改其中的内容，当我们看到一个函数支持传入 ReadonlyArray ，这是在告诉我们我们可以放心的传入数组到函数中，而不用担心会改变数组的内容。`
Unlike Array, there isn’t a ReadonlyArray constructor that we can use.
`不像 Array，ReadonlyArray 并不是一个我们可以用的构造器函数。`

```ts
new ReadonlyArray("red", "green", "blue");
'ReadonlyArray' only refers to a type, but is being used as a value here.
```

Instead, we can assign regular Arrays to ReadonlyArrays.
`然而，我们可以直接把一个常规数组赋值给 ReadonlyArray。`

```ts
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
```

Just as TypeScript provides a shorthand syntax for Array<Type> with Type[], it also provides a shorthand syntax for ReadonlyArray<Type> with readonly Type[].
`TypeScript 也针对 ReadonlyArray<Type> 提供了更简短的写法 readonly Type[]。`

```ts
function doStuff(values: readonly string[]) {
  // We can read from 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);

  // ...but we can't mutate 'values'.
  values.push("hello!");
  // Property 'push' does not exist on type 'readonly string[]'.
}
```

One last thing to note is that unlike the readonly property modifier, assignability isn’t bidirectional between regular Arrays and ReadonlyArrays.
`最后有一点要注意，就是 Arrays 和 ReadonlyArray 并不能双向的赋值：`

```ts
let x: readonly string[] = [];
let y: string[] = [];

x = y; // ok
y = x;
// The type 'readonly string[]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.
```

## Tuple Types

A tuple type is another sort of Array type that knows exactly how many elements it contains, and exactly which types it contains at specific positions.
`元组类型是另外一种 Array 类型，当你明确知道数组包含多少个元素，并且每个位置元素的类型都明确知道的时候，就适合使用元组类型。`

```ts
type StringNumberPair = [string, number];
```

Here, StringNumberPair is a tuple type of string and number. Like ReadonlyArray, it has no representation at runtime, but is significant to TypeScript. To the type system, StringNumberPair describes arrays whose 0 index contains a string and whose 1 index contains a number.
`在这个例子中，StringNumberPair 就是 string 和 number 的元组类型。`

`跟 ReadonlyArray 一样，它并不会在运行时产生影响，但是对 TypeScript 很有意义。因为对于类型系统，StringNumberPair 描述了一个数组，索引 0 的值的类型是 string，索引 1 的值的类型是 number。`

```ts
function doSomething(pair: [string, number]) {
  const a = pair[0];

  const a: string;
  const b = pair[1];

  const b: number;
  // ...
}

doSomething(["hello", 42]);
```

If we try to index past the number of elements, we’ll get an error.
`如果要获取元素数量之外的元素，TypeScript 会提示错误：`

```ts
function doSomething(pair: [string, number]) {
  // ...

  const c = pair[2];
  // Tuple type '[string, number]' of length '2' has no element at index '2'.
}
```

We can also destructure tuples using JavaScript’s array destructuring.
`我们也可以使用 JavaScript 的数组解构语法解构元组：`

```ts
function doSomething(stringHash: [string, number]) {
  const [inputString, hash] = stringHash;

  console.log(inputString);

  // const inputString: string;

  console.log(hash);

  // const hash: number;
}
```

> Tuple types are useful in heavily convention-based APIs, where each element’s meaning is “obvious”. This gives us flexibility in whatever we want to name our variables when we destructure them. In the above example, we were able to name elements 0 and 1 to whatever we wanted.
> `元组类型在重度依赖约定的 API 中很有用，因为它会让每个元素的意义都很明显。当我们解构的时候，元组给了我们命名变量的自由度。在上面的例子中，我们可以命名元素 0 和 1 为我们想要的名字。`
> However, since not every user holds the same view of what’s obvious, it may be worth reconsidering whether using objects with descriptive property names may be better for your API.
> `然而，也不是每个用户都这样认为，所以有的时候，使用一个带有描述属性名字的对象也许是个更好的方式。`
> Other than those length checks, simple tuple types like these are equivalent to types which are versions of Arrays that declare properties for specific indexes, and that declare length with a numeric literal type.
> `除了长度检查，简单的元组类型跟声明了 length 属性和具体的索引属性的 Array 是一样的。`

```ts
interface StringNumberPair {
  // specialized properties
  length: 2;
  0: string;
  1: number;

  // Other 'Array<string | number>' members...
  slice(start?: number, end?: number): Array<string | number>;
}
```

Another thing you may be interested in is that tuples can have optional properties by writing out a question mark (? after an element’s type). Optional tuple elements can only come at the end, and also affect the type of length.
`在元组类型中，你也可以写一个可选属性，但可选元素必须在最后面，而且也会影响类型的 length 。`

```ts
type Either2dOr3d = [number, number, number?];

function setCoordinate(coord: Either2dOr3d) {
  const [x, y, z] = coord;

  const z: number | undefined;

  console.log(`Provided coordinates had ${coord.length} dimensions`);

  // (property) length: 2 | 3
}
```

Tuples can also have rest elements, which have to be an array/tuple type.
`Tuples 也可以使用剩余元素语法，但必须是 array/tuple 类型：`

```ts
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```

- `StringNumberBooleans` describes a tuple whose first two elements are string and number respectively, but which may have any number of booleans following.
  `描述一个元组，前两个是字符串和数值，后面是boolean`
- `StringBooleansNumber` describes a tuple whose first element is string and then any number of booleans and ending with a number.
  `描述一个元组，第一个是字符串，最后一个是数值，中间有任意多个boolean类型`
- `BooleansStringNumber` describes a tuple whose starting elements are any number of booleans and ending with a string then a number.
  `描述一个元组，最后两个是string、number`
  A tuple with a rest element has no set “length” - it only has a set of well-known elements in different positions.
  `有剩余元素的元组并不会设置 length，因为它只知道在不同位置上的已知元素信息：`

```ts
const a: StringNumberBooleans = ["hello", 1];
const b: StringNumberBooleans = ["beautiful", 2, true];
const c: StringNumberBooleans = ["world", 3, true, false, true, false, true];
```

Why might optional and rest elements be useful? Well, it allows TypeScript to correspond tuples with parameter lists. Tuples types can be used in rest parameters and arguments, so that the following:
`可选元素和剩余元素的存在，使得 TypeScript 可以在参数列表里使用元组，就像这样：`

```ts
function readButtonInput(...args: [string, number, ...boolean[]]) {
  const [name, version, ...input] = args;
  // ...
}
```

is basically equivalent to:
`基本等同于：`

```ts
function readButtonInput(name: string, version: number, ...input: boolean[]) {
  // ...
}
```

This is handy when you want to take a variable number of arguments with a rest parameter, and you need a minimum number of elements, but you don’t want to introduce intermediate variables.

## readonly Tuple Types

`只读元组类型`
One final note about tuple types - tuples types have readonly variants, and can be specified by sticking a readonly modifier in front of them - just like with array shorthand syntax.
`元组类型也是可以设置 readonly 的：`

```ts
function doSomething(pair: readonly [string, number]) {
  // ...
}
```

As you might expect, writing to any property of a readonly tuple isn’t allowed in TypeScript.
`这样 TypeScript 就不会允许写入readonly 元组的任何属性：`

```ts
function doSomething(pair: readonly [string, number]) {
  pair[0] = "hello!";
  // Cannot assign to '0' because it is a read-only property.
}
```

Tuples tend to be created and left un-modified in most code, so annotating types as readonly tuples when possible is a good default. This is also important given that array literals with const assertions will be inferred with readonly tuple types.
`在大部分的代码中，元组只是被创建，使用完后也不会被修改，所以尽可能的将元组设置为 readonly 是一个好习惯。如果我们给一个数组字面量 const 断言，也会被推断为 readonly 元组类型。`

```ts
let point = [3, 4] as const;

function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

distanceFromOrigin(point);
// Argument of type 'readonly [3, 4]' is not assignable to parameter of type '[number, number]'.
// The type 'readonly [3, 4]' is 'readonly' and cannot be assigned to the mutable type '[number, number]'.
```

Here, distanceFromOrigin never modifies its elements, but expects a mutable tuple. Since point’s type was inferred as readonly [3, 4], it won’t be compatible with [number, number] since that type can’t guarantee point’s elements won’t be mutated.
`尽管 distanceFromOrigin 并没有更改传入的元素，但函数希望传入一个可变元组。因为 point 的类型被推断为 readonly [3, 4]，它跟 [number number] 并不兼容，所以 TypeScript 给了一个报错。`
