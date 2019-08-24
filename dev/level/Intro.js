'use strict';


class Level_Intro extends Level {


	/**
	 *
	 * @constructor
	 * @extends {Level}
	 */
	constructor() {
		super();

		this.ui_text = new UI_Text( '_Intro', 'bold 50px sans-serif', [255, 255, 255], 100, 300 );
		this.timer = 1; // [s]
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		this.ui_text.draw( ctx );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.timer -= dt / Renderer.TARGET_FPS;

		if( this.timer <= 0 ) {
			Renderer.changeLevel( new Level_1_1() );
		}
	}


}
