---
title: react-router v6.4.0 源码
date: 2022-06-21 09:06:50
categories: react
tags: [react]
cover:
---

## 背景

整了半天上一篇看的竟然是概念，我还以为是原理呢

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

## history

源码中使用了一个 <a href="https://github.com/remix-run/history" target="_blank" >history 库</a>

The history library lets you easily manage session history anywhere JavaScript runs. A history object abstracts away the differences in various environments and provides a minimal API that lets you manage the history stack, navigate, and persist state between sessions.
_这个库让你在任何 JavaScript 运行的地方都能方便地管理会话历史记录。一个历史对象抽象了不同环境的差异，并提供了一个最小的 API，让你管理历史堆栈，导航，并在会话间保持状态。_

## react-router-dom

> 对`react-router`进行了扩展，

`react-router-dom`,在`react-router`的核心基础上，添加了用于跳转的`Link`组件，和`histoy`模式下的`BrowserRouter`和 hash 模式下的`HashRouter`组件等。所谓 B`rowserRouter`和`HashRouter`，也只不过用了`history`库中`createBrowserHistory`和`createHashHistory`方法

## 找个 demo 从头看

```tsx
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter> // react-router-dom
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
```

## BrowserRouter

```tsx
export function BrowserRouter({
  basename,
  children,
  window,
}: BrowserRouterProps) {
  let historyRef = React.useRef<BrowserHistory>();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({ window });
  }

  let history = historyRef.current;
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });
  // 监听url变化， 改变state，更新Router的location，location更新后会触发Router内部重新渲染
  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router // react-router "./lib/components"
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
}
```

**react-router "./lib/components"**

```tsx
/**
 * Provides location context for the rest of the app.
 * 为应用程序的其余部分提供位置上下文。
 * Note: You usually won't render a <Router> directly. Instead, you'll render a
 * router that is more specific to your environment such as a <BrowserRouter>
 * in web browsers or a <StaticRouter> for server rendering.
 * 注意：通常不会直接渲染<Router>。相反，您将渲染
 * 更特定于您的环境的路由器，如<BrowserRouter>
 * 在web浏览器中或用于服务器渲染的<StaticRouter>。
 *
 * @see https://reactrouter.com/docs/en/v6/routers/router
 */
export function Router({
  basename: basenameProp = "/",
  children = null,
  location: locationProp, // Location
  navigationType = NavigationType.Pop,
  navigator,
  static: staticProp = false,
}: RouterProps): React.ReactElement | null {
  invariant(
    !useInRouterContext(),
    `You cannot render a <Router> inside another <Router>.` +
      ` You should never have more than one in your app.`
  );

  let basename = normalizePathname(basenameProp);
  let navigationContext = React.useMemo(
    () => ({ basename, navigator, static: staticProp }),
    [basename, navigator, staticProp]
  );

  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }

  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default",
  } = locationProp;

  let location = React.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);

    if (trailingPathname == null) {
      return null;
    }

    return {
      pathname: trailingPathname,
      search,
      hash,
      state,
      key,
    };
  }, [basename, pathname, search, hash, state, key]);

  warning(
    location != null,
    `<Router basename="${basename}"> is not able to match the URL ` +
      `"${pathname}${search}${hash}" because it does not start with the ` +
      `basename, so the <Router> won't render anything.`
  );

  if (location == null) {
    return null;
  }

  return (
    <NavigationContext.Provider value={navigationContext}>
      {" "}
      // React.createContext使用， 一般情况这里会单独抽取 NavigationContext， 并写成useNavigationContext
      <LocationContext.Provider // 一般情况这里会单独抽取 LocationContext, 并写成useLocationContext
        children={children} // 是这种以属性形式写入的，不是在标签中包裹的， 即example/basic <App />
        value={{ location, navigationType }}
      />
    </NavigationContext.Provider>
  );
}
```

**NavigationContext**

```ts
/**
 * A Navigator is a "location changer"; it's how you get to different locations.
 *
 * Every history instance conforms to the Navigator interface, but the
 * distinction is useful primarily when it comes to the low-level <Router> API
 * where both the location and a navigator must be provided separately in order
 * to avoid "tearing" that may occur in a suspense-enabled app if the action
 * and/or location were to be read directly from the history instance.
 */
export type Navigator = Pick<History, "go" | "push" | "replace" | "createHref">;

interface NavigationContextObject {
  basename: string;
  navigator: Navigator;
  static: boolean;
}

export const NavigationContext = React.createContext<NavigationContextObject>(
  null!
);
```

**LocationContext**

```ts
interface LocationContextObject {
  location: Location;
  navigationType: NavigationType;
}

