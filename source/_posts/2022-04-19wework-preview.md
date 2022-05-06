---
title: 企业微信： 图片附件无法预览的问题
categories: WeWork
tags: [WeWork]
---

![](http://t-blog-images.aijs.top/img/11460713-13685d46ead24558.png)
- 背景：安卓预览正常，部分iOS预览有问题（大部分手机都是正常的）
```
downloadAttachment(downloadUrl).then(res => {
      if (getWechatUserAgent(navigator.userAgent)) { // 判断是企业微信
        const blob = new Blob([res]);
        wx.previewFile({
          url: location.origin + downloadUrl, // 需要预览文件的地址(必填，可以使用相对路径)
          name: attachment.name, // 需要预览文件的文件名，必须有带文件格式的后缀，例如.doc(不填的话取url的最后部分，最后部分是个包含格式后缀的文件名)
          size: blob.size // 需要预览文件的字节大小(必填，而且大小必须正确，否则会打开失败)
        });
        Toast.loading(i18n.loading, false)
        return
      }
      var reader = new FileReader();
      reader.readAsDataURL(res);   // 转换为base64，可以直接放入a标签href
      reader.onload = function (e) {
        const anchorEle = document.createElement('a')
        document.body.appendChild(anchorEle)
        anchorEle.href = e?.target?.result as any
        anchorEle.download = attachment.name
        anchorEle.click()
        document.body.removeChild(anchorEle)
      }
      Toast.loading(i18n.loading, false)
    }).catch(() => {
      Toast.loading(i18n.loading, false)
    })
```
`自研移动端`、`web端`、`企业微信桌面端`都没问题，当然喽，每一个端展示效果是不一样的，代码也不一样。排查了耗费一定时间。
1.  排查 企业微信版本， 比对后发现，和正常使用的微信版本一致
2.  排查手机版本不一致，客户iphone12和 系统版本15.1，我们开发人员是14.+，所以我把我的手机升级到最新，我的手机升级后是正常的，那么可能是数据问题，数据
3.  排查数据，这是老系统的数据，和新系统数据走不同的业务代码，经排查也没问题
4.  排查`size`如果不准确也会出现上述问题，由于预发环境获取票据的信息与线上是不一致的，所以无法在预发进行排查，能做的事保证代码执行到` const blob = new Blob([res]);`，并且能够获取到正确的size，所以进行了alert调试，这个在手机上比较直观，当然也可以`vconsole`【暂不考虑,因为之前开发人员没加，部门被砍掉，很多人被裁员了，所有项目都我来维护，没时间，不整了】，调试结果是size: 88214,各个手机都一样，用户手机也是88214，故排除size
5.  最后可能问题在于，用户手机上版本与手机不匹配，有兼容性bug，尝试升级企业微信，最后解决

<br/>

总结：如果考虑直接升级用户app版本，或许在第三步就解决问题了，我的iphoneX也不用升级到15.3了