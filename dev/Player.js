'use strict';


class Player {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		this.x = 0;
		this.y = 0;
		this.width = 160;
		this.height = 260;
		this.speed = 10;
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		ctx.fillStyle = '#FF0000';
		ctx.fillRect( this.x, this.y, this.width, this.height );
	}


	/**
	 * Move the character.
	 * @param {object} dir
	 * @param {number} dir.x
	 */
	move( dir ) {
		this.x += Math.round( dir.x * this.speed );
	}


}
