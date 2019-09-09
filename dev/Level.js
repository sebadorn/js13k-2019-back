'use strict';


class Level {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		this.progress = 0;
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.progress += dt / Renderer.TARGET_FPS;
	}


}
