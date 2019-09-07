'use strict';


Renderer.ASSETS = 'assets/';

Renderer.init( () => {
	GameAudio.init( () => {
		Input.init();

		new Level_Intro();
		Renderer.level = new Level_1_1( { success: false } );
		Renderer.mainLoop();
	} );
} );
