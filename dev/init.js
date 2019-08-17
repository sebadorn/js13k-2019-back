'use strict';


window.addEventListener( 'load', () => {
	document.querySelector( 'title' ).textContent = Lang.title;

	Audio.init();
	Input.init();
	Renderer.init();

	Renderer.level = new Level_Start();
	Renderer.mainLoop();
} );
