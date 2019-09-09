'use strict';


Renderer.ASSETS = 'assets/';

Renderer.init( () => {
	GameAudio.init( () => {
		Input.init();

		new Level_Intro();
		// let level = new Level_Intro();
		// Renderer.changeLevel( new Level_1_1( { success: true } ) );
		Renderer.changeLevel( new Level_Intro() );
		Renderer.mainLoop();
	} );
} );
