'use strict';


Renderer.ASSETS = 'assets/';

Renderer.init( () => {
	GameAudio.init( () => {
		Input.init();

		new Level_Start(); // TODO:
		Renderer.level = new Level_1_1();
		Renderer.mainLoop();
	} );
} );
