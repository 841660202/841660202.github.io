
#! /bin/sh

for eachfile in `ls -B`
do  
  # echo ${eachfile%%\?*} # 截掉最后.txt    # $ % https://www.jianshu.com/p/b3bdc3b3968e
  filename=${eachfile%%\?*}
  filename=${eachfile%%\?*}
  filehead=`echo $eachfile | awk -F \? '{print $1 }'`
  filelast=`echo $eachfile | awk -F \? '{print $2 }'`
  # mv $filename.txt ${filelast}_$filehead.txt
  # https://baijiahao.baidu.com/s?id=1726788915185806701&wfr=spider&for=pc
  echo '--'
  # echo $filename
  echo $filehead #分割字符左边部分
  echo $filelast #分割字符右边部分
  # # 右边文件存在的情况下才处理
  if [ "$filelast" != "" ]
  then
    echo '执行rename '
    mv $eachfile $filehead
  fi

done
