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
		let over = window.innerWidth * 0.1;

		ctx.fillStyle = '#00F';
		ctx.fillRect( 0, 0, window.innerWidth, window.innerHeight );

		ctx.fillStyle = '#AA0';
		ctx.beginPath();
		ctx.moveTo( 0, 0 );
		ctx.lineTo( window.innerWidth / 2 + over, 0 );
		ctx.lineTo( window.innerWidth / 2 - over, window.innerHeight );
		ctx.lineTo( 0, window.innerHeight );
		ctx.closePath();
		ctx.fill();

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