export const LocationContext = React.createContext<LocationContextObject>(
  null!
);
```

**App.tsx**

```tsx
import * as React from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div>
      <h1>Basic Example</h1>

      <p>
        This example demonstrates some of the core features of React Router
        including nested <code>&lt;Route&gt;</code>s,{" "}
        <code>&lt;Outlet&gt;</code>s, <code>&lt;Link&gt;</code>s, and using a
        "*" route (aka "splat route") to render a "not found" page when someone
        visits an unrecognized URL.
      </p>

      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      {/* 管线相互嵌套。嵌套布线路径基于
      线路径和嵌套管线元素在内部渲染
      父管线元素。请参见下面关于<Outlet>的注释。*/}
      <Routes>
        <Route path="/" element={<Layout />}>
          {" "}
          // Route在createRoutesFromChildren中进行处理 element.type === Route
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          {/* 啥都没捞着，走匹配*/}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/nothing-here">Nothing Here</Link>
          </li>
        </ul>
      </nav>

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
```

**`import { Routes, Route, Outlet, Link } from "react-router-dom";`**

## Routes

传入一个路由的数组，返回对应要展示的组件，有点类似于 vue 的路由的配置，可以在别的文件夹配置好路由，然后传入 APP.tsx 中

```tsx
/**
 * A container for a nested tree of <Route> elements that renders the branch
 * that best matches the current location.
 *
 * @see https://reactrouter.com/docs/en/v6/components/routes
 */
export function Routes({
  children,
  location,
}: RoutesProps): React.ReactElement | null {
  return useRoutes(createRoutesFromChildren(children), location);
}
```

### createRoutesFromChildren

看大概意思，怎么实现不管

大意是从 Children 中创建路由

```tsx
/**
 * Creates a route config from a React "children" object, which is usually
 * either a `<Route>` element or an array of them. Used internally by
 * `<Routes>` to create a route config from its children.
 * 从React“children”对象创建路由配置，通常
 * 一个`<路由>`元素或它们的数组。内部使用人
 * `<路由>`从其子级创建路由配置。
 * @see https://reactrouter.com/docs/en/v6/utils/create-routes-from-children
 */
