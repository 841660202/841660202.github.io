---
title: react-router v6.4.0 主要概念
date: 2022-06-21 09:06:50
categories: react
tags: [react]
cover:
---

## 官网

<a href="https://reactrouter.com/" target="_blank" >React Router v6 is Here</a>

> React Router v6 在客户端路由十年的基础上，采用了以前版本及其姐妹项目 Reach Router 的最佳功能，采用了迄今为止最小和最强大的软件包。

:::tip
或许某一天，再见时，已不是 v6
:::

官网分为两块内容 <a href="https://reactrouter.com/docs/en/v6/getting-started/concepts#main-concepts" target="_blank" >核心概念</a> <a href="https://reactrouter.com/docs/en/v6/getting-started/tutorial" target="_blank" >实践指导</a>,本章内容主要是**主要概念**

You might be wondering what exactly React Router does. How can it help you build your app? What exactly is a router, anyway?
_你可能会感到困惑，什么是路由？如何构建你的应用？什么是一个路由？。。。_
If you've ever had any of these questions, or you'd just like to dig into the fundamental pieces of routing, you're in the right place. This document contains detailed explanations of all the core concepts behind routing as implemented in React Router.
_如果你有过这些问题，或者你想要深入了解路由的核心概念，你就在正确的位置了。本文档包含了 React Router 的实现中所有核心概念的详细解释。_

Please don't let this document overwhelm you! For everyday use, React Router is pretty simple. You don't need to go this deep to use it.
_请不要让这份文档击败你！对于每日使用，React Router 是非常简单的。你不需要去深入到这里来使用它。_

React Router isn't just about matching a url to a function or component: it's about building a full user interface that maps to the URL, so it might have more concepts in it than you're used to. We'll go into detail on the three main jobs of React Router:
_React Router 不仅仅是匹配一个 url 到一个函数或组件：它是构建一个完整的用户界面，它可能有更多概念在里面，你可能不会感到。我们将从三个主要的工作中去解释 React Router：_

1. Subscribing and manipulating the history stack _订阅和操作历史堆栈_
2. Matching the URL to your routes _匹配 URL 到你的路由_
3. Rendering a nested UI from the route matches _在路由匹配中渲染嵌套的 UI_

## Definitions

_定义_

But first, some definitions! There are a lot of different ideas around routing from back and front end frameworks. Sometimes a word in one context might have different meaning than another.
_首先，有一些定义！有很多不同的理念在路由的后端和前端框架。有时一个单词在一个上下文中可能有不同的意思。_

Here are some words we use a lot when we talk about React Router. The rest of this guide will go into more detail on each one.
_这里有一些我们经常使用的词汇，React Router 的其他部分将会以每个词汇为题来讲述。_

**URL** - The URL in the address bar. A lot of people use the term "URL" and "route" interchangeably, but this is not a route in React Router, it's just a URL.
_**URL** - 地址栏中的 URL。很多人使用“URL”和“路由”可交换使用，但这不是 React Router 的路由，它只是一个 URL。_

**Location** - This is a React Router specific object that is based on the built-in browser's window.location object. It represents "where the user is at". It's mostly an object representation of the URL but has a bit more to it than that.
_**位置**- 这是一个基于浏览器的 window.location 对象的`React Router`特定对象。它表示“用户在哪里”。它主要是一个对 URL 的对象表示，但有更多的事情。_

**Location State** - A value that persists with a location that isn't encoded in the URL. Much like hash or search params (data encoded in the URL), but stored invisibly in the browser's memory.
_**位置状态** - 一个值，在不在 URL 中编码的位置保持。类似于哈希或搜索参数（在 URL 中编码的数据），但存储在浏览器的内存中。_

**History Stack** - As the user navigates, the browser keeps track of each location in a stack. If you click and hold the back button in a browser you can see the browser's history stack right there.
_**历史堆栈** - 当用户导航时，浏览器会记录每个位置在一个堆栈中。如果你点击并保持后退按钮在浏览器，你可以看到浏览器的历史堆栈在那里。_

**Client Side Routing (CSR)** - A plain HTML document can link to other documents and the browser handles the history stack itself. Client Side Routing enables developers to manipulate the browser history stack without making a document request to the server.
_**客户端端路由 (CSR)** - 只需要一个 HTML 文档，可以链接到其他文档，浏览器会自己处理历史堆栈。客户端端路由使开发人员能够操作浏览器历史堆栈，而不需要请求文档。_

**History** - An object that allows React Router to subscribe to changes in the URL as well as providing APIs to manipulate the browser history stack programmatically.
_**历史** - 一个对象，允许 React Router 订阅 URL 的变化，同时提供一个 API，用于手动操作浏览器历史堆栈。_

**History Action** - One of POP, PUSH, or REPLACE. Users can arrive at a URL for one of these three reasons. A push when a new entry is added to the history stack (typically a link click or the programmer forced a navigation). A replace is similar except it replaces the current entry on the stack instead of pushing a new one. Finally, a pop happens when the user clicks the back or forward buttons in the browser chrome.
_**历史动作** - POP、PUSH 或 REPLACE 之一。用户可以到达这三个原因的 URL。一个 push 当添加一个新条目到历史堆栈时（通常是链接点击或程序员强制导航）。一个 replace 类似，但它替换当前条目而不是添加一个新的。最后，一个 pop 发生在用户点击浏览器窗口的后退或前进按钮。_

**Segment** - The parts of a URL or path pattern between the / characters. For example, "/users/123" has two segments.
_**分段** - URL 或路径模式中的 / 字符之间的部分。例如，"/users/123" 有两个分段。_

