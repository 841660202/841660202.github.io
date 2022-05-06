cat ./* | grep upload-images.jianshu.io > image.txt
mkdir img3d
cd img3d
wget -i ../image.txt