export function createRoutesFromChildren(
  children: React.ReactNode
): RouteObject[] {
  let routes: RouteObject[] = [];

  React.Children.forEach(children, (element) => {
    if (!React.isValidElement(element)) {
      // Ignore non-elements. This allows people to more easily inline
      // conditionals in their route config.
      return;
    }

    if (element.type === React.Fragment) {
      // Transparently support React.Fragment and its children.
      // 递归
      routes.push.apply(
        routes,
        createRoutesFromChildren(element.props.children)
      );
      return;
    }

    invariant(
      element.type === Route,
      `[${
        typeof element.type === "string" ? element.type : element.type.name
      }] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    );

    let route: RouteObject = {
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      index: element.props.index,
      path: element.props.path,
    };

    if (element.props.children) {
      // 递归
      route.children = createRoutesFromChildren(element.props.children);
    }

    routes.push(route);
  });

  return routes;
}
```

### useRoutes

```ts
/**
 * Returns the element of the route that matched the current location, prepared
 * with the correct context to render the remainder of the route tree. Route
 * elements in the tree must render an <Outlet> to render their child route's
 * element.
 * 返回与当前位置匹配的路由元素，已准备就绪
 * 使用正确的上下文渲染路由树的其余部分。路线
 * 树中的元素必须渲染一个<Outlet>，才能渲染其子路由的
 * 元素。
 * @see https://reactrouter.com/docs/en/v6/hooks/use-routes
 */
export function useRoutes(
  routes: RouteObject[],
  locationArg?: Partial<Location> | string
): React.ReactElement | null {
  // invariant(
  //   useInRouterContext(),
  //   // TODO: This error is probably because they somehow have 2 versions of the
  //   // router loaded. We can help them understand how to avoid that.
  //   `useRoutes() may be used only in the context of a <Router> component.`
  // );

  let { matches: parentMatches } = React.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;

  // if (__DEV__) {
  //   // You won't get a warning about 2 different <Routes> under a <Route>
  //   // without a trailing *, but this is a best-effort warning anyway since we
  //   // cannot even give the warning unless they land at the parent route.
  //   //
  //   // Example:
  //   //
  //   // <Routes>
  //   //   {/* This route path MUST end with /* because otherwise
  //   //       it will never match /blog/post/123 */}
  //   //   <Route path="blog" element={<Blog />} />
  //   //   <Route path="blog/feed" element={<BlogFeed />} />
  //   // </Routes>
  //   //
  //   // function Blog() {
  //   //   return (
  //   //     <Routes>
  //   //       <Route path="post/:id" element={<Post />} />
  //   //     </Routes>
  //   //   );
  //   // }
  //   let parentPath = (parentRoute && parentRoute.path) || "";
  //   warningOnce(
  //     parentPathname,
  //     !parentRoute || parentPath.endsWith("*"),
  //     `You rendered descendant <Routes> (or called \`useRoutes()\`) at ` +
  //       `"${parentPathname}" (under <Route path="${parentPath}">) but the ` +
  //       `parent route path has no trailing "*". This means if you navigate ` +
  //       `deeper, the parent won't match anymore and therefore the child ` +
  //       `routes will never render.\n\n` +
  //       `Please change the parent <Route path="${parentPath}"> to <Route ` +
  //       `path="${parentPath === "/" ? "*" : `${parentPath}/*`}">.`
  //   );
  // }

  let locationFromContext = useLocation();

  let location;
  if (locationArg) {
    let parsedLocationArg =
      typeof locationArg === "string" ? parsePath(locationArg) : locationArg;

    // invariant(
    //   parentPathnameBase === "/" ||
    //     parsedLocationArg.pathname?.startsWith(parentPathnameBase),
    //   `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, ` +
    //     `the location pathname must begin with the portion of the URL pathname that was ` +
    //     `matched by all parent routes. The current pathname base is "${parentPathnameBase}" ` +
    //     `but pathname "${parsedLocationArg.pathname}" was given in the \`location\` prop.`
    // );

    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }

  let pathname = location.pathname || "/";
  let remainingPathname =
    parentPathnameBase === "/"
      ? pathname
      : pathname.slice(parentPathnameBase.length) || "/";
  let matches = matchRoutes(routes, { pathname: remainingPathname });

  // if (__DEV__) {
  //   warning(
  //     parentRoute || matches != null,
  //     `No routes matched location "${location.pathname}${location.search}${location.hash}" `
  //   );

  //   warning(
  //     matches == null ||
  //       matches[matches.length - 1].route.element !== undefined,
  //     `Matched leaf route at location "${location.pathname}${location.search}${location.hash}" does not have an element. ` +
  //       `This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
  //   );
  // }

  return _renderMatches(
    matches &&
      matches.map((match) =>
        Object.assign({}, match, {
          params: Object.assign({}, parentParams, match.params),
          pathname: joinPaths([parentPathnameBase, match.pathname]),
          pathnameBase:
            match.pathnameBase === "/"
              ? parentPathnameBase
              : joinPaths([parentPathnameBase, match.pathnameBase]),
        })
      ),
    parentMatches
  );
}
```

### matchRoutes

```ts
/**
 * Matches the given routes to a location and returns the match data.
 * 将给定路由匹配到某个位置并返回匹配数据。
 * @see https://reactrouter.com/docs/en/v6/utils/match-routes
 */
export function matchRoutes(
  routes: RouteObject[],
  locationArg: Partial<Location> | string,
  basename = "/"
): RouteMatch[] | null {
  let location =
    typeof locationArg === "string" ? parsePath(locationArg) : locationArg;

  let pathname = stripBasename(location.pathname || "/", basename);

  if (pathname == null) {
    return null;
  }

  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);

  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    matches = matchRouteBranch(branches[i], pathname);
  }

  return matches;
}
```

### \_renderMatches

```ts
export function _renderMatches(
  matches: RouteMatch[] | null,
  parentMatches: RouteMatch[] = []
): React.ReactElement | null {
  if (matches == null) return null;

  return matches.reduceRight((outlet, match, index) => {
    return (
      <RouteContext.Provider
        children={
          match.route.element !== undefined ? match.route.element : outlet
        }
        value={{
          outlet,
          matches: parentMatches.concat(matches.slice(0, index + 1)),
        }}
      />
    );
  }, null as React.ReactElement | null);
}
```

### RouteContext

```ts
interface RouteContextObject {
  outlet: React.ReactElement | null;
  matches: RouteMatch[];
}

export const RouteContext = React.createContext<RouteContextObject>({
  outlet: null,
  matches: [],
});

if (__DEV__) {
  RouteContext.displayName = "Route";
}
```

## Link

```tsx
export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  // 剔除 href 属性，代码中内部使用useHref(to)生成
  reloadDocument?: boolean;
  replace?: boolean;
  state?: any;
  to: To;
}

/**
 * The public API for rendering a history-aware <a>.
 *
 * @see https://reactrouter.com/docs/en/v6/components/link
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function LinkWithRef(
    { onClick, reloadDocument, replace = false, state, target, to, ...rest },
    ref
  ) {
    let href = useHref(to);
    let internalOnClick = useLinkClickHandler(to, { replace, state, target });
    function handleClick(
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) {
      if (onClick) onClick(event);
      if (!event.defaultPrevented && !reloadDocument) {
        internalOnClick(event);
      }
    }

    return (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a
        {...rest}
        href={href}
        onClick={handleClick}
        ref={ref}
        target={target}
      />
    );
  }
);
```

### useHref

```ts
/**
 * Returns the full href for the given "to" value. This is useful for building
 * custom links that are also accessible and preserve right-click behavior.
 * 返回给定“to”值的完整href。这对于构建也可访问并保留右键单击行为的自定义链接非常有用。
 * @see https://reactrouter.com/docs/en/v6/hooks/use-href
 */
export function useHref(to: To): string {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useHref() may be used only in the context of a <Router> component.`
  );

  let { basename, navigator } = React.useContext(NavigationContext);
  let { hash, pathname, search } = useResolvedPath(to);

  let joinedPathname = pathname;
  if (basename !== "/") {
    let toPathname = getToPathname(to);
    let endsWithSlash = toPathname != null && toPathname.endsWith("/");
    joinedPathname =
      pathname === "/"
        ? basename + (endsWithSlash ? "/" : "")
        : joinPaths([basename, pathname]);
  }

  return navigator.createHref({ pathname: joinedPathname, search, hash });
}
```

### useLinkClickHandler

<a href="https://blog.csdn.net/m0_52537576/article/details/124901230#:~:text=5-,useLinkClickHandler,-%E8%BF%99%E4%B8%AAhooks%E8%BF%94%E5%9B%9E" target="_blank" >useLinkClickHandler</a>

```ts
/**
 * Handles the click behavior for router `<Link>` components. This is useful if
 * you need to create custom `<Link>` components with the same click behavior we
 * use in our exported `<Link>`.
 * 处理`<Link>`组件的单击行为。如果
 * 您需要创建具有与我们相同的单击行为的自定义`<Link>`组件
 * 在导出的`<Link>`中使用。
 * @see https://reactrouter.com/docs/en/v6/hooks/use-link-click-handler
 */
export function useLinkClickHandler<E extends Element = HTMLAnchorElement>(
  to: To,
  {
    target,
    replace: replaceProp,
    state,
  }: {
    target?: React.HTMLAttributeAnchorTarget;
    replace?: boolean;
    state?: any;
  } = {}
): (event: React.MouseEvent<E, MouseEvent>) => void {
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to);

  return React.useCallback(
    (event: React.MouseEvent<E, MouseEvent>) => {
      if (
        event.button === 0 && // Ignore everything but left clicks
        (!target || target === "_self") && // Let browser handle "target=_blank" etc.
        !isModifiedEvent(event) // Ignore clicks with modifier keys
      ) {
        event.preventDefault();

        // If the URL hasn't changed, a regular <a> will do a replace instead of
        // a push, so do the same here.
        // url没有改变，做replace操作，而不是push操作
        let replace =
          !!replaceProp || createPath(location) === createPath(path);

        navigate(to, { replace, state });
      }
    },
    [location, navigate, path, replaceProp, state, target, to]
  );
}
```

### useNavigate

```ts
/**
 * Returns an imperative method for changing the location. Used by <Link>s, but
 * may also be used by other elements to change the location.
 * 返回更改位置的命令式方法。由s使用，但
 * 也可由其他元素用于更改位置。
 * @see https://reactrouter.com/docs/en/v6/hooks/use-navigate
 */
export function useNavigate(): NavigateFunction {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useNavigate() may be used only in the context of a <Router> component.`
  );

  let { basename, navigator } = React.useContext(NavigationContext);
  let { matches } = React.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();

  let routePathnamesJson = JSON.stringify(
    matches.map((match) => match.pathnameBase)
  );

  let activeRef = React.useRef(false);
  React.useEffect(() => {
    activeRef.current = true;
  });

  let navigate: NavigateFunction = React.useCallback(
    (to: To | number, options: NavigateOptions = {}) => {
      warning(
        activeRef.current,
        `You should call navigate() in a React.useEffect(), not when ` +
          `your component is first rendered.`
      );

      if (!activeRef.current) return;

      if (typeof to === "number") {
        navigator.go(to);
        return;
      }

      let path = resolveTo(
        to,
        JSON.parse(routePathnamesJson),
        locationPathname
      );

      if (basename !== "/") {
        path.pathname = joinPaths([basename, path.pathname]);
      }
      // 这行代码写法，没见过，函数执行
      (!!options.replace ? navigator.replace : navigator.push)(
        path,
        options.state
      );
    },
    [basename, navigator, routePathnamesJson, locationPathname]
  );

  return navigate;
}
```

### resolveTo

```ts
export function resolveTo(
  toArg: To,
  routePathnames: string[],
  locationPathname: string
): Path {
  let to = typeof toArg === "string" ? parsePath(toArg) : toArg;
  let toPathname = toArg === "" || to.pathname === "" ? "/" : to.pathname;

  // If a pathname is explicitly provided in `to`, it should be relative to the
  // route context. This is explained in `Note on `<Link to>` values` in our
  // migration guide from v5 as a means of disambiguation between `to` values
  // that begin with `/` and those that do not. However, this is problematic for
  // `to` values that do not provide a pathname. `to` can simply be a search or
  // hash string, in which case we should assume that the navigation is relative
  // to the current location's pathname and *not* the route pathname.
  // 如果在“to”中显式提供了路径名，则它应该相对于路由上下文。这在我们的v5迁移指南中的“关于`<Link>`值'的注释”中有解释，
  // 作为消除以`/`开头的`到`值与不以`/`开头的`到`值之间歧义的一种方法。但是，对于不提供路径名的“to”值来说，
  // 这是有问题的`to `可以是一个搜索或哈希字符串，在这种情况下，我们应该假设导航相对于当前位置的路径名，而不是路径名。

  let from: string;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;

    if (toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");

      // Each leading .. segment means "go up one route" instead of "go up one
      // URL segment".  This is a key difference from how <a href> works and a
      // major reason we call this a "to" value instead of a "href".
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }

      to.pathname = toSegments.join("/");
    }

    // If there are more ".." segments than parent routes, resolve relative to
    // the root / URL.
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }

  let path = resolvePath(to, from);

  // Ensure the pathname has a trailing slash if the original to value had one.
  // 如果原始to值有斜杠，请确保路径名后面有斜杠。
  if (
    toPathname &&
    toPathname !== "/" &&
    toPathname.endsWith("/") &&
    !path.pathname.endsWith("/")
  ) {
    path.pathname += "/";
  }

  return path;
}
```

### useInRouterContext

判断是否在某个 React.createContext 的上下文

```ts
export function useInRouterContext(): boolean {
  return React.useContext(LocationContext) != null;
}

