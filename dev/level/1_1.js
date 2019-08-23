'use strict';


/**
 * Episode 1: How to send back a Ghost
 * Phase 1: Gathering supplies
 * Scene: Kitchen
 */
class Level_1_1 extends Level {


	/**
	 *
	 * @constructor
	 * @extends {Level}
	 */
	constructor() {
		super();

		this.ui_text = new UI_Text( 'How to send back a Ghost', 'bold 50px sans-serif', [255, 255, 255], 100, 300 );
	}


	/**
	 *
	 * @override
	 */
	draw( ctx ) {
		this.ui_text.draw( ctx );
	}


	/**
	 *
	 * @override
	 */
	update( dt ) {
		//
	}


}
