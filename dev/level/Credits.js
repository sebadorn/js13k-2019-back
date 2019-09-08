'use strict';


class Level_Credits {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		this.progress = 0;
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		ctx.fillStyle = '#000';
		ctx.fillRect( 0, 0, window.innerWidth, window.innerHeight );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.progress += dt;
	}


}