// invariant(
//   useInRouterContext(),
//   // TODO: This error is probably because they somehow have 2 versions of the
//   // router loaded. We can help them understand how to avoid that.
//   `useNavigate() may be used only in the context of a <Router> component.`
// );
```

<hr />

以上部分，是如何生成路由的源码部分。有个问题，路由生成出来了，如何进行配对渲染？走的太快了，回去看下

```tsx
// 这块代码我们上面有看过的

// BrowserRouter
React.useLayoutEffect(() => history.listen(setState), [history]);
//  history.listen(setState) 去找下history的api
// @see https://github.com/remix-run/history/blob/dev/docs/api-reference.md#historylistenlistener-listener
return (
  <Router // react-router "./lib/components"
    basename={basename}
    children={children}
    location={state.location}
    navigationType={state.action}
    navigator={history}
  />
);

// 直接在这里堆积下，上文是有的

let {
  pathname = "/",
  search = "",
  hash = "",
  state = null,
  key = "default",
} = locationProp;

<LocationContext.Provider // 一般情况这里会单独抽取 LocationContext, 并写成useLocationContext
  children={children} // 是这种以属性形式写入的，不是在标签中包裹的， 即example/basic <App />
  value={{ location, navigationType }}
/>;
```

文档内容

```ts
interface Listener {
  (update: Update): void;
}

