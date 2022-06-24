---
title: ModHeader
date: 2022-05-13 14:59:19
categories: 工具
tags: [工具, Chrome]
cover: 
---
## 通过不同请求头字段标识请求不同的环境
<img src="http://t-blog-images.aijs.top/img/20220513145839.webp" width=400 />

### Requesr Headers
```txt
Accept: */*
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7
Cache-Control: no-cache
Connection: keep-alive
content-type: application/json; charset=utf-8
Cookie: perfLang=zh; 
envtag: ladon-1        
Host: localhost:3119
Pragma: no-cache
Referer: http://localhost:3119/
sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "macOS"
```
### 不生效了
理论上是没问题，应该是由于某些原因导致这个插件内部运行出了问题，具体什么问题不知
*处理：*将浏览器重启动后,请求头`envtag: ladon-1`增加成功