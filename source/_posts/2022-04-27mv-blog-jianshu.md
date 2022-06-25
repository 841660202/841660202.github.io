---
title: 简书迁移到OSS
categories: 工具
tags: [Shell]
date: 2015-11-12 10:55:47
---
## 命令
```
cat ./* |grep uploadimages.jianshu.io > image.txt
mkdir img3d
cd img3d
wget -i ../image.txt
sed -i'' -e 's/!\[image.png\](//g' image.txt
sed -i'' -e 's/)//g' image.txt
```
## 迁移简书图片下载后重命名
```
#! /bin/sh

for eachfile in `ls -B`
do  
  # echo ${eachfile%%\%3F*} # 截掉最后.txt    # $ % https://www.jianshu.com/p/b3bdc3b3968e
  filename=${eachfile%%\%3F*}
  filehead=`echo $eachfile | awk -F \%3F '{print $1 }'`
  filelast=`echo $eachfile | awk -F \%3F '{print $2 }'`
  # mv $filename.txt ${filelast}_$filehead.txt
  # https://baijiahao.baidu.com/s?id=1726788915185806701&wfr=spider&for=pc
  echo '--'
  # echo $filename
  echo $filehead #分割字符左边部分
  echo $filelast #分割字符右边部分
  # 右边文件存在的情况下才处理
  if [ "$filelast" != "" ]
  then
    echo '执行rename '
    mv $eachfile $filehead
  fi

done
```