interface Update {
  action: Action;
  location: Location; // 由 Location,结合Router
}
```

## Location 类型

```ts
/**
 * A URL pathname, beginning with a /.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.pathname
 */
export type Pathname = string;

/**
 * A URL search string, beginning with a ?.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.search
 */
export type Search = string;

/**
 * The pathname, search, and hash values of a URL.
 */
export interface Path {
  /**
   * A URL pathname, beginning with a /.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.pathname
   */
  pathname: Pathname;

  /**
   * A URL search string, beginning with a ?.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.search
   */
  search: Search;

  /**
   * A URL fragment identifier, beginning with a #.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.hash
   */
  hash: Hash;
}

/**
 * An entry in a history stack. A location contains information about the
 * URL path, as well as possibly some arbitrary state and a key.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location
 */
export interface Location extends Path {
  /**
   * A value of arbitrary data associated with this location.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.state
   */
  state: unknown;

  /**
   * A unique string associated with this location. May be used to safely store
   * and retrieve data in some other storage API, like `localStorage`.
   *
   * Note: This value is always "default" on the initial location.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.key
   */
  key: Key;
}
```

## history/index.ts 源码

```ts
/**
 * A function that receives notifications about location changes.
 */
export interface Listener {
  (update: Update): void;
}
```

Starts listening for location changes and calls the given callback with an Update when it does.
开始侦听位置更改，并在更改时使用更新调用给定回调。

## 阶段性总结

BrowserRouter + App.tsx（Routes、Route 生成路由组件关系）

BrowserRouter：内部 history 监听路由变化，将 location 进行结构，并使用 useMemo 进行环境，传递给 LocationContext.Provider 的 value，驱动子组件 children 渲染，**代码 1**

LocationContext.Provider 子组件 = 也就是 BrowserRouter 的子组件 = App.tsx， 内部，获取 locationFromContext，进行匹配渲染 **代码 2**（见下述堆积代码`「上文以贴过源码，再贴一遍」`）

这里要注意下：useRoutes TOC 写法，最终应该是

## 代码 2

```tsx
/**
 * Returns the current location object, which represents the current URL in web
 * browsers.
 *
 * Note: If you're using this it may mean you're doing some of your own
 * "routing" in your app, and we'd like to know what your use case is. We may
 * be able to provide something higher-level to better suit your needs.
 *
 * @see https://reactrouter.com/docs/en/v6/hooks/use-location
 */