**Path Pattern** - These look like URLs but can have special characters for matching URLs to routes, like dynamic segments ("/users/:userId") or star segments ("/docs/\*"). They aren't URLs, they're patterns that React Router will match.
_**路径模式** - 这样看起来像 URL，但它们可以包含特殊字符来匹配 URL 到路由，例如动态分段 ("/users/:userId") 或星号分段 ("/docs/\*")。它们不是 URL，它们是 React Router 将匹配的模式。_

**Dynamic Segment** - A segment of a path pattern that is dynamic, meaning it can match any values in the segment. For example the pattern /users/:userId will match URLs like /users/123
_**动态分段** - 路径模式中的一个分段，它可以匹配分段中的任何值。例如，路径模式 /users/:userId 将匹配 URL 类似 /users/123_

**URL Params** - The parsed values from the URL that matched a dynamic segment.
_**URL 参数** - 从 URL 中解析出的值。_

**Router** - Stateful, top-level component that makes all the other components and hooks work.
_**路由** - 一个状态为组件，用于让所有其他组件和钩子工作。_

**Route Config** - A tree of routes objects that will be ranked and matched (with nesting) against the current location to create a branch of route matches.
_**路由配置** - 一个路由对象的树，将会排序和匹配（包含嵌套）与当前位置来创建一个路由匹配的分支。_

**Route** - An object or Route Element typically with a shape of { path, element } or <Route path element>. The path is a path pattern. When the path pattern matches the current URL, the element will be rendered.
_**路由** - 一个对象或路由元素通常是 { path, element } 或 <Route path element>。路径是路径模式。当路径模式与当前 URL 匹配时，将会渲染该元素。_

**Route Element** - Or <Route>. This element's props are read to create a route by <Routes>, but otherwise does nothing.
_**路由元素** - 或 <Route>。这个元素的 props 被读取来创建一个路由，但是不做任何事情。_

**Nested Routes** - Because routes can have children and each route defines a portion of the URL through segments, a single URL can match multiple routes in a nested "branch" of the tree. This enables automatic layout nesting through outlet, relative links, and more.
_**嵌套路由** - 因为路由可以有子路由，每个路由都定义一部分 URL 的路径段，一个 URL 可以匹配多个路由在树的嵌套 "分支" 中。这使得通过 outlet、相对链接和更多的功能来实现布局嵌套。_

**Relative links** - Links that don't start with / will inherit the closest route in which they are rendered. This makes it easy to link to deeper URLs without having to know and build up the entire path.
_**相对链接** - 不以 / 开头的链接会继承最近渲染的路由。这使得它很容易链接到更深的 URL，而不需要知道和建立整个路径。_

**Match** - An object that holds information when a route matches the URL, like the url params and pathname that matched.
_**匹配** - 当路由匹配 URL 时，匹配信息会保存在这个对象中，例如匹配的 URL 参数和路径名。_

**Matches** - An array of routes (or branch of the route config) that matches the current location. This structure enables nested routes.
_**匹配** - 当前位置匹配的路由（或路由配置的分支）的数组。这个结构可以嵌套路由。_

**Parent Route** - A route with child routes.
_**父路由** - 有子路由的路由。_

**Outlet** - A component that renders the next match in a set of matches.**啥玩意？**
_**出口** - 一个组件，它渲染一组匹配中的下一个匹配。_

**Index Route** - A child route with no path that renders in the parent's outlet at the parent's URL.
_**首页路由** - 一个子路由，没有路径，它渲染在父路由的出口，在父路由的 URL 中。_

**Layout Route** - A parent route without a path, used exclusively for grouping child routes inside a specific layout.
_**布局路由** - 一个没有路径的父路由，用于将子路由分组在特定布局中。_

## History and Locations

Before React Router can do anything, it has to be able to subscribe to changes in the browser history stack.
_在 React Router 可以做任何事情之前，它需要能够订阅浏览器历史堆栈的变化。_

Browsers maintain their own history stack as the user navigates around. That's how the back and forward buttons can work. In a traditional website (HTML documents without JavaScript) the browser will make requests to the server every time the user clicks a link, submits a form, or clicks the back and forward buttons.
_在一个纯粹的网站（没有 JavaScript 的 HTML 文档）中，浏览器会每次点击链接、提交表单或点击后退和前进按钮时，都会向服务器发送请求。_

For example, consider the user:
_例如，考虑用户：_

1. clicks a link to /dashboard
2. clicks a link to /accounts
3. clicks a link to /customers/123
4. clicks the back button
5. clicks a link to /dashboard

The history stack will change as follows where bold entries denote the current URL:
_如下的地方历史堆栈将改变，加粗的条目表示当前 URL：_

1. **/dashboard**
2. /dashboard, **/accounts**
3. /dashboard, /accounts**, /customers/123**
4. /dashboard, **/accounts**, /customers/123
5. /dashboard, /accounts, **/dashboard**

### History Object

With client side routing, developers are able to manipulate the browser history stack programmatically. For example, we can write some code like this to change the URL without the browsers default behavior of making a request to the server:
_使用客户端路由，开发人员可以通过编程方式改变浏览器历史堆栈，例如，我们可以这样写，改变 URL，而不会执行浏览器的默认行为，即向服务器发送请求：_

```js
<a
  href="/contact"
  onClick={(event) => {
    // stop the browser from changing the URL and requesting the new document
    // 阻止浏览器改变 URL 并请求新文档
    event.preventDefault();
    // push an entry into the browser history stack and change the URL
    // 将一个条目推入浏览器历史堆栈并改变 URL
    window.history.pushState({}, undefined, "/contact");
  }}
/>
```

:::warning
For illustration only, don't use window.history.pushState directly in React Router
_仅供参考，不要使用 window.history.pushState 直接在 React Router 中使用_
:::

