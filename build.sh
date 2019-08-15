#!/usr/bin/env bash

cd $(dirname "$0")

TERSER="$HOME/.node/bin/terser"

if [ -d 'build' ]; then
	rm -r 'build'
fi

mkdir 'build'
mkdir 'build/assets'

cp 'dev/index-dev.html' 'build/'
cp dev/*.js 'build/'
cp dev/assets/*.png 'build/assets/'

cd 'build' > '/dev/null'

tr -d '\n' < 'index-dev.html' > 'index.html'
sed -i'' 's/init\.js/i.js/' 'index.html'
sed -i'' 's/<script src="Input\.js"><\/script>//' 'index.html'
sed -i'' 's/<script src="Renderer\.js"><\/script>//' 'index.html'

$TERSER 'Input.js' 'Renderer.js' 'init.js' \
	--ecma 6 --compress --mangle --toplevel \
	-o 'i.js'

sed -i'' 's/^"use strict";//' 'i.js'

pngquant --quality=100 assets/*.png --ext .png -f

rm 'index-dev.html'
rm 'init.js'
rm 'Input.js'
rm 'Renderer.js'

zip -q -r back.zip ./*

echo '  - Max size: 13312 bytes'
stat --printf="  - ZIP size: %s bytes\n" back.zip

echo '  - Done.'
