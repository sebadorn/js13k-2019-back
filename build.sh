#!/usr/bin/env bash

cd $(dirname "$0")

OUT_FILE='back.zip'
MAX_SIZE=13312
TERSER="$HOME/.node/bin/terser"

if [ -d 'build' ]; then
	rm -r 'build'
fi

# mkdir -p 'build/assets'
mkdir -p 'build/level'
mkdir -p 'build/rhythm'
mkdir -p 'build/ui'

cp 'dev/index-dev.html' 'build/'
cp dev/*.js 'build/'
cp dev/level/*.js 'build/level/'
cp dev/rhythm/*.js 'build/rhythm/'
cp dev/ui/*.js 'build/ui/'
cp dev/assets/*.gif 'build/'

cd 'build' > '/dev/null'

# Remove line-breaks from HTML file.
tr -d '\n' < 'index-dev.html' > 'index.html'

# Change asset path.
sed -E -i'' "s/ASSETS = '[a-zA-Z0-9_\/]+';/ASSETS = '';/" 'init.js'

# Remove the single JS files and only include the minified one.
sed -i'' 's/init\.js/i.js/' 'index.html'
sed -E -i'' 's/<script src="([a-zA-Z0-9_-]+\/)?[a-zA-Z0-9_.-]{2,}\.js"><\/script>//g' 'index.html'

# Minify and combine the JS files.
$TERSER \
	'GameAudio.js' \
	'Input.js' \
	'Item.js' \
	'Level.js' \
	'level/Start.js' \
	'level/Intro.js' \
	'level/1_1.js' \
	'level/1_2.js' \
	'Player.js' \
	'Renderer.js' \
	'Rhythm.js' \
	'rhythm/Button.js' \
	'ui/Symbol.js' \
	'ui/Text.js' \
	'player-small.js' \
	'init.js' \
	--ecma 6 --warn \
	--compress --mangle --toplevel \
	--mangle-props keep_quoted,reserved=[imageSmoothingEnabled,TinyMusic] \
	-o 'i.js'

sed -i'' 's/^"use strict";//' 'i.js'

rm 'index-dev.html'
find -type f -name '*.js' -not -name 'i.js' -delete
find -type d -not -name '.' -not -name 'assets' -delete

# ZIP everything needed up.
# 9: highest compression level
zip -9 -q -r "$OUT_FILE" ./*

CURRENT_SIZE=$( stat --printf="%s" "$OUT_FILE" )
printf '  - Max size: %5d bytes\n' "$MAX_SIZE"
printf '  - ZIP size: %5d bytes\n' "$CURRENT_SIZE"

echo '  - Done.'