This code changes the URL but doesn't do anything for the UI. We would need to write some more code that changed some state somewhere to get the UI to change to the contact page. The trouble is, the browser doesn't give us a way to "listen to the URL" and subscribe to changes like this.
_这段代码改变 URL 但不会对 UI 有任何影响。我们需要写一些代码，改变某些状态，使 UI 变为联系页面。问题是，浏览器没有提供这样的方式，“监听 URL”，订阅变化。_

Well, that's not totally true. We can listen for changes to the URL via pop events:
_这不是完全正确的。我们可以监听 URL 变化的事件，通过弹出事件：_

```js
window.addEventListener("popstate", () => {
  // URL changed!
});
```

But that only fires when the user clicks the back or forward buttons. There is no event for when the programmer called window.history.pushState or window.history.replaceState.
_但是，只有当用户点击后退或前进按钮时，才会触发这个事件。没有调用 window.history.pushState 或 window.history.replaceState 的事件。_
That's where a React Router specific history object comes into play. It provides a way to "listen for URL" changes whether the history action is push, pop, or replace.
_这里是 React Router 特定的历史对象的事件。它提供一种方式，“监听 URL”变化，无论历史操作是 push、pop 或 replace。_

```js
let history = createBrowserHistory();
history.listen(({ location, action }) => {
  // this is called whenever new locations come in
  // the action is POP, PUSH, or REPLACE
});
```

Apps don't need to set up their own history objects--that's job of <Router>. It sets up one of these objects, subscribe to changes in the history stack, and finally updates its state when the URL changes. This causes the app to re-render and the correct UI to display. The only thing it needs to put on state is a location, everything else works from that single object.
_应用不需要设置自己的历史对象，这是 `<Router>` 的工作。它设置一个这样的对象，订阅历史堆栈的变化，并且最终更新它的状态，当 URL 变化时。这会导致应用重新渲染并显示正确的 UI。它只需要把状态放在状态中，其他都可以从这个单一对象中获取。_

### Locations

The browser has a location object on window.location. It tells you information about the URL but also has some methods to change it:
_浏览器有一个 location 对象在 window.location 上。它告诉你关于 URL 的信息，但也有一些方法可以改变它：_

```js
window.location.pathname; // /getting-started/concepts/
window.location.hash; // #location
window.location.reload(); // force a refresh w/ the server
// and a lot more
```

:::warning
For illustration. You don't typically work with window.location in a React Router app
_在 React Router 应用中通常不使用 window.location_
:::

Instead of using window.location, React Router has the concept of a location that's patterned after window.location but is much simpler. It looks like this:
_而不是使用 window.location，React Router 有一个像 window.location 一样的`location`，但更简单。它看起来像这样：_

```json
{
  "pathname": "/bbq/pig-pickins",
  "search": "?campaign=instagram",
  "hash": "#menu",
  "state": null,
  "key": "aefz24ie"
}
```

The first three: { pathname, search, hash } are exactly like window.location. If you just add up the three you'll get the URL the user sees in the browser:
_前三个：{ pathname, search, hash } 相当于 window.location。如果把三个加起来就等于用户在浏览器中看到的 URL：_

```js
location.pathname + location.search + location.hash;
// /bbq/pig-pickins?campaign=instagram#menu
```

The last two, { state, key }, are React Router specific.
_最后两个，{ state, key }，是 React Router 特定的。_

**Location Pathname**

This is the part of URL after the origin, so for https://example.com/teams/hotspurs the pathname is /teams/hotspurs. This is the only part of the location that routes match against.
_这是 URL 的部分，在 origin 之后，所以 https://example.com/teams/hotspurs 的 pathname 是 /teams/hotspurs。这是 location 的唯一部分，它匹配路由。_

**Location Search**

People use a lot of different terms for this part of the URL:
_人们使用很多不同的词来表达这部分 URL：_

- location search
- search params
- URL search params
- query string

In React Router we call it the "location search". However, location search is a serialized version of URLSearchParams. So sometimes we might call it "URL search params" as well.
_在 React Router 中我们称它为 "location search"。但是，location search 是一个序列化的 URLSearchParams 的版本。所以有时候我们可能称它 "URL search params"。_

```js
// given a location like this:
let location = {
  pathname: "/bbq/pig-pickins",
  search: "?campaign=instagram&popular=true",
  hash: "",
  state: null,
  key: "aefz24ie",
};

// we can turn the location.search into URLSearchParams
// 我们可以把 location.search 转换成 URLSearchParams
let params = new URLSearchParams(location.search);
params.get("campaign"); // "instagram"
params.get("popular"); // "true"
params.toString(); // "campaign=instagram&popular=true",
```

When being precise, refer to the serialized string version as "search" and the parsed version as "search params", but it's common to use the terms interchangeably when precision isn't important.
_当精确时，参考序列化的字符串版本为 "search"，解析版本为 "search params"，但是通常使用时可以使用交换的词来表达。_

**Location Hash**

Hashes in URLs indicate a scroll position on the current page. Before the window.history.pushState API was introduced, web developers did client side routing exclusively with the hash portion of the URL, it was the only part we could manipulate without making a new request to the server. However, today we can use it for its designed purpose.
_URL 中的 hash 可以表示当前页面的滚动位置。在 window.history.pushState API 尚未引入前，web 开发者只能在 URL 中的 hash 部分进行客户端路由，它是我们只能在不需要请求服务器的情况下操作它。但是，现在我们可以用它来实现它的提供的功能。_

**Location State**

