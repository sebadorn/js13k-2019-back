'use strict';


Renderer.init( () => {
	Audio.init( () => {
		Input.init();

		Renderer.level = new Level_Start();
		Renderer.mainLoop();
	} );
} );
