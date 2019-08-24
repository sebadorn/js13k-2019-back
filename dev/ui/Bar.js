'use strict';


class UI_Bar {


	/**
	 *
	 * @constructor
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 */
	constructor( x, y, width, height ) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.total = 100;
		this.value = 100;
	}


	/**
	 * Center bar horizontally on the screen.
	 */
	centerX() {
		this.x = Math.round( ( window.innerWidth - this.width ) / 2 );
	}


	/**
	 * Draw the progress bar.
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		let width = Math.round( this.width * this.value / this.total );

		ctx.fillStyle = '#FF0000';
		ctx.fillRect( this.x, this.y, width, this.height );
	}


}