You may have wondered why the window.history.pushState() API is called "push state". State? Aren't we just changing the URL? Shouldn't it be history.push? Well, we weren't in the room when the API was designed, so we're not sure why "state" was the focus, but it is a cool feature of browsers nonetheless.
_你可能会问为什么 window.history.pushState() API 被称为 "push state"。状态？我们不是改变 URL 吗？应该不是 history.push？我们不是在房间里面，所以我们不知道为什么 "state" 是焦点，但是它是浏览器的一个酷功能。_
Browsers let us persist information about a transition by passing a value to pushState. When the user clicks back, the value on history.state changes to whatever was "pushed" before.
_浏览器让我们保持一个过渡的信息，通过传递一个值来 pushState。当用户点击后，history.state 将变成什么时候 "pushed"。_

```javaScript

window.history.pushState("look ma!", undefined, "/contact");
window.history.state; // "look ma!"
// user clicks back
window.history.state; // undefined
// user clicks forward
window.history.state; // "look ma!"


```

:::warning
For illustration. You don't read history.state directly in React Router apps
_为了演示。你不要直接读取 history.state 在 React Router 应用中。_
:::

React Router takes advantage of this browser feature, abstracts it a bit, and surfaces the values on the location instead of history.
_React Router 利用这个浏览器功能，抽象它点，而不是把值放在 history 上。_

You can think about location.state just like location.hash or location.search except instead of putting the values in the URL it's hidden--like a super secret piece of the URL only the programmer knows about.
_你可以想象 location.state 像 location.hash 或 location.search，只不过它放在 URL 中是隐藏的--只有程序员知道的秘密。_

A couple of great use-cases for location state are:
_一些好的使用场景是 location state：_

Telling the next page where the user came from and branching the UI. The most popular implementation here is showing a record in a modal if the user clicked on an item in a grid view, but if they show up to the URL directly, show the record in its own layout (pinterest, old instagram).
_如果用户点击一个 item 在 grid 视图，那么我们可以在 modal 中显示记录，但如果用户直接访问 URL，那么我们可以在它的自己的布局中显示记录（pinterest，旧 instagram）。_

Sending a partial record from a list to the next screen so it can render the partial data immediately and then fetching the rest of the data afterward.
_从列表发送一个部分记录到下一个屏幕，以便它可以立即渲染部分数据，然后再次获取其余的数据。_

You set location state in two ways: on <Link> or navigate:
_你可以在 <Link> 或 navigate 中设置 location state：_

```js
<Link to="/pins/123" state={{ fromDashboard: true }} />;

let navigate = useNavigate();
navigate("/users/123", { state: partialUser });
```

And on the next page you can access it with useLocation:
_在下一个页面中，你可以使用 useLocation 来访问它：_

```javaScript
let location = useLocation();
location.state;
```

Location state values will get serialized, so something like new Date() will be turned into a string.
_Location state 值将会被序列化，所以 something like new Date() 将会被转换成字符串。_

**Location Key**

Each location gets a unique key. This is useful for advanced cases like location-based scroll management, client side data caching, and more. Because each new location gets a unique key, you can build abstractions that store information in a plain object, new Map(), or even locationStorage.
_每个 location 可以获得一个唯一的 key。这是一个高级的情况，比如 location-based scroll management，客户端数据缓存，以及更多。因为每个新的 location 可以获得一个唯一的 key，所以你可以把信息存储在一个普通对象，new Map()，或者 locationStorage。_

For example, a very basic client side data cache could store values by location key (and the fetch URL) and skip fetching the data when the user clicks back into it:
_例如，一个非常基础的客户端数据缓存可以通过 location key（和 fetch URL）来存储值，并且当用户点击回到它时跳过 fetch 数据：_

```js
let cache = new Map();

function useFakeFetch(URL) {
  let location = useLocation();
  let cacheKey = location.key + URL;
  let cached = cache.get(cacheKey);

  let [data, setData] = useState(() => {
    // initialize from the cache
    return cached || null;
  });

  let [state, setState] = useState(() => {
    // avoid the fetch if cached
    return cached ? "done" : "loading";
  });

  useEffect(() => {
    if (state === "loading") {
      let controller = new AbortController();
      fetch(URL, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          if (controller.signal.aborted) return;
          // set the cache
          cache.set(cacheKey, data);
          setData(data);
        });
      return () => controller.abort();
    }
  }, [state, cacheKey]);

  useEffect(() => {
    setState("loading");
  }, [URL]);

  return data;
}
```

## Matching

On the initial render, and when the history stack changes, React Router will match the location against your route config to come up with a set of matches to render.
_在初始渲染和当 history stack 变化时，React Router 将会匹配 location 与你的路由配置来得到一组匹配来渲染。_

### Defining Routes

A route config is a tree of routes that looks something like this:
_一个路由配置是一个树状结构，比如这样：_

```js
<Routes>
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="teams" element={<Teams />}>
      <Route path=":teamId" element={<Team />} />
      <Route path=":teamId/edit" element={<EditTeam />} />
      <Route path="new" element={<NewTeamForm />} />
      <Route index element={<LeagueStandings />} />
    </Route>
  </Route>
  <Route element={<PageLayout />}>
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/tos" element={<Tos />} />
  </Route>
  <Route path="contact-us" element={<Contact />} />
</Routes>
```

The `<Routes>` component recurses through its props.children, strips their props, and generates an object like this:
_<Routes> 组件递归遍历其 props.children，并且生成一个像这样的对象：_

```js
let routes = [
  {
    element: <App />,
    path: "/",
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "teams",
        element: <Teams />,
        children: [
          {
            index: true,
            element: <LeagueStandings />,
          },
          {
            path: ":teamId",
            element: <Team />,
          },
          {
            path: ":teamId/edit",
            element: <EditTeam />,
          },
          {
            path: "new",
            element: <NewTeamForm />,
          },
        ],
      },
    ],
  },
  {
    element: <PageLayout />,
    children: [
      {
        element: <Privacy />,
        path: "/privacy",
      },
      {
        element: <Tos />,
        path: "/tos",
      },
    ],
  },
  {
    element: <Contact />,
    path: "/contact-us",
  },
];
```

