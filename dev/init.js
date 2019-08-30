'use strict';


Renderer.ASSETS = 'assets/';

Renderer.init( () => {
	GameAudio.init( () => {
		Input.init();

		Renderer.level = new Level_Start();
		Renderer.mainLoop();
	} );
} );
