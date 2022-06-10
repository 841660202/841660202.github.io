---
title: 8.Typescript手册 类
date: 2022-06-08 14:21:19
categories: typescript
tags: [typescript]
cover: https://img0.baidu.com/it/u=86492913,3057347241&fm=253&fmt=auto&app=138&f=JPEG?w=499&h=208
---

Background Reading:
`背景阅读` [Classes (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

TypeScript offers full support for the class keyword introduced in ES2015.
`typescript 支持 ES2015 的 class 关键字。`

As with other JavaScript language features, TypeScript adds type annotations and other syntax to allow you to express relationships between classes and other types.
` 像其他 JavaScript 语言特性一样，TypeScript 添加了类型注解和其他语法，以便您可以表达类和其他类型之间的关系。`

## Class Members

`类成员`
Here’s the most basic class - an empty one:
`这是最基本的类 - 空的一个：`

```typescript
class Point {}
```

This class isn’t very useful yet, so let’s start adding some members.
`这个类还不是很有用，所以我们开始添加一些成员。`

## Fields

`字段`
A field declaration creates a public writeable property on a class:
`字段声明创建一个公共可写属性在类上：`

```typescript
class Point {
  x: number;
  y: number;
}

const pt = new Point();
pt.x = 0;
pt.y = 0;
```

As with other locations, the type annotation is optional, but will be an implicit any if not specified.
`与其他地方一样，类型注解是可选的，如果没有指定，将会是任意类型。`
Fields can also have initializers; these will run automatically when the class is instantiated:
`字段也可以有初始值，这会在类被实例化时自动运行：`

```typescript
class Point {
  x = 0;
  y = 0;
}

const pt = new Point();
// Prints 0, 0
console.log(`${pt.x}, ${pt.y}`);
```

Just like with const, let, and var, the initializer of a class property will be used to infer its type:
`和 const，let，var 类型推断的初始值。`

```typescript
const pt = new Point();
pt.x = "0";
// Type 'string' is not assignable to type 'number'.
```

## --strictPropertyInitialization

The strictPropertyInitialization setting controls whether class fields need to be initialized in the constructor.
`strictPropertyInitialization 设置控制类字段是否需要在构造函数中初始化。`

```ts
class BadGreeter {
  name: string;
  // Property 'name' has no initializer and is not definitely assigned in the constructor.
}
class GoodGreeter {
  name: string;

  constructor() {
    this.name = "hello";
  }
}
```

Note that the field needs to be initialized in the constructor itself. TypeScript does not analyze methods you invoke from the constructor to detect initializations, because a derived class might override those methods and fail to initialize the members.
`注意，字段需要在构造函数本身中初始化。TypeScript 不会分析调用构造函数的方法来检测初始化，因为继承的子类可能覆盖这些方法并且失败初始化成员。`
If you intend to definitely initialize a field through means other than the constructor (for example, maybe an external library is filling in part of your class for you), you can use the definite assignment assertion operator, !:
`如果您愿意通过其他方式来确定初始化一个字段（例如，可能是外部库填充您的类的一部分），您可以使用确定赋值断言运算符：`

```ts
class OKGreeter {
  // Not initialized, but no error
  name!: string;
}
```

## readonly

Fields may be prefixed with the readonly modifier. This prevents assignments to the field outside of the constructor.
`字段可以使用 readonly 前缀。这将阻止在构造函数之外赋值给字段。`

```ts
class Greeter {
  readonly name: string = "world";

  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }

  err() {
    this.name = "not ok";
    // Cannot assign to 'name' because it is a read-only property.
  }
}
const g = new Greeter();
g.name = "also not ok";
// Cannot assign to 'name' because it is a read-only property.
```

## Constructors

`构造函数`
Background Reading:
`背景阅读：` [Constructor (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor)

Class constructors are very similar to functions. You can add parameters with type annotations, default values, and overloads:
`类构造函数和函数很相似。您可以添加参数，类型注解，默认值和重载。`

```typescript
class Point {
  x: number;
  y: number;

  // Normal signature with defaults
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
```

```typescript
class Point {
  // Overloads
  constructor(x: number, y: string);
  constructor(s: string);
  constructor(xs: any, y?: any) {
    // TBD
  }
}
```

There are just a few differences between class constructor signatures and function signatures:
`类构造函数和函数签名有一些不同：`

- Constructors can’t have type parameters - these belong on the outer class declaration, which we’ll learn about later
  `- 构造函数不能有类型参数，这些属于外部类声明，我们将会学习其他内容`
- Constructors can’t have return type annotations - the class instance type is always what’s returned
  `- 构造函数不能有返回类型注解，返回的类实例类型始终是返回的`

## Super Calls

`超类调用`
Just as in JavaScript, if you have a base class, you’ll need to call super(); in your constructor body before using any this. members:
`在 JavaScript 中，如果您有基类，您需要在构造函数体中调用 super(); 在使用任何 this. 成员之前：`

```typescript
class Base {
k = 4;
}

class Derived extends Base {
constructor() {
// Prints a wrong value in ES5; throws exception in ES6
console.log(this.k);
'super' must be called before accessing 'this' in the constructor of a derived class.
super();
}
}
```

Forgetting to call super is an easy mistake to make in JavaScript, but TypeScript will tell you when it’s necessary.
`在 JavaScript 中，忘记调用 super() 可能是一个很简单的错误，但 TypeScript 将告诉您当必要时。`

## Methods

`方法`
Background Reading:
`背景阅读：` [Method (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/method)

A function property on a class is called a method. Methods can use all the same type annotations as functions and constructors:
`类中的函数属性被称为方法。方法可以使用和函数和构造函数一样的类型注解：`

```typescript
class Point {
  x = 10;
  y = 10;

  scale(n: number): void {
    this.x *= n;
    this.y *= n;
  }
}
```

Other than the standard type annotations, TypeScript doesn’t add anything else new to methods.
`除了标准类型注解之外，TypeScript 不会添加任何其他东西到方法。`
Note that inside a method body, it is still mandatory to access fields and other methods via this.. An unqualified name in a method body will always refer to something in the enclosing scope:
`在方法体中，在方法体内部，您仍然必须通过 this 访问字段和其他方法。在方法体内部，未命名的名称将始终指向包含它的作用域内的东西：`

```typescript
let x: number = 0;

class C {
x: string = "hello";

  m() {
    // This is trying to modify 'x' from line 1, not the class property
    // 这是尝试从行 1 修改 'x'，而不是类属性
    x = "world";
    Type 'string' is not assignable to type 'number'.
  }
}
```

## Getters / Setters

`获取器/设置器`
Classes can also have accessors:
`类也可以有访问器：`

```typescript
class C {
  _length = 0;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value;
  }
}
```

> Note that a field-backed get/set pair with no extra logic is very rarely useful in JavaScript. It’s fine to expose public fields if you don’t need to add additional logic during the get/set operations.
> `>注意，没有额外逻辑的字段-获取/设置-对偶在 JavaScript 中很少是有用的。如果您不需要在获取/设置操作期间添加额外逻辑，则可以暴露公共字段。`

TypeScript has some special inference rules for accessors:
`TypeScript 有一些特殊的推断规则为访问器：`

- If get exists but no set, the property is automatically readonly
  `- 如果 get 存在但没有 set，属性是自动只读的`
- If the type of the setter parameter is not specified, it is inferred from the return type of the getter
  `- 如果设置器参数的类型没有指定，它会从 getter 的返回类型推断`
- Getters and setters must have the same Member Visibility
  `- 获取器和设置器必须具有相同的成员可见性`
  Since TypeScript 4.3, it is possible to have accessors with different types for getting and setting.
  `从 TypeScript 4.3 开始，可以有不同类型的访问器获取和设置。`

```typescript
class Thing {
  _size = 0;

  get size(): number {
    return this._size;
  }

  set size(value: string | number | boolean) {
    let num = Number(value);

    // Don't allow NaN, Infinity, etc

    if (!Number.isFinite(num)) {
      this._size = 0;
      return;
    }

    this._size = num;
  }
}
```

## Index Signatures

`索引签名`
Classes can declare index signatures; these work the same as Index Signatures for other object types:
`类可以声明索引签名；这类似于其他对象类型的索引签名：`

```typescript
class MyClass {
  [s: string]: boolean | ((s: string) => boolean);

  check(s: string) {
    return this[s] as boolean;
  }
}
```

Because the index signature type needs to also capture the types of methods, it’s not easy to usefully use these types. Generally it’s better to store indexed data in another place instead of on the class instance itself.
`因为索引签名类型也需要捕获方法的类型，这使得并不容易有效的使用这些类型。通常的来说，在其他地方存储索引数据而不是在类实例本身，会更好一些。`

## Class Heritage

`类继承`
Like other languages with object-oriented features, classes in JavaScript can inherit from base classes.
`在 JavaScript 中，类可以从基类继承。`

## implements Clauses

`implements 语句`
You can use an implements clause to check that a class satisfies a particular interface. An error will be issued if a class fails to correctly implement it:
`你可以使用 implements 语句检查一个类是否满足一个特定的 interface。如果一个类没有正确的实现(implement)它，TypeScript 会报错：`

```typescript
interface Pingable {
  ping(): void;
}

class Sonar implements Pingable {
  ping() {
    console.log("ping!");
  }
}

class Ball implements Pingable {
  // Class 'Ball' incorrectly implements interface 'Pingable'.
  // 类 'Ball' 错误地实现了接口 'Pingable'。
  // Property 'ping' is missing in type 'Ball' but required in type 'Pingable'.
  // 在类型 'Ball' 中缺少属性 'ping'，但是在类型 'Pingable' 中是必需的。
  pong() {
    console.log("pong!");
  }
}
```

Classes may also implement multiple interfaces, e.g. class C implements A, B {.
`类也可以实现多个接口，比如 class C implements A, B {`

**Cautions**

`注意事项`

**大概意思：这是类型，不是 java 中的接口，不能当 js 类去用,与 js 的类不是一个概念**

:::warning
It’s important to understand that an implements clause is only a check that the class can be treated as the interface type. It doesn’t change the type of the class or its methods at all. A common source of error is to assume that an implements clause will change the class type - it doesn’t!
`implements 语句仅仅检查类是否按照接口类型实现，但它并不会改变类的类型或者方法的类型。一个常见的错误就是以为 implements 语句会改变类的类型,——然而实际上它并不会：`
:::

```typescript
interface Checkable {
  check(name: string): boolean;
}

class NameChecker implements Checkable {
  check(s) {
    // Parameter 's' implicitly has an 'any' type.
    // Notice no error here
    return s.toLowercse() === "ok";
    // any;
  }
}
```

In this example, we perhaps expected that s’s type would be influenced by the name: string parameter of check. It is not - implements clauses don’t change how the class body is checked or its type inferred.
`在这个例子中，我们可能会以为 s 的类型会被 check 的 name: string 参数影响。实际上并没有，implements 语句并不会影响类的内部是如何检查或者类型推断的。`
Similarly, implementing an interface with an optional property doesn’t create that property:
`类似的，实现一个有可选属性的接口，并不会创建这个属性：`

```ts
interface A {
  x: number;
  y?: number;
}
class C implements A {
  x = 0;
}
const c = new C();
c.y = 10;
// Property 'y' does not exist on type 'C'.
```

## extends Clauses

`extends 语句`

Background Reading: [Class Inheritance](https://www.typescriptlang.org/docs/handbook/classes.html#class-inheritance)

`背景阅读：[类继承](https://www.typescriptlang.org/docs/handbook/classes.html#class-inheritance)`

Classes may extend from a base class. A derived class has all the properties and methods of its base class, and also define additional members.
`类可以从基类继承。一个派生类具有基类的所有属性和方法，并且还定义了一些额外的成员。`

```typescript
class Animal {
  move() {
    console.log("Moving along!");
  }
}

class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i < times; i++) {
      console.log("woof!");
    }
  }
}

const d = new Dog();
// Base class method
d.move();
// Derived class method
d.woof(3);
```

### Overriding Methods

`覆写方法`

Background Reading: [Overriding Methods](https://www.typescriptlang.org/docs/handbook/classes.html#overriding-methods)

A derived class can also override a base class field or property. You can use the super. syntax to access base class methods. Note that because JavaScript classes are a simple lookup object, there is no notion of a “super field”.
`派生类可以覆写基类的属性或方法。可以使用 super. 语句访问基类的方法。注意，因为 JavaScript 的类是简单的查找对象，所以没有基类的“super 字段”。`
TypeScript enforces that a derived class is always a subtype of its base class.
`TypeScript 强制所有派生类都是基类的子类。`
For example, here’s a legal way to override a method:
`这里是一种合法的方式覆写方法：`

```typescript
class Base {
  greet() {
    console.log("Hello, world!");
  }
}

class Derived extends Base {
  greet(name?: string) {
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}

const d = new Derived();
d.greet();
d.greet("reader");
```

It’s important that a derived class follow its base class contract. Remember that it’s very common (and always legal!) to refer to a derived class instance through a base class reference:
`派生类需要遵循着它的基类的实现。而且通过一个基类引用指向一个派生类实例，这是非常常见并合法的：`

```typescript
// Alias the derived instance through a base class reference
// 基类引用来访问派生类的实例
const b: Base = d;
// No problem
// 没有问题
b.greet();
```

What if Derived didn’t follow Base’s contract?
`但是如果 Derived 不遵循 Base 的约定实现呢？`

```typescript
class Base {
  greet() {
    console.log("Hello, world!");
  }
}

class Derived extends Base {
  // Make this parameter required
  greet(name: string) {
    // Property 'greet' in type 'Derived' is not assignable to the same property in base type 'Base'.
    // Type '(name: string) => void' is not assignable to type '() => void'.
    console.log(`Hello, ${name.toUpperCase()}`);
  }
}
```

If we compiled this code despite the error, this sample would then crash:
`如果我们编译这段代码，却没有报错，那么这个例子就会崩溃：`

```typescript
const b: Base = new Derived();
// Crashes because "name" will be undefined
b.greet();
```

### Type-only Field Declarations

`只有字段申明的类型`
When target >= ES2022 or useDefineForClassFields is true, class fields are initialized after the parent class constructor completes, overwriting any value set by the parent class. This can be a problem when you only want to re-declare a more accurate type for an inherited field. To handle these cases, you can write declare to indicate to TypeScript that there should be no runtime effect for this field declaration.
`当目标版本 >= ES2022 或者 useDefineForClassFields 为 true 时，类字段在父类构造函数完成后初始化，并且会覆盖父类的设置。这种情况下，如果你只想重新定义一个更加准确的类型，你可以使用 declare 来指示给 TypeScript。`

```typescript
interface Animal {
  dateOfBirth: any;
}

interface Dog extends Animal {
  breed: any;
}

class AnimalHouse {
  resident: Animal;
  constructor(animal: Animal) {
    this.resident = animal;
  }
}

class DogHouse extends AnimalHouse {
  // Does not emit JavaScript code,
  // 不能生成 JavaScript 代码
  // only ensures the types are correct
  // 只是确保类型正确
  declare resident: Dog;
  constructor(dog: Dog) {
    super(dog);
  }
}
```

**输出**

```ts
// .d.ts
interface Animal {
  dateOfBirth: any;
}
interface Dog extends Animal {
  breed: any;
}
declare class AnimalHouse {
  resident: Animal;
  constructor(animal: Animal);
}
declare class DogHouse extends AnimalHouse {
  resident: Dog;
  constructor(dog: Dog);
}
```

### Initialization Order

`初始化顺序`
The order that JavaScript classes initialize can be surprising in some cases. Let’s consider this code:
`这段代码的初始化顺序可能会有些不同。`

```typescript
class Base {
  name = "base";
  constructor() {
    console.log("My name is " + this.name);
  }
}

class Derived extends Base {
  name = "derived";
}

// Prints "base", not "derived"
const d = new Derived();
```

### What happened here?

`这里发生了什么？` 先执行基类构造，this.name 值是“base”
The order of class initialization, as defined by JavaScript, is:
`JavaScript 的初始化顺序：`

- The base class fields are initialized
  `基类字段初始化`
- The base class constructor runs
  `基类构造函数运行`
- The derived class fields are initialized
  `派生类字段初始化`
- The derived class constructor runs
  `派生类构造函数运行`
  This means that the base class constructor saw its own value for name during its own constructor, because the derived class field initializations hadn’t run yet.

```ts
class Base {
  name = "base";
  constructor() {
    console.log("My name is " + this.name);
  }
}

class Derived extends Base {
  name = "derived";
}

// Prints "base", not "derived"
const d = new Derived();
console.log(d.name); // 加个日志看看
```

点击 run 后，返回

```
[LOG]: "My name is base"
[LOG]: "derived"
```

### Inheriting Built-in Types

`继承内置类型`

> Note: If you don’t plan to inherit from built-in types like Array, Error, Map, etc. or your compilation target is explicitly set to ES6/ES2015 or above, you may skip this section
> `注意：如果你不打算继承内置的类型比如 Array、Error、Map 等或者你的编译目标是 ES6/ES2015 或者更新的版本，你可以跳过这个章节。`

In ES2015, constructors which return an object implicitly substitute the value of this for any callers of super(...). It is necessary for generated constructor code to capture any potential return value of super(...) and replace it with this.
`在 ES2015 中，当调用 super(...) 的时候，如果构造函数返回了一个对象，会隐式替换 this 的值。所以捕获 super() 可能的返回值并用 this 替换它是非常有必要的。`
As a result, subclassing Error, Array, and others may no longer work as expected. This is due to the fact that constructor functions for Error, Array, and the like use ECMAScript 6’s new.target to adjust the prototype chain; however, there is no way to ensure a value for new.target when invoking a constructor in ECMAScript 5. Other downlevel compilers generally have the same limitation by default.
`这就导致，像 Error、Array 等子类，也许不会再如你期望的那样运行。这是因为 Error、Array 等类似内置对象的构造函数，会使用 ECMAScript 6 的 new.target 调整原型链。然而，在 ECMAScript 5 中，当调用一个构造函数的时候，并没有方法可以确保 new.target 的值。 其他的降级编译器默认也会有同样的限制。`
For a subclass like the following:
`下面的子类：`

```ts
class MsgError extends Error {
  constructor(m: string) {
    super(m);
  }
  sayHello() {
    return "hello " + this.message;
  }
}
```

you may find that:
`你也许可以发现：`
methods may be undefined on objects returned by constructing these subclasses, so calling sayHello will result in an error.
`对象的方法可能是 undefined ，所以调用 sayHello 会导致错误`
instanceof will be broken between instances of the subclass and their instances, so (new MsgError()) instanceof MsgError will return false.
`instanceof 失效， (new MsgError()) instanceof MsgError 会返回 false。`
As a recommendation, you can manually adjust the prototype immediately after any super(...) calls.
`我们推荐，手动的在 super(...) 调用后调整原型：`

```ts
class MsgError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, MsgError.prototype);
  }

  sayHello() {
    return "hello " + this.message;
  }
}
```

However, any subclass of MsgError will have to manually set the prototype as well. For runtimes that don’t support Object.setPrototypeOf, you may instead be able to use `__proto__`.
`不过，任何 MsgError 的子类也不得不手动设置原型。如果运行时不支持 Object.setPrototypeOf，你也许可以使用 __proto__ `

Unfortunately, these workarounds will not work on Internet Explorer 10 and prior. One can manually copy methods from the prototype onto the instance itself (i.e. MsgError.prototype onto this), but the prototype chain itself cannot be fixed.
`不幸的是，这些方案并不会能在 IE 10 或者之前的版本正常运行。解决的一个方法是手动拷贝原型中的方法到实例中（就比如 MsgError.prototype 到 this），但是它自己的原型链依然没有被修复`

## Member Visibility

`成员可见性`
You can use TypeScript to control whether certain methods or properties are visible to code outside the class.
`你可以使用 TypeScript 控制某个方法或者属性是否对类以外的代码可见。`

### public

The default visibility of class members is public. A public member can be accessed anywhere:
`因为 public 是默认的可见性修饰符，所以你不需要写它，除非处于格式或者可读性的原因。`

```ts
class Greeter {
  public greet() {
    console.log("hi!");
  }
}
const g = new Greeter();
g.greet();
```

Because public is already the default visibility modifier, you don’t ever need to write it on a class member, but might choose to do so for style/readability reasons.
`因为 public 是默认的可见性修饰符，所以你不需要写它，除非处于格式或者可读性的原因。`

### protected

protected members are only visible to subclasses of the class they’re declared in.
`protected 成员仅仅对子类可见`

```ts
class Greeter {
  public greet() {
    console.log("Hello, " + this.getName());
  }
  protected getName() {
    return "hi";
  }
}

class SpecialGreeter extends Greeter {
  public howdy() {
    // OK to access protected member here
    console.log("Howdy, " + this.getName());
  }
}
const g = new SpecialGreeter();
g.greet(); // OK
g.getName();
// Property 'getName' is protected and only accessible within class 'Greeter' and its subclasses.
```

### Exposure of protected members

`受保护成员的公开`

Derived classes need to follow their base class contracts, but may choose to expose a subtype of base class with more capabilities. This includes making protected members public:
`派生类需要遵循基类的实现，但是依然可以选择公开拥有更多能力的基类子类型，这就包括让一个 protected 成员变成 public：`

```ts
class Base {
  protected m = 10;
}
class Derived extends Base {
  // No modifier, so default is 'public'
  m = 15;
}
const d = new Derived();
console.log(d.m); // OK
```

Note that Derived was already able to freely read and write m, so this doesn’t meaningfully alter the “security” of this situation. The main thing to note here is that in the derived class, we need to be careful to repeat the protected modifier if this exposure isn’t intentional.
`这里需要注意的是，如果公开不是故意的，在这个派生类中，我们需要小心的拷贝 protected 修饰符。`

### Cross-hierarchy protected access

`交叉等级受保护成员访问`

Different OOP languages disagree about whether it’s legal to access a protected member through a base class reference:

`不同的 OOP 语言在通过一个基类引用是否可以合法的获取一个 protected 成员是有争议的。`

```ts
class Base {
  protected x: number = 1;
}
class Derived1 extends Base {
  protected x: number = 5;
}
class Derived2 extends Base {
  f1(other: Derived2) {
    other.x = 10;
  }
  f2(other: Base) {
    other.x = 10;
    // Property 'x' is protected and only accessible through an instance of class 'Derived2'. This is an instance of class 'Base'.
    // 属性 'x' 受保护并且只能通过类 'Derived2' 的实例访问。这是一个类 'Base' 的实例。
  }
}
```

Java, for example, considers this to be legal. On the other hand, C# and C++ chose that this code should be illegal.
`在 Java 中，这是合法的，而 C# 和 C++ 认为这段代码是不合法的。`
TypeScript sides with C# and C++ here, because accessing x in Derived2 should only be legal from Derived2’s subclasses, and Derived1 isn’t one of them. Moreover, if accessing x through a Derived1 reference is illegal (which it certainly should be!), then accessing it through a base class reference should never improve the situation.
`TypeScript 站在 C# 和 C++ 这边。因为 Derived2 的 x 应该只有从 Derived2 的子类访问才是合法的，而 Derived1 并不是它们中的一个。此外，如果通过 Derived1 访问 x 是不合法的，通过一个基类引用访问也应该是不合法的。`
See also Why Can’t I Access A Protected Member From A Derived Class? which explains more of C#‘s reasoning.
`看这篇《Why Can’t I Access A Protected Member From A Derived Class?》 (opens new window)，解释了更多 C# 这样做的原因。`

### private

private is like protected, but doesn’t allow access to the member even from subclasses:
`private 有点像 protected ，但是不允许访问成员，即便是子类。`

```ts
class Base {
  private x = 0;
}
const b = new Base();
// Can't access from outside the class
// 不能从外部访问
console.log(b.x);
// Property 'x' is private and only accessible within class 'Base'.
// 属性 'x' 是私有的，只能在类 'Base' 中访问。
```

```ts
class Derived extends Base {
  showX() {
    // Can't access in subclasses
    console.log(this.x);
    // Property 'x' is private and only accessible within class 'Base'.
    // 属性 'x' 是私有的，只能在类 'Base' 中访问。
  }
}
```

Because private members aren’t visible to derived classes, a derived class can’t increase its visibility:
`因为 private 成员对派生类并不可见，所以一个派生类也不能增加它的可见性：`

```ts
class Base {
  private x = 0;
}
class Derived extends Base {
  // Class 'Derived' incorrectly extends base class 'Base'.
  // 类 'Derived' 错误地继承了基类 'Base'。
  // Property 'x' is private in type 'Base' but not in type 'Derived'.
  // 属性 'x' 在类 'Base' 中，但不在类 'Derived' 中。
  x = 1;
}
```

### Cross-instance private access

`交叉等级受保护成员访问`
Different OOP languages disagree about whether different instances of the same class may access each others’ private members. While languages like Java, C#, C++, Swift, and PHP allow this, Ruby does not.
`不同的 OOP 语言在通过一个基类引用是否可以合法的获取一个 protected 成员是有争议的。在 Java, C#, C++, Swift, and PHP 中，这是合法的，而 Ruby 认为这段代码是不合法的。`
TypeScript does allow cross-instance private access:
`允许交叉实例私有访问`

```ts
class A {
  private x = 10;

  public sameAs(other: A) {
    // No error
    return other.x === this.x;
  }
}
```

### Caveats

`警告`

> Like other aspects of TypeScript’s type system, private and protected are only enforced during type checking.
> `类型检查中，private 和 protected 只是类型检查的一部分。`

This means that JavaScript runtime constructs like in or simple property lookup can still access a private or protected member:
`这意味着在 JavaScript 运行时，像 in 或者简单的属性查找，依然可以获取 private 或者 protected 成员。`

```ts
class MySafe {
  private secretKey = 12345;
}
```

```ts
// In a JavaScript file...
const s = new MySafe();
// Will print 12345
console.log(s.secretKey);
```

private also allows access using bracket notation during type checking. This makes private-declared fields potentially easier to access for things like unit tests, with the drawback that these fields are soft private and don’t strictly enforce privacy.
`private 也允许使用方括号来访问，这使得 private-declared 字段可以轻松地访问，但是这些字段是软私有的，并不强制私密。`

```ts
class MySafe {
private secretKey = 12345;
}

const s = new MySafe();

// Not allowed during type checking
console.log(s.secretKey);
Property 'secretKey' is private and only accessible within class 'MySafe'.

// OK
console.log(s["secretKey"]);
```

Unlike TypeScripts’s private, JavaScript’s private fields (#) remain private after compilation and do not provide the previously mentioned escape hatches like bracket notation access, making them hard private.
`不像 TypeScript 的 private，JavaScript 的私有字段 (opens new window)（#）即便是编译后依然保留私有性，并且不会提供像上面这种方括号获取的方法，这让它们变得强私有（hard private）。`

```ts
class Dog {
  #barkAmount = 0;
  personality = "happy";

  constructor() {}
}
```

```ts
"use strict";
class Dog {
  #barkAmount = 0;
  personality = "happy";
  constructor() {}
}
```

When compiling to ES2021 or less, TypeScript will use WeakMaps in place of #.
`在编译到 ES2021 或更低版本时，TypeScript 会使用 WeakMaps 替代 #。`

```ts
"use strict";
var _Dog_barkAmount;
class Dog {
  constructor() {
    _Dog_barkAmount.set(this, 0);
    this.personality = "happy";
  }
}
_Dog_barkAmount = new WeakMap();
```

If you need to protect values in your class from malicious actors, you should use mechanisms that offer hard runtime privacy, such as closures, WeakMaps, or private fields. Note that these added privacy checks during runtime could affect performance.
`如果你需要防止恶意攻击，保护类中的值，你应该使用强私有的机制比如闭包，WeakMaps ，或者私有字段。但是注意，这也会在运行时影响性能。`

## Static Members

`静态成员`

Background Reading: [Static Members (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static)

Classes may have static members. These members aren’t associated with a particular instance of the class. They can be accessed through the class constructor object itself:
`类可以有静态成员，静态成员跟类实例没有关系，可以通过类本身访问到：`

```ts
class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}
console.log(MyClass.x);
MyClass.printX();
```

Static members can also use the same public, protected, and private visibility modifiers:
`类可以有静态成员，静态成员跟类实例没有关系，可以通过类本身访问到：`

```ts
class MyClass {
  private static x = 0;
}
console.log(MyClass.x);
// Property 'x' is private and only accessible within class 'MyClass'.
```

### Static members are also inherited:

`静态成员也可以被继承：`

```ts
class Base {
  static getGreeting() {
    return "Hello world";
  }
}
class Derived extends Base {
  myGreeting = Derived.getGreeting();
}
```

### Special Static Names

`特殊静态类`
It’s generally not safe/possible to overwrite properties from the Function prototype. Because classes are themselves functions that can be invoked with new, certain static names can’t be used. Function properties like name, length, and call aren’t valid to define as static members:
`类本身是函数，而覆写 Function 原型上的属性通常认为是不安全的，因此不能使用一些固定的静态名称，函数属性像 name、length、call 不能被用来定义 static 成员：`

```ts
class S {
  static name = "S!";
  // Static property 'name' conflicts with built-in property 'Function.name' of constructor function 'S'.
}
```

### Why No Static Classes?

`为什么没有静态类？`

TypeScript (and JavaScript) don’t have a construct called static class the same way as, for example, C# does.
`TypeScript（和 JavaScript） 并没有名为静态类（static class）的结构，但是像 C# 和 Java 有。`
Those constructs only exist because those languages force all data and functions to be inside a class; because that restriction doesn’t exist in TypeScript, there’s no need for them. A class with only a single instance is typically just represented as a normal object in JavaScript/TypeScript.
`所谓静态类，指的是作为类的静态成员存在于某个类的内部的类。比如这种：`
For example, we don’t need a “static class” syntax in TypeScript because a regular object (or even top-level function) will do the job just as well:
`静态类之所以存在是因为这些语言强迫所有的数据和函数都要在一个类内部，但这个限制在 TypeScript 中并不存在，所以也没有静态类的需要。一个只有一个单独实例的类，在 JavaScript/TypeScript 中，完全可以使用普通的对象替代。`

```ts
// Unnecessary "static" class
class MyStaticClass {
  static doSomething() {}
}

// Preferred (alternative 1)
function doSomething() {}

// Preferred (alternative 2)
const MyHelperObject = {
  dosomething() {},
};
```

## static Blocks in Classes

`类静态块`
Static blocks allow you to write a sequence of statements with their own scope that can access private fields within the containing class. This means that we can write initialization code with all the capabilities of writing statements, no leakage of variables, and full access to our class’s internals.
`静态块允许你写一系列有自己作用域的语句，也可以获取类里的私有字段。这意味着我们可以安心的写初始化代码：正常书写语句，无变量泄漏，还可以完全获取类中的属性和方法。`

```ts
class Foo {
  static #count = 0;

  get count() {
    return Foo.#count;
  }

  static {
    try {
      const lastInstances = loadLastInstances();
      Foo.#count += lastInstances.length;
    } catch {}
  }
}
```

### Generic Classes

`范型类`

Classes, much like interfaces, can be generic. When a generic class is instantiated with new, its type parameters are inferred the same way as in a function call:
`类跟接口一样，也可以写泛型。当使用 new 实例化一个泛型类，它的类型参数的推断跟函数调用是同样的方式：`

```ts
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}

const b = new Box("hello!");

const b: Box<string>;
```

Classes can use generic constraints and defaults the same way as interfaces.
`类跟接口一样也可以使用泛型约束以及默认值。`

### Type Parameters in Static Members

`静态成员中的类型参数`
This code isn’t legal, and it may not be obvious why:
`这段代码不合法，并且可能不明白为什么：`

```ts
class Box<Type> {
static defaultValue: Type;
Static members cannot reference class type parameters.
}
```

Remember that types are always fully erased! At runtime, there’s only one Box.defaultValue property slot. This means that setting Box<string>.defaultValue (if that were possible) would also change Box<number>.defaultValue - not good. The static members of a generic class can never refer to the class’s type parameters.
`记住类型会被完全抹除，运行时，只有一个 Box.defaultValue 属性槽。这也意味着如果设置 Box<string>.defaultValue 是可以的话，这也会改变 Box<number>.defaultValue，而这样是不好的。`

### this at Runtime in Classes

Background Reading:
`背景阅读：`
[this keyword (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)  
It’s important to remember that TypeScript doesn’t change the runtime behavior of JavaScript, and that JavaScript is somewhat famous for having some peculiar runtime behaviors.
`TypeScript 并不会更改 JavaScript 运行时的行为，并且 JavaScript 有时会出现一些奇怪的运行时行为。`
JavaScript’s handling of this is indeed unusual:
`就比如 JavaScript 处理 this 就很奇怪：`

```js
class MyClass {
  name = "MyClass";
  getName() {
    return this.name;
  }
}
const c = new MyClass();
const obj = {
  name: "obj",
  getName: c.getName,
};
// Prints "obj", not "MyClass"
console.log(obj.getName());
```

Long story short, by default, the value of this inside a function depends on how the function was called. In this example, because the function was called through the obj reference, its value of this was obj rather than the class instance.
`长篇大论，默认情况下，函数内部的 this 值取决于函数被调用的方式。在这个例子中，因为函数被 obj 引用调用，它的 this 值是 obj，而不是类实例。`
This is rarely what you want to happen! TypeScript provides some ways to mitigate or prevent this kind of error.
`这很少是你想要的！TypeScript 提供了一些方法来解决这种错误。`

### Arrow Functions

Background Reading:
`背景阅读：`
[Arrow functions (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

If you have a function that will often be called in a way that loses its this context, it can make sense to use an arrow function property instead of a method definition:
`如果你有一个函数，经常在被调用的时候丢失 this 上下文，使用一个箭头函数或许更好些。`

```ts
class MyClass {
  name = "MyClass";
  getName = () => {
    return this.name;
  };
}
const c = new MyClass();
const g = c.getName;
// Prints "MyClass" instead of crashing
console.log(g());
```

This has some trade-offs:
`这里有几点需要注意下：`

- The this value is guaranteed to be correct at runtime, even for code not checked with TypeScript
  `- 这个 this 值在运行时是一定的，即使没有 TypeScript 的检查`
- This will use more memory, because each class instance will have its own copy of each function defined this way
  `- 这会使用更多的内存，因为每个类实例都会有自己的拷贝`
- You can’t use super.getName in a derived class, because there’s no entry in the prototype chain to fetch the base class method from
  `- 你不能在子类中使用 super.getName，因为没有基类原型链来获取基类方法`

### this parameters

In a method or function definition, an initial parameter named this has special meaning in TypeScript. These parameters are erased during compilation:
`在方法或函数定义中，一个初始参数名为 this 的特殊意义在 TypeScript 中。这些参数在编译期间会被抹除。`

```ts
// TypeScript input with 'this' parameter
function fn(this: SomeType, x: number) {
  /* ... */
}
```

```js
// JavaScript output
function fn(x) {
  /* ... */
}
```

TypeScript checks that calling a function with a this parameter is done so with a correct context. Instead of using an arrow function, we can add a this parameter to method definitions to statically enforce that the method is called correctly:
`TypeScript 会检查一个有 this 参数的函数在调用时是否有一个正确的上下文。不像上个例子使用箭头函数，我们可以给方法定义添加一个 this 参数，静态强制方法被正确调用：`

```ts
class MyClass {
  name = "MyClass";
  getName(this: MyClass) {
    return this.name;
  }
}
const c = new MyClass();
// OK
c.getName();

// Error, would crash
const g = c.getName;
console.log(g());
// The 'this' context of type 'void' is not assignable to method's 'this' of type 'MyClass'.
```

This method makes the opposite trade-offs of the arrow function approach:
`这个方法也有一些注意点，正好跟箭头函数相反：`

- JavaScript callers might still use the class method incorrectly without realizing it
  `JavaScript 调用者依然可能在没有意识到它的时候错误使用类方法`
- Only one function per class definition gets allocated, rather than one per class instance
  `每个类一个函数，而不是每一个类实例一个函数`
- Base method definitions can still be called via super.
  `基类方法定义依然可以通过 super 调用`

### this Types

In classes, a special type called this refers dynamically to the type of the current class. Let’s see how this is useful:
`在类中，一个特殊的类型叫做 this，它可以动态指向当前类的类型。`

```ts
class Box {
  contents: string = "";
  set(value: string) {
    // (method) Box.set(value: string): this
    this.contents = value;
    return this;
  }
}
```

Here, TypeScript inferred the return type of set to be this, rather than Box. Now let’s make a subclass of Box:
`这里，TypeScript 推断 set 的返回类型为 this，而不是 Box。`

```ts
class ClearableBox extends Box {
  clear() {
    this.contents = "";
  }
}

const a = new ClearableBox();
const b = a.set("hello");

// const b: ClearableBox
```

You can also use this in a parameter type annotation:
`你也可以在参数类型注解中使用 this：`

```ts
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}
```

This is different from writing other: Box — if you have a derived class, its sameAs method will now only accept other instances of that same derived class:
`这与写其他：Box — 如果你有一个派生类，它的 sameAs 方法将只接受来自同一派生类的其他实例：`

```ts
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}

class DerivedBox extends Box {
  otherContent: string = "?";
}

const base = new Box();
const derived = new DerivedBox();
derived.sameAs(base);
// Argument of type 'Box' is not assignable to parameter of type 'DerivedBox'.
// Property 'otherContent' is missing in type 'Box' but required in type 'DerivedBox'.
```

### this -based type guards

You can use this is Type in the return position for methods in classes and interfaces. When mixed with a type narrowing (e.g. if statements) the type of the target object would be narrowed to the specified Type.
`你可以在类和接口中的方法的返回位置使用 this。当混入一个类型缩小（如 if 语句）的时候，目标对象的类型将被缩小到指定的类型。`

```ts
class FileSystemObject {
  isFile(): this is FileRep {
    return this instanceof FileRep;
  }
  isDirectory(): this is Directory {
    return this instanceof Directory;
  }
  isNetworked(): this is Networked & this {
    return this.networked;
  }
  constructor(public path: string, private networked: boolean) {}
}

class FileRep extends FileSystemObject {
  constructor(path: string, public content: string) {
    super(path, false);
  }
}

class Directory extends FileSystemObject {
  children: FileSystemObject[];
}

interface Networked {
  host: string;
}

const fso: FileSystemObject = new FileRep("foo/bar.txt", "foo");

if (fso.isFile()) {
  fso.content;
  // const fso: FileRep;
} else if (fso.isDirectory()) {
  fso.children;
  // const fso: Directory;
} else if (fso.isNetworked()) {
  fso.host;
  // const fso: Networked & FileSystemObject;
}
```

A common use-case for a this-based type guard is to allow for lazy validation of a particular field. For example, this case removes an undefined from the value held inside box when hasValue has been verified to be true:
`一个常见的基于 this 的类型保护的使用例子，会对一个特定的字段进行懒校验（lazy validation）。举个例子，在这个例子中，当 hasValue 被验证为 true 时，会从类型中移除 undefined：`

```ts
class Box<T> {
value?: T;

hasValue(): this is { value: T } {
return this.value !== undefined;
}
}

const box = new Box();
box.value = "Gameboy";

box.value;

(property) Box<unknown>.value?: unknown

if (box.hasValue()) {
box.value;

(property) value: unknown
}
```

## Parameter Properties

`参数属性`
TypeScript offers special syntax for turning a constructor parameter into a class property with the same name and value. These are called parameter properties and are created by prefixing a constructor argument with one of the visibility modifiers public, private, protected, or readonly. The resulting field gets those modifier(s):
`TypeScript 提供了特殊的语法，可以把一个构造函数参数转成一个同名同值的类属性。这些就被称为参数属性（parameter properties）。你可以通过在构造函数参数前添加一个可见性修饰符 public private protected 或者 readonly 来创建参数属性，最后这些类属性字段也会得到这些修饰符：`

**之后我们 look 一下 flutter,太像**

```ts
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {
    // No body necessary
  }
}
const a = new Params(1, 2, 3);
console.log(a.x);

// (property) Params.x: number
console.log(a.z);
// Property 'z' is private and only accessible within class 'Params'.
```

## Class Expressions

`类表达式`

Background Reading:
`背景阅读：`
[Class expressions (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class)

Class expressions are very similar to class declarations. The only real difference is that class expressions don’t need a name, though we can refer to them via whatever identifier they ended up bound to:
`类表达式跟类声明非常类似，唯一不同的是类表达式不需要一个名字，尽管我们可以通过绑定的标识符进行引用：`

```ts
const someClass = class<Type> {
  content: Type;
  constructor(value: Type) {
    this.content = value;
  }
};

const m = new someClass("Hello, world");

// const m: someClass<string>;
```

### abstract Classes and Members

`抽象类和成员`
Classes, methods, and fields in TypeScript may be abstract.
`TypeScript 中，类、方法、字段都可以是抽象的（abstract）。`
An abstract method or abstract field is one that hasn’t had an implementation provided. These members must exist inside an abstract class, which cannot be directly instantiated.
`抽象方法或者抽象字段是不提供实现的。这些成员必须存在在一个抽象类中，这个抽象类也不能直接被实例化。`
The role of abstract classes is to serve as a base class for subclasses which do implement all the abstract members. When a class doesn’t have any abstract members, it is said to be concrete.
`抽象类的作用是作为子类的基类，让子类实现所有的抽象成员。当一个类没有任何抽象成员，他就会被认为是具体的（concrete）。`
Let’s look at an example:
`让我们看个例子：`

```ts
abstract class Base {
  abstract getName(): string;

  printName() {
    console.log("Hello, " + this.getName());
  }
}

const b = new Base();
// Cannot create an instance of an abstract class.
```

We can’t instantiate Base with new because it’s abstract. Instead, we need to make a derived class and implement the abstract members:
`我们不能使用 new 实例 Base 因为它是抽象类。我们需要写一个派生类，并且实现抽象成员。`

```ts
class Derived extends Base {
  getName() {
    return "world";
  }
}

const d = new Derived();
d.printName();
```

Notice that if we forget to implement the base class’s abstract members, we’ll get an error:
`注意，如果我们忘记实现基类的抽象成员，我们会得到一个报错：`

```ts
class Derived extends Base {
  // Non-abstract class 'Derived' does not implement inherited abstract member 'getName' from class 'Base'.
  // forgot to do anything
}
```

## Abstract Construct Signatures

`抽象构造签名`

Sometimes you want to accept some class constructor function that produces an instance of a class which derives from some abstract class.
`有的时候，你希望接受传入可以继承一些抽象类产生一个类的实例的类构造函数。`
For example, you might want to write this code:
`举个例子，你也许会写这样的代码：`

```ts
function greet(ctor: typeof Base) {
  const instance = new ctor();
  // Cannot create an instance of an abstract class.
  instance.printName();
}
```

TypeScript is correctly telling you that you’re trying to instantiate an abstract class. After all, given the definition of greet, it’s perfectly legal to write this code, which would end up constructing an abstract class:
`TypeScript 会报错，告诉你正在尝试实例化一个抽象类。毕竟，根据 greet 的定义，这段代码应该是合法的：`

```ts
// Bad!
greet(Base);
```

Instead, you want to write a function that accepts something with a construct signature:
`但如果你写一个函数接受传入一个构造签名：`

```ts
function greet(ctor: new () => Base) {
  const instance = new ctor();
  instance.printName();
}
greet(Derived);
greet(Base);
// Argument of type 'typeof Base' is not assignable to parameter of type 'new () => Base'.
// 参数类型 'typeof Base' 不能赋值给参数类型 'new () => Base'。
// Cannot assign an abstract constructor type to a non-abstract constructor type.
// 不能将一个抽象构造类型赋值给一个非抽象构造类型。
```

Now TypeScript correctly tells you about which class constructor functions can be invoked - Derived can because it’s concrete, but Base cannot.
`现在 TypeScript 会正确的告诉你，哪一个类构造函数可以被调用，Derived 可以，因为它是具体的，而 Base 是不能的。`

## Relationships Between Classes

`类之间的关系`
In most cases, classes in TypeScript are compared structurally, the same as other types.
`大部分时候，TypeScript 的类跟其他类型一样，会被结构性比较。`
For example, these two classes can be used in place of each other because they’re identical:
`举个例子，这两个类可以用于替代彼此，因为它们结构是相等的：`

```ts
class Point1 {
  x = 0;
  y = 0;
}

class Point2 {
  x = 0;
  y = 0;
}

// OK
const p: Point1 = new Point2();
```

Similarly, subtype relationships between classes exist even if there’s no explicit inheritance:
`类似的还有，类的子类型之间可以建立关系，即使没有明显的继承：`

```ts
class Person {
  name: string;
  age: number;
}

class Employee {
  name: string;
  age: number;
  salary: number;
}

// OK
const p: Person = new Employee();
```

This sounds straightforward, but there are a few cases that seem stranger than others.
`这听起来有些简单，但还有一些例子可以看出奇怪的地方。`

Empty classes have no members. In a structural type system, a type with no members is generally a supertype of anything else. So if you write an empty class (don’t!), anything can be used in place of it:

`空类没有任何成员。在一个结构化类型系统中，没有成员的类型通常是任何其他类型的父类型。所以如果你写一个空类（只是举例，你可不要这样做），任何东西都可以用来替换它：`

```ts
class Empty {}

function fn(x: Empty) {
  // can't do anything with 'x', so I won't
}

// All OK!
fn(window);
fn({});
fn(fn);
```