In fact, instead of <Routes> you can use the hook useRoutes(routesGoHere) instead. That's all <Routes> is doing.
_在实际上，<Routes> 的作用是，把 routesGoHere 传递给 useRoutes。_

As you can see, routes can define multiple segments like :teamId/edit, or just one like :teamId. All of the segments down a branch of the route config are added together to create a final path pattern for a route.
_你可以看到，路由可以定义多个分段，比如 :teamId/edit，或者只有一个 :teamId。所有从路由配置的分支下面的分段都会组合在一起，来创建一个最终的路径模式。_

### Match Params

Note the :teamId segments. This is what we call a dynamic segment of the path pattern, meaning it doesn't match the URL statically (the actual characters) but it matches it dynamically. Any value can fill in for :teamId. Both /teams/123 or /teams/cupcakes will match. We call the parsed values URL params. So in this case our teamId param would be "123" or "cupcakes". We'll see how to use them in your app in the Rendering section.
_注意，这里有 :teamId 分段。这是一个动态分段，意味着它不是静态的，而是动态的。任何值都可以填充 :teamId。/teams/123 或 /teams/cupcakes 均可匹配。我们称这些解析后的值为 URL 参数。所以，在这种情况下，我们的 teamId 参数将是 "123" 或 "cupcakes"。我们会在渲染部分看到如何使用它们。_

### Ranking Routes

If we add up all the segments of all the branches of our route config, we end up with the following path patterns that our app responds to:
_如果我们把所有路由配置的分支的所有分段相加，我们就会得到以下路径模式，我们的应用程序会响应：_

```js
[
  "/",
  "/teams",
  "/teams/:teamId",
  "/teams/:teamId/edit",
  "/teams/new",
  "/privacy",
  "/tos",
  "/contact-us",
];
```

Now this is where things get really interesting. Consider the URL /teams/new. Which pattern in that list matches the URL?
_考虑一下这个 URL /teams/new，它在那个列表中匹配哪个模式？_
That's right, two of them!
_对的，两个！_

```
/teams/new
/teams/:teamId
```

React Router has to make a decision here, there can be only one. Many routers, both client side and server side, will simply process the patterns in the order in which they were defined. First to match wins. In this case we would match / and render the <Home/> component. Definitely not what we wanted. These kinds of routers require us to order our routes perfectly to get the expected result. This is how React Router has worked up until v6, but now it's much smarter.
_React Router 在这里需要做一个决定，只有一个路由器，客户端和服务器端都会简单地处理模式。第一个匹配的优先。在这种情况下，我们会匹配 / 并呈现 <Home/> 组件。这不是我们想要的。这种类型的路由器需要我们按照定义的顺序来排列路由，以便得到预期的结果。这是 React Router 的 v6 前的工作，现在它更加智能。_

Looking at those patterns, you intuitively know that we want /teams/new to match the URL /teams/new. It's a perfect match! React Router also knows that. When matching, it will rank your routes according the number of segments, static segments, dynamic segments, star patterns, etc. and pick the most specific match. You'll never have to think about ordering your routes.
_看这些模式，你感觉到我们想要 /teams/new 匹配 URL /teams/new。这是一个完美的匹配！React Router 也知道。当匹配时，它会按照分段数，静态分段，动态分段，星号模式，等等来排列路由，并选择最有用的匹配。你永远不会必须想象路由的顺序。_

### Pathless Routes

You may have noticed the weird routes from earlier:
_你可能注意到以前的奇怪路由：_

```js
<Route index element={<Home />} />
<Route index element={<LeagueStandings />} />
<Route element={<PageLayout />} />
```

They don't even have a path, how can they be a route? This is where the word "route" in React Router is used pretty loosely. `<Home/>` and `<LeagueStandings/>` are <a href="https://reactrouter.com/docs/en/v6/getting-started/concepts#index-route" target="_blank" >index routes</a> and `<PageLayout/>` is a <a href="https://reactrouter.com/docs/en/v6/getting-started/concepts#layout-route" target="_blank" >layout route</a>. We'll discuss how they work in the Rendering section. Neither really has much to do with matching.
_它们也没有路径，怎么可能是路由？这是 React Router 中的“路由”词的使用很模糊。<Home/> 和 <LeagueStandings/> 是索引路由，<PageLayout/> 是布局路由。我们会在渲染部分讨论如何使用它们。<Home/> 和 <LeagueStandings/> 不是真正的路由，<PageLayout/> 是真正的路由。_

### Route Matches

When a route matches the URL, it's represented by a <a href="https://reactrouter.com/docs/en/v6/getting-started/concepts#match" target="_blank" >match</a> object. A match for `<Route path=":teamId" element={<Team/>}/>` would look something like this:

```js
{
  pathname: "/teams/firebirds",
  params: {
    teamId: "firebirds"
  },
  route: {
    element: <Team />,
    path: ":teamId"
  }
}
```

