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

		ctx.fillStyle = '#FFF';
		let x = Renderer.centerX - 300;
		let y = Math.round( window.innerHeight + 10 - this.progress );

		for( let i = 0; i < 10; i++ ) {
			ctx.fillRect( x, y, 300, 10 );
			y += 20;
		}
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.progress += dt;
	}


}
