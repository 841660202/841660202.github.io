---
title: react-redux  源码2
date: 2022-05-24 21:15:31
categories: react
tags: [react-redux, redux, 源码]
cover: 
---
源码版本`"version": "8.0.2",`
## Provider

- 主要作用通过subscription调用redux中store的subscription产生订阅，订阅内容是onStateChange的回调
- 通过react的Provider功能，提供传递给根的store和根的subscription给后续使用了connect的组件

```tsx
/* provider 组件代码 */
function Provider({ store, context, children }) {
   /* 利用useMemo，跟据store变化创建出一个contextValue 包含一个根元素订阅器和当前store  */ 
  const contextValue = useMemo(() => {
      /* 创建了一个根 Subscription 订阅器 */
    const subscription = new Subscription(store)
    /* subscription 的 notifyNestedSubs 方法 ，赋值给  onStateChange方法 */
    //onStateChange就是之后触发的listenr
    subscription.onStateChange = subscription.notifyNestedSubs  
    return {
      store,
      subscription
    } /*  store 改变创建新的contextValue */
  }, [store])
  /*  获取更新之前的state值 ，函数组件里面的上下文要优先于组件更新渲染  */
  const previousState = useMemo(() => store.getState(), [store])

  useEffect(() => {
    const { subscription } = contextValue
    /* 触发trySubscribe方法执行，创建listens */
    subscription.trySubscribe() // 发起订阅
    if (previousState !== store.getState()) {
        /* 组件更新渲染之后，如果此时state发生改变，那么立即触发 subscription.notifyNestedSubs 方法  */
        //触发所有的listener
      subscription.notifyNestedSubs() 
    }
    /*   */
    return () => {
      subscription.tryUnsubscribe()  // 卸载订阅
      subscription.onStateChange = null
    }
    /*  contextValue state 改变出发新的 effect */
  }, [contextValue, previousState])

  //若Provider没有显示传入context，则为使用React.createContext创建的上下文
  const Context = context || ReactReduxContext

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

```
## Subscription
- 订阅消息、发起更新
- 在根的Provider的作用是调用redux中store的订阅方法，将根的onStateChange进行订阅
- 在子代中是收集所有被 connect 包裹的组件中的Subscription的更新函数 onstatechange，然后形成一个 callback 链表，再由父级 Subscription 统一派发执行更新，只会往上传递一层，不会一直传递使得每一个上级都有自身的更新函数

```ts
/* 发布订阅者模式 */
export default class Subscription {
  constructor(store, parentSub) {
    this.store = store
    this.parentSub = parentSub
    this.unsubscribe = null
    this.listeners = nullListeners

    this.handleChangeWrapper = this.handleChangeWrapper.bind(this)
  }
  /* 负责检测是否该组件订阅，然后添加订阅者也就是listener */  
  //当父代调用过trySubscribe后，子代再调用，因为this.unsubscribe有值，所以并不会实际执行父代的trySubscribe，而只是将listener放进父代中管理
  addNestedSub(listener) {
    this.trySubscribe()
    return this.listeners.subscribe(listener)
  }
  /* 向listeners发布通知 */
  notifyNestedSubs() {
    this.listeners.notify()
  }
  /* 对于 Provide onStateChange 就是 notifyNestedSubs 方法，
  对于 connect 包裹接受更新的组件 ，onStateChange 就是 负责更新组件的函数 。   */
  handleChangeWrapper() {
    if (this.onStateChange) {
      this.onStateChange()
    }
  }
   /* 判断有没有开启订阅 */
  isSubscribed() {
    return Boolean(this.unsubscribe)
  }
  /* 开启订阅模式 首先判断当前订阅器有没有父级订阅器 ， 如果有父级订阅器(就是父级Subscription)，把自己的handleChangeWrapper放入到监听者链表中 */
  trySubscribe() {
    /*
    	parentSub即是provide value 里面的 Subscription 这里可以理解为 父级元素的 Subscription
    */
    //当Subscription执行过一次改方法后，再调用因为this.unsubscribe有值
    //所以该方法调用一次后就不会再被调用了
    //意味着addNestedSub中只会添加listener，而不会再调用trySubscribe，使得listener不会往上传递
    if (!this.unsubscribe) {
      this.unsubscribe = this.parentSub
        ? this.parentSub.addNestedSub(this.handleChangeWrapper)
        /* provider的Subscription是不存在parentSub，所以此时trySubscribe 就会调用 store.subscribe   */
        : this.store.subscribe(this.handleChangeWrapper)
      this.listeners = createListenerCollection()
    }
  }
  /* 取消订阅 */
  tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
      this.listeners.clear()

      this.listeners = nullListeners
    }
  }
}

```

