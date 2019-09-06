'use strict';


Renderer.ASSETS = 'assets/';

Renderer.init( () => {
	GameAudio.init( () => {
		Input.init();

		new Level_Intro();
		// new Level_1_1();
		Renderer.level = new Level_1_1();
		Renderer.mainLoop();
	} );
} );
