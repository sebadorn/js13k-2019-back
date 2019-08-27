'use strict';


Input.init();

Renderer.init( () => {
	Renderer.level = new Level_Start();
	Renderer.mainLoop();
} );