export function useLocation(): Location {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useLocation() may be used only in the context of a <Router> component.`
  );

  return React.useContext(LocationContext).location;
}
```

```tsx
// hooks.ts useRoutes中

let locationFromContext = useLocation(); // 这里

let location;
if (locationArg) {
  let parsedLocationArg =
    typeof locationArg === "string" ? parsePath(locationArg) : locationArg;

  invariant(
    parentPathnameBase === "/" ||
      parsedLocationArg.pathname?.startsWith(parentPathnameBase),
    `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, ` +
      `the location pathname must begin with the portion of the URL pathname that was ` +
      `matched by all parent routes. The current pathname base is "${parentPathnameBase}" ` +
      `but pathname "${parsedLocationArg.pathname}" was given in the \`location\` prop.`
  );

  location = parsedLocationArg;
} else {
  location = locationFromContext; // 这里
}

let pathname = location.pathname || "/";
let remainingPathname =
  parentPathnameBase === "/"
    ? pathname
    : pathname.slice(parentPathnameBase.length) || "/";
let matches = matchRoutes(routes, { pathname: remainingPathname });
// 开发提醒 跳过
// if (__DEV__) {
//   warning(
//     parentRoute || matches != null,
//     `No routes matched location "${location.pathname}${location.search}${location.hash}" `
//   );

//   warning(
//     matches == null || matches[matches.length - 1].route.element !== undefined,
//     `Matched leaf route at location "${location.pathname}${location.search}${location.hash}" does not have an element. ` +
//       `This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
//   );
// }
// 渲染
return _renderMatches(
  matches &&
    matches.map((match) =>
      Object.assign({}, match, {
        params: Object.assign({}, parentParams, match.params),
        pathname: joinPaths([parentPathnameBase, match.pathname]),
        pathnameBase:
          match.pathnameBase === "/"
            ? parentPathnameBase
            : joinPaths([parentPathnameBase, match.pathnameBase]),
      })
    ),
  parentMatches
);

// _renderMatches

export function _renderMatches(
  matches: RouteMatch[] | null,
  parentMatches: RouteMatch[] = []
): React.ReactElement | null {
  if (matches == null) return null;
  // 这是一个递归 reduceRight，与reduce类似，不过reduceRight是从右到左
  return matches.reduceRight((outlet, match, index) => {
    return (
      <RouteContext.Provider // 需要看下 RouteContext在什么地方使用的，为什要看它，因为这个Context距离渲染组件的chilren最近，看他是如何驱动组件更新的【element、outlet】
        children={
          match.route.element !== undefined ? match.route.element : outlet
        }
        value={{
          outlet,
          matches: parentMatches.concat(matches.slice(0, index + 1)),
        }}
      />
    );
  }, null as React.ReactElement | null);
}
```

## RouteContext 在源码中的使用

- useNavigate
- useOutlet
- useParams
- useResolvedPath
- useRoutes

### useNavigate

```ts
/**
 * Returns an imperative method for changing the location. Used by <Link>s, but
 * may also be used by other elements to change the location.
 * 返回更改位置的命令式方法。由<Link>s使用，但也可由其他元素用于更改位置。
 * @see https://reactrouter.com/docs/en/v6/hooks/use-navigate
 */
export function useNavigate(): NavigateFunction {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useNavigate() may be used only in the context of a <Router> component.`
  );

  let { basename, navigator } = React.useContext(NavigationContext);
  let { matches } = React.useContext(RouteContext); // 这里
  let { pathname: locationPathname } = useLocation();

  let routePathnamesJson = JSON.stringify(
    matches.map((match) => match.pathnameBase)
  );

  let activeRef = React.useRef(false);
  React.useEffect(() => {
    activeRef.current = true;
  });

  let navigate: NavigateFunction = React.useCallback(
    (to: To | number, options: NavigateOptions = {}) => {
      warning(
        activeRef.current,
        `You should call navigate() in a React.useEffect(), not when ` +
          `your component is first rendered.`
      );

      if (!activeRef.current) return;

      if (typeof to === "number") {
        navigator.go(to);
        return;
      }

      let path = resolveTo(
        to,
        JSON.parse(routePathnamesJson),
        locationPathname
      );

      if (basename !== "/") {
        path.pathname = joinPaths([basename, path.pathname]);
      }

      (!!options.replace ? navigator.replace : navigator.push)(
        path,
        options.state
      );
    },
    [basename, navigator, routePathnamesJson, locationPathname]
  );

  return navigate;
}

/**
 * Returns the element for the child route at this level of the route
 * hierarchy. Used internally by <Outlet> to render child routes.
 *
 * @see https://reactrouter.com/docs/en/v6/hooks/use-outlet
 */
export function useOutlet(context?: unknown): React.ReactElement | null {
  let outlet = React.useContext(RouteContext).outlet; // 这里
  if (outlet) {
    return (
      <OutletContext.Provider value={context}>{outlet}</OutletContext.Provider>
    );
  }
  return outlet;
}

export function useParams<
  ParamsOrKey extends string | Record<string, string | undefined> = string
>(): Readonly<
  [ParamsOrKey] extends [string] ? Params<ParamsOrKey> : Partial<ParamsOrKey>
> {
  let { matches } = React.useContext(RouteContext);// 这里
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? (routeMatch.params as any) : {};
}

/**
 * Resolves the pathname of the given `to` value against the current location.
 *
 * @see https://reactrouter.com/docs/en/v6/api#useresolvedpath
 */
export function useResolvedPath(to: To): Path {
  let { matches } = React.useContext(RouteContext); // 这里
  let { pathname: locationPathname } = useLocation();

  let routePathnamesJson = JSON.stringify(
    matches.map((match) => match.pathnameBase)
  );

  return React.useMemo(
    () => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname),
    [to, routePathnamesJson, locationPathname]
  );
}

/**
 * Returns the element of the route that matched the current location, prepared
 * with the correct context to render the remainder of the route tree. Route
 * elements in the tree must render an <Outlet> to render their child route's
 * element.
 *
 * @see https://reactrouter.com/docs/en/v6/hooks/use-routes
 */
export function useRoutes(
  routes: RouteObject[],
  locationArg?: Partial<Location> | string
): React.ReactElement | null {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useRoutes() may be used only in the context of a <Router> component.`
  );

  let { matches: parentMatches } = React.useContext(RouteContext); // 这里
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;