- 首先Provider创建 Subscription 时候没有第二个参数，就说明provider 中的Subscription 不存在 parentSub 。
- 那么再调用Provider组件中useEffect钩子中trySubscribe的时候,会触发this.store.subscribe , subscribe 就是 redux 的 subscribe ,此时真正发起了订阅
- 订阅的内容是notifyNestedSubs，即通知根管理的listeners触发
```tsx
subscription.onStateChange = subscription.notifyNestedSubs 

/* 向listeners发布通知 */
notifyNestedSubs() {
  this.listeners.notify()
}

```
## createListenerCollection
通过双向链表的结构管理每一个listener
以链表的形式收集对应的 listeners (每一个Subscription) 的handleChangeWrapper函数即onStateChange。
通过 batch 方法( react-dom 中的 unstable_batchedUpdates ) 来进行批量更新，许将一次事件循环中的所有 React 更新都一起批量处理到一个渲染过程中。
```tsx
import { unstable_batchedUpdates as batch } from './utils/reactBatchedUpdates'
setBatch(batch)


function createListenerCollection() {
   /* batch 由getBatch得到的 unstable_batchedUpdates 方法 */
  const batch = getBatch()
  let first = null
  let last = null

  return {
    /* 清除当前listeners的所有listener */
    clear() {
      first = null
      last = null
    },
    /* 派发更新 */
    notify() {
      batch(() => {
        let listener = first
        while (listener) {
          listener.callback()
          listener = listener.next
        }
      })
    },
    /* 获取listeners的所有listener */
    get() {
      let listeners = []
      let listener = first
      while (listener) {
        listeners.push(listener)
        listener = listener.next
      }
      return listeners
    },
     /* 接收订阅，将当前的callback（handleChangeWrapper）存到当前的链表中  */
    subscribe(callback) {
      let isSubscribed = true

      let listener = (last = {
        callback,
        next: null,
        prev: last //首次last为空
      })
	   	
      if (listener.prev) {
        listener.prev.next = listener
      } else {
        first = listener
      }
      /* 取消当前 handleChangeWrapper 的订阅*/
      return function unsubscribe() {
        if (!isSubscribed || first === null) return
        isSubscribed = false
		
		//双向链表删除节点的操作
        if (listener.next) {
          listener.next.prev = listener.prev
        } else {
          last = listener.prev
        }
        if (listener.prev) {
          listener.prev.next = listener.next
        } else {
          first = listener.next
        }
      }
    }
  }
}

```
## connect
基本使用
```tsx
function connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)

const mapStateToProps = state => ({ todos: state.todos })
const mapDispatchToProps = dispatch => {
  return {
    increment: () => dispatch({ type: 'INCREMENT' }),
    decrement: () => dispatch({ type: 'DECREMENT' }),
    reset: () => dispatch({ type: 'RESET' })
  }
}
/*
* stateProps , state 映射到 props 中的内容
* dispatchProps， dispatch 映射到 props 中的内容。
* ownProps 组件本身的 props
当未传递时，默认的合并规则为
{ ...ownProps, ...stateProps, ...dispatchProps }

*/
mergeProps=(stateProps, dispatchProps, ownProps) => Object

options={
  context?: Object,   // 自定义上下文
  pure?: boolean, // 默认为 true , 当为 true 的时候 ，除了 mapStateToProps 和 props ,其他输入或者state 改变，均不会更新组件。
  areStatesEqual?: Function, // 当pure true , 比较引进store 中state值 是否和之前相等。 (next: Object, prev: Object) => boolean
  areOwnPropsEqual?: Function, // 当pure true , 比较 props 值, 是否和之前相等。 (next: Object, prev: Object) => boolean
  areStatePropsEqual?: Function, // 当pure true , 比较 mapStateToProps 后的值 是否和之前相等。  (next: Object, prev: Object) => boolean
  areMergedPropsEqual?: Function, // 当 pure 为 true 时， 比较 经过 mergeProps 合并后的值 ， 是否与之前等  (next: Object, prev: Object) => boolean
  forwardRef?: boolean, //当为true 时候,可以通过ref 获取被connect包裹的组件实例。
}

```
![](http://t-blog-images.aijs.top/img/20220525105732.webp)


```tsx
/**
 * Connects a React component to a Redux store.
 *
 * - Without arguments, just wraps the component, without changing the behavior / props
 *
 * - If 2 params are passed (3rd param, mergeProps, is skipped), default behavior
 * is to override ownProps (as stated in the docs), so what remains is everything that's
 * not a state or dispatch prop
 *
 * - When 3rd param is passed, we don't know if ownProps propagate and whether they
 * should be valid component props, because it depends on mergeProps implementation.
 * As such, it is the user's responsibility to extend ownProps interface from state or
 * dispatch props or both when applicable
 *
 * @param mapStateToProps A function that extracts values from state
 * @param mapDispatchToProps Setup for dispatching actions
 * @param mergeProps Optional callback to merge state and dispatch props together
 * @param options Options for configuring the connection
 *
 */
function connect<
  TStateProps = {},
  TDispatchProps = {},
  TOwnProps = {},
  TMergedProps = {},
  State = unknown
>(
  mapStateToProps?: MapStateToPropsParam<TStateProps, TOwnProps, State>,
  mapDispatchToProps?: MapDispatchToPropsParam<TDispatchProps, TOwnProps>,
  mergeProps?: MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps>,
  {
    // The `pure` option has been removed, so TS doesn't like us destructuring this to check its existence.
    // @ts-ignore
    pure,
    areStatesEqual = strictEqual,
    areOwnPropsEqual = shallowEqual,
    areStatePropsEqual = shallowEqual,
    areMergedPropsEqual = shallowEqual,

    // use React's forwardRef to expose a ref of the wrapped component
    forwardRef = false,

    // the context consumer to use
    context = ReactReduxContext,
  }: ConnectOptions<unknown, unknown, unknown, unknown> = {}
): unknown {
  

  const Context = context

  /*
  * stateProps , state 映射到 props 中的内容
  * dispatchProps， dispatch 映射到 props 中的内容。
  * ownProps 组件本身的 props
  当未传递时，默认的合并规则为
  { ...ownProps, ...stateProps, ...dispatchProps }

  */
 /* 经过代理包装后的 mapStateToProps,完成传入store等操作*/
  const initMapStateToProps = mapStateToPropsFactory(mapStateToProps)
  /* 经过代理包装后的 mapDispatchToProps，完成传入store.dispatch等操作*/
  const initMapDispatchToProps = mapDispatchToPropsFactory(mapDispatchToProps)
  /* 经过代理包装后的 mergeProps，用于形成真正的 mergeProps函数，合并业务组件的 props , state 映射的 props , dispatch 映射的 props */
  const initMergeProps = mergePropsFactory(mergeProps)

  const shouldHandleStateChanges = Boolean(mapStateToProps)

  //默认的高阶组件connectAdvanced，实际渲染的组件是其中返回的一个ConnectFunction
	//selectorFactory为整合connect更新过程中的形成新props的主要函数
	//selectorFactory为后面的finalPropsSelectorFactory
  const wrapWithConnect: AdvancedComponentDecorator<
    TOwnProps,
    WrappedComponentProps
  > = (WrappedComponent) => {
    ...
  }
}

```
- 当我们不向connect传递第三个参数mergeProps 的时候，默认的defaultMergeProps如下，作为新的 props 传递给了业务组件

```ts
export function defaultMergeProps(stateProps, dispatchProps, ownProps) {
  return { ...ownProps, ...stateProps, ...dispatchProps }
}
```



## selectorFactory
![](http://t-blog-images.aijs.top/img/20220525101153.webp)
- 首先得到真正connect 经过一层代理函数 mapStateToProps ,mapDispatchToProps ,mergeProps
- 然后调用selectorFactory (在pure模式下，selectorFactory 就是 pureFinalPropsSelectorFactory )
```ts
export default function finalPropsSelectorFactory(
  dispatch,
  { initMapStateToProps, initMapDispatchToProps, initMergeProps, ...options }
) {
  // mapStateToProps mapDispatchToProps mergeProps 为真正connect 经过一层代理的 proxy 函数
  const mapStateToProps = initMapStateToProps(dispatch, options)
  const mapDispatchToProps = initMapDispatchToProps(dispatch, options)
  const mergeProps = initMergeProps(dispatch, options)

  //默认pure为true，selectorFactory默认为pureFinalPropsSelectorFactory
  const selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory
   // 返回一个 函数用于生成新的 props 
  return selectorFactory(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    dispatch,
    options
  )
}

```

## pureFinalPropsSelectorFactory
![](http://t-blog-images.aijs.top/img/20220525100640.webp)
- 如果是第一次，那么直接调用mergeProps合并ownProps,stateProps,dispatchProps 形成最终的props。
- 如果不是第一次，那么判断到底是props还是 store.state 发生改变，然后针对那里变化，重新生成对应的props，最终合并到真正的props
- 整个 selectorFactory 逻辑就是形成新的props传递给我们的业务组件。

```ts
/** pure组件处理 ， 对比 props 是否发生变化 然后 合并props */
export function pureFinalPropsSelectorFactory(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  dispatch,
  { areStatesEqual, areOwnPropsEqual, areStatePropsEqual } //判断 state prop 是否相等
) {
  let hasRunAtLeastOnce = false
  let state
  let ownProps
  let stateProps
  let dispatchProps
  let mergedProps
 
  /* 第一次 直接形成 ownProps  stateProps  dispatchProps 合并  形成新的 props */
  function handleFirstCall(firstState, firstOwnProps) {
    state = firstState
    ownProps = firstOwnProps
    //获取业务组件中mapStateToProps函数的返回值
    stateProps = mapStateToProps(state, ownProps)
    //获取业务组件中mapDispatchToProps函数的返回值
    dispatchProps = mapDispatchToProps(dispatch, ownProps)
    //合并state、dispatch、组件自身的props，形成最终传递给组件的props
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    hasRunAtLeastOnce = true
    return mergedProps
  }
  
  function handleNewPropsAndNewState() {
    //  props 和 state 都改变  mergeProps 
  }

  function handleNewProps() {
    // props 改变  mergeProps
  }

  function handleNewState() {
     // state 改变 mergeProps
  }

  /*  不是第一次的情况 props 或者 store.state 发生改变的情况。 */
  function handleSubsequentCalls(nextState, nextOwnProps) {
      /* 判断两次 props 是否相等 */
    const propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps) 
      /* 判断两次 store.state 是否相等 */
    const stateChanged = !areStatesEqual(nextState, state)
    state = nextState
    ownProps = nextOwnProps
    
    //根据改变的类型不同，返回对应合并策略下的props
    if (propsChanged && stateChanged) return handleNewPropsAndNewState()
    if (propsChanged) return handleNewProps()
    if (stateChanged) return handleNewState()
    return mergedProps
  }
  
  //根据是否第一次形成props，执行对应方法
  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce
      ? handleSubsequentCalls(nextState, nextOwnProps)
      : handleFirstCall(nextState, nextOwnProps)
  }
}

```
## connectHOC

```tsx
const mapStateToProp = (store) => ({ userInfo: store.root.userInfo })

function Index(){
    /* ..... */
    return <div> { /* .... */ } </div>
}
export default connect(mapStateToProp)(Index)


```
- connect(mapStateToProp)===connectAdvanced()

:::details 点击查看更多

- 这部分代码，在8.x.x版本在conncet中直接处理，并没有拆分为单独函数

```ts
export default function connectAdvanced(
  selectorFactory, // 每次 props,state改变执行 ，用于生成新的 props。
  {
    getDisplayName = name => `ConnectAdvanced(${name})`,
    //可能被包装函数（如connect（））重写
    methodName = 'connectAdvanced',
    //如果定义了，则传递给包装元素的属性的名称，指示要呈现的调用。用于监视react devtools中不必要的重新渲染。
    renderCountProp = undefined,
    shouldHandleStateChanges = true,  //确定此HOC是否订阅存储更改
    storeKey = 'store',
    withRef = false,
    forwardRef = false, // 是否 用 forwarRef 模式
    context = ReactReduxContext,// Provider 保存的上下文
    ...connectOptions
  } = {}
) {
  /* ReactReduxContext 就是store存在的context */
  const Context = context
   /* WrappedComponent 为connect 包裹的组件本身  */   
  return  function wrapWithConnect(WrappedComponent){
      // WrappedComponent 被 connect 的业务组件本身
  }
}
```
- 拿到Provider提供的context上下文

:::

## wrapWithConnect

wrapWithConnect作为高阶组件，会返回一个组件，这个组件会对原有的业务组件，进行一系列增强等工作
判断是否是 pure 纯组件模式，如果是用react.memo包裹,这样做的好处是，会向 pureComponent 一样对 props 进行浅比较
如果 connect 有forwardRef配置项，用React.forwardRef处理
```tsx
function wrapWithConnect(WrappedComponent) {
	//WrappedComponent为实际传递的业务组件
    const wrappedComponentName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component'
  
    const displayName = getDisplayName(wrappedComponentName)
    
    //要合并都内容，connectOptions为上一步闭包拿到的内容
    const selectorFactoryOptions = {
      ...connectOptions,
      getDisplayName,
      methodName,
      renderCountProp,
      shouldHandleStateChanges,
      storeKey,
      displayName,
      wrappedComponentName,
      WrappedComponent
    }
    const { pure } = connectOptions
    
    //selectorFactory为finalPropsSelectorFactory
    function createChildSelector(store) {
      // 合并函数 mergeprops 得到最新的props
      // 及默认返回pureFinalPropsSelectorFactory，会根据是否第一次合并、修改类型等进行不同策略等合并以及返回最终都props
      return selectorFactory(store.dispatch, selectorFactoryOptions)
    }
    //判断是否是pure纯组件模式 如果是将用 useMemo 缓存组件提升性能
    const usePureOnlyMemo = pure ? useMemo : callback => callback()
    // 负责更新的容器子组件，可以看作是实际渲染的类组件
    function ConnectFunction (props){
        // props 为 业务组件 真正的 props 
    }
    //如果
    const Connect = pure ? React.memo(ConnectFunction) : ConnectFunction
  
    Connect.WrappedComponent = WrappedComponent
    Connect.displayName = displayName
    /* forwardRef */
    if (forwardRef) {
      const forwarded = React.forwardRef(function forwardConnectRef(
        props,
        ref
      ) {
      	//connect中是否传递了forwardRef选项
        return <Connect {...props} reactReduxForwardedRef={ref} />
      })
  
      forwarded.displayName = displayName
      forwarded.WrappedComponent = WrappedComponent
      //hoistStatics为一个第三方库，负责把一个类中的静态属性拷贝到另一个类中
      return hoistStatics(forwarded, WrappedComponent)
    }
  
    return hoistStatics(Connect, WrappedComponent)
  }
}
```

## 为何要传递forwardRef？
```tsx
connect(mapStateToProp,mapDispatchToProps,mergeProps,{ forwardRef:true  })(Child)
```

如果不传递，而是在其他组件中直接放ref到使用了connect的组件，则ref实际应用到的是ConncectFunction组件，而非真正的WrappedComponent组件
所以react-redux提供forwardRef选项，使用React.forwardRef，将ref实际放到真正的WrappedComponent上

## ConnectFunction
- 实际渲染的组件
```tsx
  function ConnectFunction(props) {
      /* TODO:  第一步 把 context ForwardedRef props 取出来 */
      //取出forwardRef和传递给ConnectFunction的所有除forwardRef的props
      //除了forwardRef以外的props也就是实际业务代码中传递给conncec包裹组件都props
      const [
        reactReduxForwardedRef,
        wrapperProps // props 传递的props
      ] = useMemo(() => {
        const { reactReduxForwardedRef, ...wrapperProps } = props
        return [reactReduxForwardedRef, wrapperProps]
      }, [props])
   
  	  // 获取上层Provider提供的context，多个Provider只会取最近的Provider
      // 获取 context内容 里面含有  redux 中store 和 subscription
      const contextValue = useContext(Context)

      //TODO: 判断 store 是否来自props  didStoreComeFromProps ,正常情况下 ，prop 中是不存在 store 所以  didStoreComeFromProps = false
      const didStoreComeFromProps =
        Boolean(props.store) &&
        Boolean(props.store.getState) &&
        Boolean(props.store.dispatch)
      //store是否来自Provider提供的上下文
      const didStoreComeFromContext =
        Boolean(contextValue) && Boolean(contextValue.store)
  
      //根据两种情况获取store
      const store = didStoreComeFromProps ? props.store : contextValue.store
       
       //返回merge函数 用于生成真正传给子组件 props
      const childPropsSelector = useMemo(() => {
      	//默认情况下pure为true，返回的是pureFinalPropsSelectorFactory
        return createChildSelector(store)
      }, [store])


      // TODO:  第二步  创建connect组件自身的subscription 监听者实例  
      const [subscription, notifyNestedSubs] = useMemo(() => {
          // 如果没有订阅更新，那么直接返回，默认情况下开启了订阅
        if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY
  		//为每一个conncet的组件创建订阅器，获取上层Provider提供的contextValue.subscription
  		//connct的组件获取的是上层的Provder提供的subscription，有多个Provider，只会取层级最近的一个
  		//所以connect中的connect组件，获取到的是离它最近的Provider中的订阅器，通过它来管理自身的listener更新函数
        const subscription = new Subscription(
          store,
          didStoreComeFromProps ? null : contextValue.subscription // 和 上级 `subscription` 建立起关系。 this.parentSub = contextValue.subscription
        )
        // notifyNestedSubs 触发 noticy 所有子代 listener 监听者 -> 触发batch方法,触发 batchupdate方法 ,批量更新
        //并更新一下this指向
        const notifyNestedSubs = subscription.notifyNestedSubs.bind(
          subscription
        )
  
        return [subscription, notifyNestedSubs]
      }, [store, didStoreComeFromProps, contextValue])

      /*  创建出一个新的contextValue ,把父级的 subscription 换成自己的 subscription   */
      const overriddenContextValue = useMemo(() => {   
        if (didStoreComeFromProps) { 
          return contextValue
        }
        //默认情况下，返回自身的订阅器以及redux中的store给自身的子代connect中获取
        return {
          ...contextValue,
          subscription
        }
      }, [didStoreComeFromProps, contextValue, subscription])
      
      //定义了一个useReducer，当actualChildProps变化时，调用dispatch方法forceComponentUpdateDispatch进行组件更新
      const [
        [previousStateUpdateResult], //调用dispatch更新后的内容
        forceComponentUpdateDispatch  /*  */
      ] = useReducer(storeStateUpdatesReducer, EMPTY_ARRAY, initStateUpdates)
  

      // TODO: 第三步缓存组件本次的props等内容，在下一次组件更新时做比较
      const lastChildProps = useRef() //保存上一次 合并过的 props信息（经过 ownprops ,stateProps , dispatchProps 合并过的 ）
      const lastWrapperProps = useRef(wrapperProps) //保存本次业务组件的 props 
      const childPropsFromStoreUpdate = useRef() //用来保存更新后的最新的props
      const renderIsScheduled = useRef(false) // 当前组件是否处于渲染阶段
      
      // actualChildProps 为当前真正处理过后，经过合并的 props
      const actualChildProps = usePureOnlyMemo(() => {
          // 调用 mergeProps 进行合并，返回合并后的最新 porps
          //及调用pureFinalPropsSelectorFactory后的合并结果
        return childPropsSelector(store.getState(), wrapperProps)
      
      	 //会在store、调用了checkForUpdates、传递给组建的props发生变化后，重新计算获取合并后的props 
      }, [store, previousStateUpdateResult, wrapperProps])

     /* 负责更新缓存变量，方便下一次更新的时候比较 */
      useEffect(()=>{
        captureWrapperProps(...[
            lastWrapperProps,
            lastChildProps,
            renderIsScheduled,
            wrapperProps,
            actualChildProps,
            childPropsFromStoreUpdate,
            notifyNestedSubs
         ])
      })
      
      //实际订阅更新组件的地方
      useEffect(()=>{
          subscribeUpdates(...[
          shouldHandleStateChanges,
          store,
          subscription,
          childPropsSelector,
          lastWrapperProps,
          lastChildProps,
          renderIsScheduled,
          childPropsFromStoreUpdate,
          notifyNestedSubs,
          forceComponentUpdateDispatch
         ])
      },[store, subscription, childPropsSelector])



      // TODO: 第四步：渲染实际挂载的组件，通过useMemo进行组件的缓存
      const renderedWrappedComponent = useMemo(
        () => (
          <WrappedComponent
            {...actualChildProps}
            ref={reactReduxForwardedRef}
          />
        ),
        //当actualChildProps发生变化的时候重新渲染组件
        //这里就是组件重新渲染的原因：主要通过监听actualChildProps的变化
        [reactReduxForwardedRef, WrappedComponent, actualChildProps]
      )
      // 将上一步的renderedWrappedComponent包裹一层Provider
      // 提供该connect组件自身的订阅器、store给子代中的connect组件获取
      const renderedChild = useMemo(() => {
        //shouldHandleStateChanges 来源 connect是否有第一个参数
        if (shouldHandleStateChanges) {
          return (
            // ContextToUse 传递 context 
            <ContextToUse.Provider value={overriddenContextValue}>
              {renderedWrappedComponent}
            </ContextToUse.Provider>
          )
        }
  
        return renderedWrappedComponent
      }, [ContextToUse, renderedWrappedComponent, overriddenContextValue])
  
      return renderedChild
    }


```

- 创建该connect组件自身的subscription, 并使用Provider包裹，层层传递新的context(很重要)
- 所以connect组件的子代connect组件，获取到的都是其上层最近的connect提供的Provider中的订阅器，然后将更新函数checkForUpdates放进其中管理
- 然后通过 useMemo 创建出一个新的 contextValue ,把父级的 subscription 换成自己的 subscription。用于通过 Provider 传递新的 context
- 接下来通过useReducer制造出真正触发更新的forceComponentUpdateDispatch 这个dispatch函数。也就是整个 state 或者是 props改变，触发组件更新的函数，这个函数放进checkForUpdates中执行

## captureWrapperProps
- 进行内容缓存，为了下次组件更新进行比较
```ts
//获取包装的props 
function captureWrapperProps(
  lastWrapperProps,
  lastChildProps,
  renderIsScheduled,
  wrapperProps,
  actualChildProps,
  childPropsFromStoreUpdate,
  notifyNestedSubs
) {
  lastWrapperProps.current = wrapperProps  //子props 
  lastChildProps.current = actualChildProps //经过 megeprops 之后形成的新prop
  renderIsScheduled.current = false  // 当前组件渲染完成
}

```

## subscribeUpdates
- 实际添加更新回调的地方
```ts
function subscribeUpdates(
  shouldHandleStateChanges,
  store,
  subscription,
  childPropsSelector,
  lastWrapperProps,  //子props 
  lastChildProps, //经过 megeprops 之后形成的 prop
  renderIsScheduled,
  childPropsFromStoreUpdate,
  notifyNestedSubs,
  forceComponentUpdateDispatch
) {
  if (!shouldHandleStateChanges) return

   // 捕获值以检查此组件是否卸载以及何时卸载
  let didUnsubscribe = false
  let lastThrownError = null
   //store更新订阅传播到此组件时，运行此回调
  const checkForUpdates = ()=>{
      //....
  }
  //将checkForUpdates作为listener
  subscription.onStateChange = checkForUpdates
  //开启订阅者 ，当前是被connect 包转的情况 会把 当前的 checkForceUpdate 放在存入 父元素的addNestedSub中。
  subscription.trySubscribe()
  //在第一次呈现之后从存储中提取数据，以防存储从我们开始就改变了。
  //确保获取到的最新的store.getState,然后判断是否更新组件
  checkForUpdates()
  /* 卸载订阅起 */
  const unsubscribeWrapper = () => {
    didUnsubscribe = true
    subscription.tryUnsubscribe()
    subscription.onStateChange = null
  }

  return unsubscribeWrapper
}

```

- 首先声明 store 更新订阅传播到此组件时的回调函数checkForUpdates把它赋值给onStateChange,如果store中的state发生改变，那么在组件订阅了state内容之后，相关联的state改变就会触发当前组件的onStateChange,来合并得到新的props
- subscription.trySubscribe()把订阅函数onStateChange绑定给父级subscription,进行了层层订阅
- 为了确保拿到的store内容是最新的，所以首先执行了一次checkForUpdates
![](https://img-blog.csdnimg.cn/d03af8b00dcd4deaad5bcb09c5cc2903.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA56We5aWH5aSn5Y-U,size_20,color_FFFFFF,t_70,g_se,x_16)
## checkForUpdates
- 判断是否需要更新的函数
```tsx
  //store更新订阅传播到此组件时，运行此回调
  const checkForUpdates = () => {
    if (didUnsubscribe) {
      //如果取消订阅了
      return
    }
     // 获取 store 里state
    const latestStoreState = store.getState()q
    let newChildProps, error
    try {
      /* 得到最新的 props */
      newChildProps = childPropsSelector(
        latestStoreState,
        lastWrapperProps.current
      )
    } 
    //如果新的合并的 props没有更改，则此处不做任何操作-层叠订阅更新
    if (newChildProps === lastChildProps.current) { 
      if (!renderIsScheduled.current) {  
        notifyNestedSubs() /* 通知子代 subscription 触发 checkForUpdates 来检查是否需要更新。 */
      }
    } else {
      lastChildProps.current = newChildProps
      childPropsFromStoreUpdate.current = newChildProps
      renderIsScheduled.current = true
      // 触发useReducer的dispatch来进行更新，该dispatch会改变useReducer返回的previousStateUpdateResult
      // 而previousStateUpdateResult是作为actualChildProps的依赖项引发actualChildProps的改变
      // actualChildProps又是实际渲染组件的依赖性，从而引发组件的重新渲染更新
      forceComponentUpdateDispatch({
        type: 'STORE_UPDATED',
        payload: {
          error
        }
      })
    }
  }
```

- checkForUpdates 通过调用 childPropsSelector来形成新的props,然后判断之前的 prop 和当前新的 prop 是否相等。如果相等，证明没有发生变化,无须更新当前组件，那么通过调用notifyNestedSubs来通知子代容器组件，检查是否需要更新。如果不相等证明订阅的store.state发生变化，那么立即执行forceComponentUpdateDispatch来触发组件的更新

## 整个订阅流程

整个订阅的流程是，如果被connect包裹，并且具有第一个参数。首先通过context获取最近的 subscription，然后创建一个新的subscription,并且和父级的subscription建立起关联。当第一次hoc容器组件挂在完成后，在useEffect里，进行订阅，将自己的订阅函数checkForUpdates,作为回调函数，通过trySubscribe 和this.parentSub.addNestedSub ,加入到父级subscription的listeners中。由此完成整个订阅流程

## 整个发布流程

整个更新流程是，当组件中调用dispatch触发了redux的state改变和redux的订阅器，从而触发根订阅器的触发listeners.notify ,也就是checkForUpdates函数，然后checkForUpdates函数首先根据mapStoretoprops，mergeprops等操作，验证该组件是否发起订阅，props 是否改变，并更新，如果发生改变，那么触发useReducer的forceComponentUpdateDispatch函数，来更新业务组件，如果没有发生更新，那么通过调用notifyNestedSubs,来通知当前subscription的listeners检查是否更新，然后尽心层层checkForUpdates,逐级向下，借此完成整个更新流程。

## 总结
- connect使用柯里化
- useMemo缓存渲染组件的操作
- 发布订阅模式以及通过双向链表来管理
- 如何通过Provider进行层层订阅
- react-redux触发更新的依据是actualChildProps是否改变

## 参考
[react-redux源码解析](https://blog.csdn.net/weixin_43294560/article/details/123284317)
[github 源码](https://github.com/841660202/react-redux)
[React-redux源码解析--准备知识](https://blog.csdn.net/qq_33715850/article/details/122535984)
[React-redux源码解析](https://blog.csdn.net/qq_33715850/article/details/122590433)