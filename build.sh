#!/usr/bin/env bash

cd $(dirname "$0")

OUT_FILE='back.zip'
MAX_SIZE=13312
TERSER="$HOME/.node/bin/terser"

if [ -d 'build' ]; then
	rm -r 'build'
fi

mkdir -p 'build/assets'
mkdir -p 'build/level'
mkdir -p 'build/ui'

cp 'dev/index-dev.html' 'build/'
cp dev/*.js 'build/'
cp dev/level/*.js 'build/level/'
cp dev/ui/*.js 'build/ui/'
# cp dev/assets/*.png 'build/assets/'

cd 'build' > '/dev/null'

# Remove line-breaks from HTML file.
tr -d '\n' < 'index-dev.html' > 'index.html'

# Remove the single JS files and only include the minified one.
sed -i'' 's/init\.js/i.js/' 'index.html'
sed -E -i'' 's/<script src="([a-zA-Z0-9]+\/)?[a-zA-Z0-9]{2,}\.js"><\/script>//g' 'index.html'

# Minify and combine the JS files.
$TERSER \
	'Audio.js' \
	'Input.js' \
	'Lang.js' \
	'Level.js' \
	'level/Start.js' \
	'level/Intro.js' \
	'level/1_1.js' \
	'Player.js' \
	'Renderer.js' \
	'ui/Bar.js' \
	'ui/Text.js' \
	'init.js' \
	--ecma 6 --warn \
	--compress --mangle --mangle-props --toplevel \
	-o 'i.js'

sed -i'' 's/^"use strict";//' 'i.js'

# Try to minify the PNG assets.
# pngquant --quality=80-100 assets/*.png --ext .png -f

rm 'index-dev.html'
find -type f -name '*.js' -not -name 'i.js' -delete

# ZIP everything needed up.
# 9: highest compression level
zip -9 -q -r "$OUT_FILE" ./*

CURRENT_SIZE=$( stat --printf="%s" "$OUT_FILE" )
printf '  - Max size: %5d bytes\n' "$MAX_SIZE"
printf '  - ZIP size: %5d bytes\n' "$CURRENT_SIZE"

echo '  - Done.'