```

最终发现，又回到 useRoutes，也确实是在尾部调用 TOC,如下抽取部分代码片段

## 代码 2

```tsx
// 1 useRoutes尾部调用
let locationFromContext = useLocation(); // 这里
return _renderMatches(
  matches &&
    matches.map((match) =>
      Object.assign({}, match, {
        params: Object.assign({}, parentParams, match.params),
        pathname: joinPaths([parentPathnameBase, match.pathname]),
        pathnameBase:
          match.pathnameBase === "/"
            ? parentPathnameBase
            : joinPaths([parentPathnameBase, match.pathnameBase]),
      })
    ),
  parentMatches
);

// 2
export function _renderMatches(
  matches: RouteMatch[] | null,
  parentMatches: RouteMatch[] = []
): React.ReactElement | null {
  if (matches == null) return null;
  // 这是一个递归 reduceRight，与reduce类似，不过reduceRight是从右到左
  return matches.reduceRight((outlet, match, index) => {
    return (
      <RouteContext.Provider // 需要看下 RouteContext在什么地方使用的，为什要看它，因为这个Context距离渲染组件的chilren最近，看他是如何驱动组件更新的【element、outlet】
        children={
          match.route.element !== undefined ? match.route.element : outlet // 这里的return相当于将 上述1的代码全部塞在RouteContext.Provider中  注意：因为react.context只能在对应的provider中使用
          // 这里拿了 Route的element的属性（组件渲染）据说，Route的形式有好多种，下面看看去
        }
        value={{
          outlet,
          matches: parentMatches.concat(matches.slice(0, index + 1)),
        }}
      />
    );
  }, null as React.ReactElement | null);
}
```

## Route

```ts
/**
 * Declares an element that should be rendered at a certain URL path.
 * 声明在某个URL路径渲染的元素
 * @see https://reactrouter.com/docs/en/v6/components/route
 */
export function Route( // 这个看上去就一个函数声明，啥都没有
  _props: PathRouteProps | LayoutRouteProps | IndexRouteProps
): React.ReactElement | null {
  invariant(
    false,
    `A <Route> is only ever to be used as the child of <Routes> element, ` +
      `never rendered directly. Please wrap your <Route> in a <Routes>.`
  );
}
```

## createRoutesFromChildren

```ts
/**
 * Creates a route config from a React "children" object, which is usually
 * either a `<Route>` element or an array of them. Used internally by
 * `<Routes>` to create a route config from its children.
 *
 * @see https://reactrouter.com/docs/en/v6/utils/create-routes-from-children
 */
