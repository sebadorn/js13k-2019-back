'use strict';


Renderer.ASSETS = 'assets/';

Renderer.init( () => {
	GameAudio.init( () => {
		Input.init();

		Renderer.changeLevel( new Level_Intro() );
		Renderer.mainLoop();
	} );
} );
