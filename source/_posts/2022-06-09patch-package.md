---
title: 修补node_modules下源码
date: 2022-06-09 09:51:48
categories: 工具
tags: [npm]
cover: http://t-blog-images.aijs.top/img/20220609160539.webp

---

## 背景

之前在简书上记录过，没迁移简书文章，所以重新记录

由于`hexo-theme-aurora`代码配色不是很友好，需要自定义配色，又不想改其 github 上代码，直接处理`node_modules`下的配色文件

## 安装 patch-package

patch-package 包可以通过 npm 进行安装。

```shell
npm i patch-package --save-dev
```

或者也可以通过 yarn 进行安装。

```shell
yarn add patch-package -D
```

## 修改包代码

```shell
/node_modules/某包名下，按需修改
```

## 创建补丁

在修改依赖包内容后，就可以运行 patch-package 创建 patch 文件了。

```shell
yarn patch-package 包名 # 使用 yarn
```

运行后通常会在项目根目录下的 patches 目录中创建一个名为 包名+version.patch 的文件。将该 patch 文件提交至版本控制中，即可在之后应用该补丁了。
例如：

```shell
👑 ~/Desktop/other/blog/technology-blog git:(main) ✗ $ yarn patch-package hexo-theme-aurora
yarn run v1.4.0
$ /Users/haotian/Desktop/other/blog/technology-blog/node_modules/.bin/patch-package hexo-theme-aurora
patch-package 6.4.7
• Creating temporary folder
• Installing hexo-theme-aurora@1.5.5 with yarn
• Diffing your files with clean files
✔ Created file patches/hexo-theme-aurora+1.5.5.patch

💡 hexo-theme-aurora is on GitHub! To draft an issue based on your patch run

    yarn patch-package hexo-theme-aurora --create-issue

✨  Done in 5.48s.
```

## 配置 npm 脚本钩子

完成上述操作后，最后还需要修改 package.json 的内容，在 scripts 中加入"postinstall": "patch-package"。

```
"scripts": {
  "postinstall": "patch-package"
}
```

## 验证

## 清理 node_modules

**项目根目录**别搞错了,简单粗暴点，直接全清掉

```shell
rm -rf node_modules && yarn
```

## 运行结果

```shell
👑 ~/Desktop/other/blog/technology-blog git:(main) ✗ $ yarn
yarn install v1.4.0
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
warning "hexo > nunjucks@3.2.3" has unmet peer dependency "chokidar@^3.3.0".
warning "hexo-browsersync > browser-sync > socket.io > engine.io > ws@8.2.3" has unmet peer dependency "bufferutil@^4.0.1".
warning "hexo-browsersync > browser-sync > socket.io > engine.io > ws@8.2.3" has unmet peer dependency "utf-8-validate@^5.0.2".
warning "hexo-renderer-marked > jsdom@19.0.0" has unmet peer dependency "canvas@^2.5.0".
warning "hexo-renderer-marked > jsdom > ws@8.5.0" has unmet peer dependency "bufferutil@^4.0.1".
warning "hexo-renderer-marked > jsdom > ws@8.5.0" has unmet peer dependency "utf-8-validate@^5.0.2".
warning "hexo-theme-aurora > pinia@2.0.13" has unmet peer dependency "@vue/composition-api@^1.4.0".
warning "hexo-theme-aurora > pinia@2.0.13" has unmet peer dependency "typescript@>=4.4.4".
warning "hexo-theme-aurora > pinia > vue-demi@0.12.5" has unmet peer dependency "@vue/composition-api@^1.0.0-rc.1".
[4/4] 📃  Building fresh packages...
$ yarn patch-package # 看这里，在运行修补
yarn run v1.4.0
$ /Users/haotian/Desktop/other/blog/technology-blog/node_modules/.bin/patch-package
patch-package 6.4.7
Applying patches...
hexo-theme-aurora@1.5.5 ✔
✨  Done in 1.00s.
✨  Done in 13.93s.

```

## 提交代码

将 patches 提交到代码仓库，以后在其他机器上，直接安装依赖包即可。

## 注意事项

```shell
npx patch-package hexo-theme-aurora
```

这个命令使用 npm 运行的，可能不会成功，使用`yarn patch-package hexo-theme-aurora`

```shell
👑 ~/Desktop/other/blog/technology-blog git:(main) ✗ $ npx patch-package  hexo-theme-aurora
patch-package 6.4.7
• Creating temporary folder
• Installing hexo-theme-aurora@1.5.5 with yarn
warning package.json: No license field
warning No license field
error An unexpected error occurred: "https://registry.npmjs.org/axios: ETIMEDOUT".
Error: https://registry.npmjs.org/core-js: ETIMEDOUT
    at Timeout._onTimeout (/usr/local/lib/node_modules/yarn/lib/cli.js:132130:19)
    at listOnTimeout (node:internal/timers:557:17)
```

## 参考链接

[hexo-theme-aurora/issues/168](https://github.com/auroral-ui/hexo-theme-aurora/issues/168)
[patch-package](https://www.npmjs.com/package/patch-package)