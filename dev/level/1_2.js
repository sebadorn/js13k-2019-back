'use strict';


class Level_1_2 extends Level {


	/**
	 * Episode 1: How to send back a Ghost
	 * Phase 2: Rhythm fight
	 * @constructor
	 * @param {Player} player
	 */
	constructor( player ) {
		super();

		this.rhythm = new Rhythm( player.items );
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		this.rhythm.draw( ctx );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.rhythm.update( dt );
	}


}
