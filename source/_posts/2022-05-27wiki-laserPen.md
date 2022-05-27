---
title: wiki Laser Pen
date: 2022-05-27 16:07:33
categories: wiki
tags: [wiki]
cover: 
---

## Laser Pen
`Laser Pen `是一套用来在 web canvas 上绘制鼠标轨迹的工具集。

## 使用场景
`wiki`全屏演示时候，为了便于听众跟随演讲者进度，给鼠标轨迹加上标记。

![](http://t-blog-images.aijs.top/img/demo.gif)

注：公司项目由于版权问题，不便演示

## 初步上手

首先在你的项目中添加对 Laser Pen 的依赖：
```
yarn add laser-pen
```
或者

```
npm i laser-pen

```
然后监听鼠标的 move 事件，获取鼠标移动轨迹的坐标，并同时记录 move 事件触发时的时间戳。

```js
// 获取 canvas 元素的坐标
const canvasDom = document.querySelector('canvas')
const canvasPos = canvasDom.getBoundingClientRect()
const ctx = canvas.getContext('2d')
// 用来存储所有鼠标轨迹数据
let mouseTrack = []
// 监听鼠标事件
document.addEventListener('mousemove', (event) => {
  mouseTrack.push({
    x: event.clientX - canvasPos.x,
    y: event.clientY - canvasPos.y,
    time: Date.now(),
  })
})

```
最后在调用 drawLaserPen 方法绘制鼠标轨迹

```js
import { drainPoints, drawLaserPen } from 'laser-pen'

function draw() {
  // 过滤掉一些失效的轨迹坐标
  mouseTrack = drainPoints(mouseTrack)
  if (mouseTrack.length >= 3) {
    // 绘制鼠标轨迹
    drawLaserPen(ctx, mouseTrack)
  }
  requestAnimation(draw)
}

```

到这里，你应该已经可以在 canvas 上实现鼠标轨迹的绘制了。

## 参数配置

如果默认的轨迹效果不能满足你的要求，Laser Pen 还提供了一些接口让你可以方便的修改鼠标轨迹的样式。

```js
// 设置延迟时间，mousemove 事件产生的坐标点在超过延迟时间后就不会被绘制，会直接影响轨迹的长度
setDelay: (millisecond: number) => void;
// 设置轨迹的最大宽度，轨迹是一条由粗变细的曲线，maxWidth 表示粗的那一头的线宽
setMaxWidth: (width: number) => void;
// 设置轨迹的最小宽度，轨迹是一条由粗变细的曲线，minWidth 表示细的那一头的线宽
setMinWidth: (width: number) => void;
// 设置曲线张力大小，张力越大拐点处越平滑，反之越尖锐
setTension: (t: number) => void;
// 设置轨迹的最小透明度，轨迹是一条由不透明变透明的曲线，opacity 表示轨迹末尾的不透明度
setOpacity: (o: number) => void;
// 设置轨迹的颜色
setColor: (r: number, g: number, b: number) => void;
// 设置轨迹头部是否是圆形
setRoundCap: (b: boolean) => void;
```

在任何时候调用上述接口修改鼠标轨迹的样式，都会在紧接着的下一次绘制中生效。所以如果你想实现一个类似 RGB 跑马灯的鼠标轨迹也是可以的。

## 定制化开发
如果上面的接口都不能满足你的要求，那么你就需要做一些定制化的开发了。

绘制鼠标轨迹的过程大概分为 5 个步骤：

清洗轨迹坐标数据
根据轨迹坐标计算每个坐标的控制点
通过坐标点和控制点数据生成 Bezier 曲线
将上一步生成的曲线分割为更短的 Bezier 曲线，并计算每条曲线的绘制样式
依次绘制每条 Bezier 曲线
这 5 个步骤对应下面的第 1 到第 5 个接口，最后的 drawLaserPen 接口是对前面 5 个接口的组合。 如果直接调用 drawLaserPen 不能满足你的要求，你可以在前 5 个接口的基础上自行组合，实现你想要的效果。

```js
// 去掉原始鼠标坐标数据中不合理的数据，包括超过延迟时间的坐标，和一些排列不合法的坐标
drainPoints: (originalPoints: IOriginalPointData[]) => IOriginalPointData[];
// 根据鼠标坐标数据计算每个坐标点的前后控制点
calControlPoints: (points: IPoint[]) => IControlPoint[];
// 将鼠标坐标数据和控制点数据组合为贝塞尔曲线
transformPointToBezier: (
  points: IPoint[],
  controlPoints: IControlPoint[]
) => Bezier[];
// 根据原始的贝塞尔曲线数据，计算出用于绘制的数据结构
calDrawingData: (
  bzArray: Bezier[],
  totalLength: number
) => IDrawingBezierData[];
// 根据计算出的绘制数据，将曲线绘制到画布上
drawDrawingBezierData: (
  ctx: CanvasRenderingContext2D,
  data: IDrawingBezierData[]
) => void;
// 一个方便简单使用的入口方法，直接通过处理好的鼠标坐标数据，绘制鼠标轨迹
drawLaserPen: (ctx: CanvasRenderingContext2D, points: IPoint[]) => void;

```
## 其他
- [laser-pen](https://github.com/SilentTiger/laser-pen)
- 突然有个想法：王者荣耀的拖尾效果实现原理，是不是和这个类似？