pathname holds the portion of the URL that matched this route (in our case it's all of it). params holds the parsed values from any dynamic segments that matched. Note that the param's object keys map directly to the name of the segment: :teamId becomes params.teamId.
_match.pathname 存放匹配到的 URL 的部分（在我们的例子中它是全部）。params 存放从任何动态分段匹配的解析值。注意，参数的对象键映射到动态分段的名称：:teamId 变成 params.teamId。_
Because our routes are a tree, a single URL can match an entire branch of the tree. Consider the URL /teams/firebirds, it would be the following route branch:
_因为我们的路由是一棵树，一个 URL 可以匹配整个树的一个分支。考虑 URL /teams/firebirds，它将是以下路由分支：_

```js
<Routes>
  <Route path="/" element={<App />}>
    <Route index element={<Home />} /> // +
    <Route path="teams" element={<Teams />}>
      {" "}
      //+
      <Route path=":teamId" element={<Team />} /> //+
      <Route path=":teamId/edit" element={<EditTeam />} />
      <Route path="new" element={<NewTeamForm />} />
      <Route index element={<LeagueStandings />} />
    </Route>
  </Route>
  <Route element={<PageLayout />}>
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/tos" element={<Tos />} />
  </Route>
  <Route path="contact-us" element={<Contact />} />
</Routes>
```

React Router will create an array of matches from these routes and the url so it can render a nested UI that matches the route nesting.
_React Router 将从这些路由创建一个匹配数组，并将 url 传递给它，以便它可以渲染一个嵌套的 UI，匹配路由嵌套。_

```js
[
  {
    pathname: "/",
    params: null,
    route: {
      element: <App />,
      path: "/",
    },
  },
  {
    pathname: "/teams",
    params: null,
    route: {
      element: <Teams />,
      path: "teams",
    },
  },
  {
    pathname: "/teams/firebirds",
    params: {
      teamId: "firebirds",
    },
    route: {
      element: <Team />,
      path: ":teamId",
    },
  },
];
```

## Rendering

The final concept is rendering. Consider that the entry to your app looks like this:
_最后一个概念是渲染。考虑你的应用程序的入口如下：_

```js
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="teams" element={<Teams />}>
          <Route path=":teamId" element={<Team />} />
          <Route path="new" element={<NewTeamForm />} />
          <Route index element={<LeagueStandings />} />
        </Route>
      </Route>
      <Route element={<PageLayout />}>
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/tos" element={<Tos />} />
      </Route>
      <Route path="contact-us" element={<Contact />} />
    </Routes>
  </BrowserRouter>
);
```

Let's use the /teams/firebirds URL as an example again. <Routes> will match the location to your route config, get a set of matches, and then render a React element tree like this:
_使用 `/teams/firebirds` URL 作为一个例子，`<Routes>` 将匹配位置到你的路由配置，获取一组匹配，然后渲染一个 React 元素树，如下：_

```js
<App>
  <Teams>
    <Team />
  </Teams>
</App>
```

Each match rendered inside the parent route's element is a really powerful abstraction. Most websites and apps share this characteristic: boxes inside of boxes inside of boxes, each with a navigation section that changes a child section of the page.
_每个匹配在父路由的元素中都是一个非常强大的抽象。大多数网站和应用程序都共享这种特性：盒子里面盒子里面盒子，每个盒子都有一个导航区域，它改变页面的子区域。_

### Outlets

This nested element tree won't happen automatically. <Routes> will render the first match's element for you (In our case that's <App/>). The next match's element is <Teams>. In order to render that, App needs to render an outlet.
_这个嵌套元素树不会自动发生。`<Routes>` 将会渲染第一个匹配的元素（在我们的例子中是 `<App/>`）。下一个匹配的元素是 `<Teams>`。为了渲染这个，App 需要渲染一个出口。_

```js
function App() {
  return (
    <div>
      <GlobalNav />
      <Outlet />
      <GlobalFooter />
    </div>
  );
}
```

The Outlet component will always render the next match. That means <Teams> also needs an outlet to render <Team/>.
_Outlet 元素将始终渲染下一个匹配。这意味着 `<Teams>` 需要一个出口来渲染 `<Team/>`。_
If the URL were /contact-us, the element tree would change to:
_如果 URL 是 `/contact-us`，元素树会变成：_

```js
<App>
  <Teams>
    <EditTeam />
  </Teams>
</App>
```

The outlet swaps out the child for the new child that matches, but the parent layout persists. It's subtle but very effective at cleaning up your components.
_出口将交换子组件，但父布局仍然存在。它很巧妙，但十分有效地清理你的组件。_

### Index Routes

Remember the <a href="https://reactrouter.com/docs/en/v6/getting-started/concepts#route-config" target="_blank" >route config</a> for /teams:

```js
<Route path="teams" element={<Teams />}>
  <Route path=":teamId" element={<Team />} />
  <Route path="new" element={<NewTeamForm />} />
  <Route index element={<LeagueStandings />} />
</Route>
```

If the URL were `/teams/firebirds`, the element tree would be:
_如果 URL 是 `/teams/firebirds`，元素树会是：_

```js
<App>
  <Teams>
    <Team />
  </Teams>
</App>
```

But if the URL were `/teams`, the element tree would be:
_如果 URL 是 `/teams`，元素树会是：_

```js
<App>
  <Teams>
    <LeagueStandings />
  </Teams>
</App>
```

League standings? How the heck did `<Route index element={<LeagueStandings>}/>` pop in there? It doesn't even have a path! The reason is that it's an index route. Index routes render in their parent route's outlet at the parent route's path.
_排名？ 为什么 `<Route index element={<LeagueStandings>}/>` 不能出现在它的父路由的出口？ 它不是一个路径！ 原因是它是一个索引路由。 索引路由渲染在它的父路由的出口，在父路由的路径。_
Think of it this way, if you're not at one of the child routes' paths, the <Outlet> will render nothing in the UI:
_如果你不在子路由的路径上，`<Outlet>` 将不会渲染任何 UI：_

```js
<App>
  <Teams />
</App>
```

If all the teams are in a list on the left then an empty outlet means you've got a blank page on the right! Your UI needs something to fill the space: index routes to the rescue.
_如果所有成员都在左边的列表中，空的出口意味着你有一个空白页在右边！ 你的 UI 需要一些东西来填充空白：索引路由。_
Another way to think of an index route is that it's the default child route when the parent matches but none of its children do.
_另一种思考索引路由是，它是父路由匹配，但没有任何子路由的默认子路由。_
Depending on the user interface, you might not need an index route, but if there is any sort of persistent navigation in the parent route you'll most likely want index route to fill the space when the user hasn't clicked one of the items yet.
_根据用户界面，你可能不需要索引路由，但如果父路由有持久的导航，你将最有可能需要索引路由来填充空白，当用户还没有点击一个项目。_

### Layout Routes

Here's a part of our route config we haven't matched yet: `/privacy`. Let's look at the route config again, highlighting the matched routes:
_这里是我们还没有匹配的路由配置的一部分：`/privacy`。我们再看一下路由配置，高亮匹配的路由：_

```js
<Routes>
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="teams" element={<Teams />}>
      <Route path=":teamId" element={<Team />} />
      <Route path=":teamId/edit" element={<EditTeam />} />
      <Route path="new" element={<NewTeamForm />} />
      <Route index element={<LeagueStandings />} />
    </Route>
  </Route>
  <Route element={<PageLayout />}>
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/tos" element={<Tos />} />
  </Route>
  <Route path="contact-us" element={<Contact />} />
</Routes>
```

And the resulting element tree rendered will be:
_根据结果，渲染出来的元素树会是：_

```js
<App>
  <PageLayout>
    <Privacy />
  </PageLayout>
</App>
```

The `PageLayout` route is admittedly weird. We call it a <a href="https://reactrouter.com/docs/en/v6/getting-started/concepts#layout-route" target="_blank" >layout route</a> because it doesn't participate in the matching at all (though its children do). It only exists to make wrapping multiple child routes in the same layout simpler. If we didn't allow this then you'd have to handle layouts in two different ways: sometimes your routes do it for you, sometimes you do it manually with lots of layout component repetition throughout your app:
_这个`PageLayout`路由是不友好的。 我们调用它是一个 <a href="https://reactrouter.com/docs/en/v6/getting-started/concepts#layout-route" target="_blank" >layout route</a>，因为它不参与匹配（但它的子路由却是）。 它只是为了让包裹多个子路由在一个布局上更加简单。 如果我们不允许这样做，那么你就需要在你的应用中手动处理布局，有时候你的路由会自动做这件事，有时候你需要手动处理布局，通过重复布局组件来实现：_

:::tip
You can do it like this, but we recommend using a layout route
_你可以这样做，但我们建议使用一个布局路由_
:::

```js
<Routes>
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="teams" element={<Teams />}>
      <Route path=":teamId" element={<Team />} />
      <Route path=":teamId/edit" element={<EditTeam />} />
      <Route path="new" element={<NewTeamForm />} />
      <Route index element={<LeagueStandings />} />
    </Route>
  </Route>
  <Route
    path="/privacy"
    element={
      <PageLayout>
        <Privacy />
      </PageLayout>
    }
  />
  <Route
    path="/tos"
    element={
      <PageLayout>
        <Tos />
      </PageLayout>
    }
  />
  <Route path="contact-us" element={<Contact />} />
</Routes>
```

So, yeah, the semantics of a layout "route" is a bit silly since it has nothing to do with the URL matching, but it's just too convenient to disallow.
_因此，嘿，布局“路由”的语义是一点点蛋疼，因为它没有什么关系到 URL 匹配，但它是太方便了。_

## Navigating

When the URL changes we call that a "navigation". There are two ways to navigate in React Router:
_在 URL 变化时调用这个方法“navigation”：有两种方式：_

- `<Link>`
- `navigate`

### Link

This is the primary means of navigation. Rendering a <Link> allows the user to change the URL when they click it. React Router will prevent the browser's default behavior and tell the history to push a new entry into the history stack. The location changes and the new matches will render.
_这是主要的导航方式，渲染一个<Link>允许用户点击它时变更 URL。 React Router 将阻止浏览器的默认行为，并告诉历史记录推入一个新条目到历史堆栈中。 地点变化了，新匹配的元素会渲染。_

However, links are accessible in that they:
_但是，链接是可访问的，它：_

Still render a `<a href>` so all default accessibility concerns are met (like keyboard, focusability, SEO, etc.)
_仍然渲染一个<a href>，这样所有默认的访问性问题都会被满足（如键盘，可聚焦性，SEO 等等）_

Don't prevent the browser's default behavior if it's a right click or command/control click to "open in new tab"
_如果是右键点击或命令/控制点击“在新标签页中打开”，那么不要阻止浏览器的默认行为_

<a href="https://reactrouter.com/docs/en/v6/getting-started/concepts#nested-routes" target="_blank" >Nested routes</a> aren't just about rendering layouts; they also enable "relative links". Consider our teams route from before:
_嵌套路由不仅仅是渲染布局，它也可以启用“相对链接”。 考虑我们的 teams 路由从前面：_

```js
<Route path="teams" element={<Teams />}>
  <Route path=":teamId" element={<Team />} />
</Route>
```

The <Teams> component can render links like:
_<Teams>组件可以渲染链接，如：_

```js
<Link to="psg" />
<Link to="new" />
```

The full path it links to will be `/teams/psg` and `/teams/new`. They inherit the route within which they are rendered. This makes it so your route components don't have to really know anything about the rest of the routes in the app. A very large amount of links just go one more segment deeper. You can rearrange your whole route config and these links will likely still work just fine. This is very valuable when building out a site in the beginning and the designs and layouts are shifting around.
_它们链接到的完整路径是 `/teams/psg` 和 `/teams/new`。 它们继承渲染时的路由。 这使得你的路由组件不需要真的知道应用中的其他路由。 一大堆链接只需要一个更深一层。 你可以重新排列你的整个路由配置，这些链接可能仍然能工作。 这在开始建站时非常有用，因为设计和布局会移动。_

### Navigate Function

This function is returned from the useNavigate hook and allows you, the programmer, to change the URL whenever you want. You could do it on a timeout:
_这个函数是由 useNavigate 钩子返回的，允许你，程序员，在你想要的时候改变 URL。 你可以做一个延迟：_

```js
let navigate = useNavigate();
useEffect(() => {
  setTimeout(() => {
    navigate("/logout");
  }, 30000);
}, []);
```

Or after a form is submitted:
_或者，在表单提交后：_

```js
<form onSubmit={event => {
  event.preventDefault();
  let data = new FormData(event.target)
  let urlEncoded = new URLSearchParams(data)
  navigate("/create", { state: urlEncoded })
}}>

```

Like `Link`, `navigate` works with nested "to" values as well.
_像 Link 一样，navigate 也可以用嵌套的“to”值。_

```js
navigate("psg");
```

You should have a good reason to use navigate instead of <Link>. This makes us very sad:
_你应该有一个好的理由使用 navigate 而不是 <Link>。 这使我们很伤心：_

```js
<li onClick={() => navigate("/somewhere")} />
```

Aside from links and forms, very few interactions should change the URL because it introduces complexity around accessibility and user expectations.
_除了链接和表单之外，很少应该改变 URL，因为它会引入一些关于访问性和用户期望的复杂性。_

### Data Access

Finally, an application is going to want to ask React Router for a few pieces of information in order to build out the full UI. For this, React Router has a pile of hooks
_最后，应用程序需要要求 React 路由来获取一些信息，以便建立完整的 UI。_

```js
let location = useLocation();
let urlParams = useParams();
let [urlSearchParams] = useSearchParams();
```

## Review

Let's put it all together from the top!
_从顶部一起来看！_

1. You render your app:

```js
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="teams" element={<Teams />}>
          <Route path=":teamId" element={<Team />} />
          <Route path="new" element={<NewTeamForm />} />
          <Route index element={<LeagueStandings />} />
        </Route>
      </Route>
      <Route element={<PageLayout />}>
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/tos" element={<Tos />} />
      </Route>
      <Route path="contact-us" element={<Contact />} />
    </Routes>
  </BrowserRouter>
);
```

`<BrowserRouter>` creates a history, puts the initial location in to state, and subscribes to the URL.
_`<BrowserRouter>` 创建一个历史，将初始位置放入状态，并订阅 URL。_

`<Routes>` recurses its child routes to build a route config, matches those routes against the location, creates some route matches, and renders the first match's route element.
_`<Routes>` 递归子路由来建立路由配置，匹配这些路由与位置，创建一些路由匹配，并呈现第一个匹配的路由元素。_

You render an <Outlet/> in each parent route.
_你在每个父路由中渲染一个 `<Outlet/>`。_

The `outlets` render the next match in the route matches.
_路由匹配中的下一个匹配渲染。_

The user clicks a link
_用户点击一个链接_

The link calls navigate()
_链接调用 navigate()_

The history changes the URL and notifies `<BrowserRouter>`.
_历史改变 URL，并通知 `<BrowserRouter>`。_

`<BrowserRouter>` rerenders, start over at (2)!
_<BrowserRouter> 重新渲染，从 (2) 开始！_

That's it! We hope this guide has helped you gain a deeper understanding of the main concepts in React Router.
_这就是了！我们希望这个指南有能帮助你深入理解 React 路由的主要概念。_

## 背景

最近看到了，面试题 react-router 原理，查了下答案，内容不是很多

<a href="https://blog.csdn.net/weixin_39907713/article/details/111237885" target="_blank" >React Router 原理</a>
<a href="https://blog.csdn.net/qingfeng2020/article/details/121136648" target="_blank" >浅谈前端路由原理，VueRouter 原理和 ReactRouter 原理</a>

<a href="https://blog.csdn.net/Android_boom/article/details/125200222" target="_blank" >React Router 源码解析</a>

之前没看过实现原理，现在看到也没那么难 `从小被吓大的`， 带着好奇心看下仓库代码：`4+1（index.ts）个文件`没看错

<img src="http://t-blog-images.aijs.top/img/20220621091016.webp" width=300 />

## index.ts

```ts
// 暴露出的api
export {
  MemoryRouter,
  Navigate,
  NavigationType,
  Outlet,
  Route,
  Router,
  Routes,
  createPath,
  createRoutesFromChildren,
  generatePath,
  matchPath,
  matchRoutes,
  parsePath,
  renderMatches,
  resolvePath,
  useHref,
  useInRouterContext,
  useLocation,
  useMatch,
  useNavigate,
  useNavigationType,
  useOutlet,
  useOutletContext,
  useParams,
  useResolvedPath,
  useRoutes,
};
///////////////////////////////////////////////////////////////////////////////
// DANGER! PLEASE READ ME! 危险！请读这个！
// We provide these exports as an escape hatch in the event that you need any
// routing data that we don't provide an explicit API for. With that said, we
// want to cover your use case if we can, so if you feel the need to use these
// we want to hear from you. Let us know what you're building and we'll do our
// best to make sure we can support you!
// 我们提供这些导出作为一个逃逸引用，以防你需要我们没有提供明确 API 的任何路由数据。也就是说，
// 如果你需要这些，我们希望能够为你提供支持，所以如果你有需要，请告诉我们你的需求，我们会尽可能地为你提供支持。
// We consider these exports an implementation detail and do not guarantee
// against any breaking changes, regardless of the semver release. Use with
// extreme caution and only if you understand the consequences. Godspeed.
// 我们考虑这些导出是一个实现细节，并且不保证对任何变更不会有任何影响，无论是在 semver 版本发布前或者后。
///////////////////////////////////////////////////////////////////////////////
```

## react-router-dom

> 对`react-router`进行了扩展，