export function createRoutesFromChildren(
  children: React.ReactNode
): RouteObject[] {
  let routes: RouteObject[] = [];

  React.Children.forEach(children, (element) => {
    if (!React.isValidElement(element)) {
      // 不是react组件返回undefined,结束
      // Ignore non-elements. This allows people to more easily inline
      // conditionals in their route config.
      return;
    }

    if (element.type === React.Fragment) {
      // React.Fragment
      // Transparently support React.Fragment and its children.
      // 支持React.Fragment及其子级。
      routes.push.apply(
        routes,
        createRoutesFromChildren(element.props.children)
      );
      return;
    }

    invariant(
      element.type === Route,
      `[${
        typeof element.type === "string" ? element.type : element.type.name
      }] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    );

    let route: RouteObject = {
      caseSensitive: element.props.caseSensitive,
      element: element.props.element, // 这里直接把组件给了route，上面   match.route.element !== undefined ? match.route.element : outlet  渲染时候渲染就是它
      index: element.props.index,
      path: element.props.path,
    };

    if (element.props.children) {
      // 有children
      route.children = createRoutesFromChildren(element.props.children);
    }

    routes.push(route);
  });

  return routes;
}
```

## 至此

我们了解到了，react-router 监听，渲染整个过程

## 余下的勾子

- useNavigate
- useOutlet
- useParams
- useResolvedPath

### useNavigate

独立功能块，提供 navigate 用于跳转两个参数，第一个参数接受数字和路径

```tsx
/**
 * Returns an imperative method for changing the location. Used by <Link>s, but
 * may also be used by other elements to change the location.
 *
 * @see https://reactrouter.com/docs/en/v6/hooks/use-navigate
 */
export function useNavigate(): NavigateFunction {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useNavigate() may be used only in the context of a <Router> component.`
  );

  let { basename, navigator } = React.useContext(NavigationContext);
  let { matches } = React.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();

  let routePathnamesJson = JSON.stringify(
    matches.map((match) => match.pathnameBase)
  );

  let activeRef = React.useRef(false);
  React.useEffect(() => {
    activeRef.current = true;
  });

  // 声明一个函数
  let navigate: NavigateFunction = React.useCallback(
    (to: To | number, options: NavigateOptions = {}) => {
      warning(
        activeRef.current,
        `You should call navigate() in a React.useEffect(), not when ` +
          `your component is first rendered.`
      );

      if (!activeRef.current) return;

      if (typeof to === "number") {
        // 支持数字
        navigator.go(to);
        return;
      }

      let path = resolveTo(
        to,
        JSON.parse(routePathnamesJson),
        locationPathname
      );

      if (basename !== "/") {
        path.pathname = joinPaths([basename, path.pathname]);
      }

      (!!options.replace ? navigator.replace : navigator.push)(
        path, // 支持路径跳转
        options.state
      );
    },
    [basename, navigator, routePathnamesJson, locationPathname]
  );
  // 返回这个函数
  return navigate;
}
```

### useOutlet

```tsx
/**
 * Returns the element for the child route at this level of the route
 * hierarchy. Used internally by <Outlet> to render child routes.
 * 返回路由层次结构此级别的子路由的元素。由<Outlet>内部使用以渲染子路由。
 * @see https://reactrouter.com/docs/en/v6/hooks/use-outlet
 */
export function useOutlet(context?: unknown): React.ReactElement | null {
  let outlet = React.useContext(RouteContext).outlet;
  if (outlet) {
    return (
      <OutletContext.Provider value={context}>{outlet}</OutletContext.Provider>
    );
  }
  return outlet;
}

// 使用

/**
 * Renders the child route's element, if there is one.
 * 渲染子路由的元素（如果有）。
 * @see https://reactrouter.com/docs/en/v6/components/outlet
 */
export function Outlet(props: OutletProps): React.ReactElement | null {
  return useOutlet(props.context);
}
```

### useParams

```tsx
/**
 * Returns an object of key/value pairs of the dynamic params from the current
 * URL that were matched by the route path.
 * 返回由路由路径匹配的当前URL中的动态参数的键/值对组成的对象。
 *
 * @see https://reactrouter.com/docs/en/v6/hooks/use-params
 */
export function useParams<
  ParamsOrKey extends string | Record<string, string | undefined> = string
>(): Readonly<
  [ParamsOrKey] extends [string] ? Params<ParamsOrKey> : Partial<ParamsOrKey>
> {
  let { matches } = React.useContext(RouteContext);
  let routeMatch = matches[matches.length - 1];
  // 最后一个就是当前页面对应参数：怎么理解
  // 1. push情况，最后一个是当前页面
  // 2. replace情况，最后一个是当前页面
  // 3. pop 返回情况，最后一个是当前页面

  // 所以最后一个就是当前页面
  return routeMatch ? (routeMatch.params as any) : {};
}
```

### useResolvedPath

[具体使用见](https://github.com/841660202/react-router/blob/854f4a41780089ad114fecef1a25111830f5cc0b/examples/custom-link/src/App.tsx#L36)

```tsx
/**
 * Resolves the pathname of the given `to` value against the current location.
 * 根据当前位置解析给定“to”值的路径名。
 * @see https://reactrouter.com/docs/en/v6/api#useresolvedpath
 */
export function useResolvedPath(to: To): Path {
  let { matches } = React.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();

  let routePathnamesJson = JSON.stringify(
    matches.map((match) => match.pathnameBase)
  );

  return React.useMemo(
    () => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname),
    [to, routePathnamesJson, locationPathname]
  );
}

// Path

export interface Path {
  /**
   * A URL pathname, beginning with a /.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.pathname
   */
  pathname: Pathname;

  /**
   * A URL search string, beginning with a ?.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.search
   */
  search: Search;

  /**
   * A URL fragment identifier, beginning with a #.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.hash
   */
  hash: Hash;
}

/**
 * A URL pathname, beginning with a /.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.pathname
 */
export type Pathname = string;

/**
 * A URL search string, beginning with a ?.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.search
 */
export type Search = string;

/**
 * A URL fragment identifier, beginning with a #.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.hash
 */
export type Hash = string;
```

## 参考链接

[fork 的 react-router 代码](https://github.com/841660202/react-router)
[「源码解析 」这一次彻底弄懂 react-router 路由原理](https://juejin.cn/post/6886290490640039943)
[React Router 教程](https://www.lmlphp.com/user/60155/article/item/1561048/)
