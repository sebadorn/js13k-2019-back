'use strict';


class Player {


	/**
	 * Player.
	 * @constructor
	 * @param {number} size
	 */
	constructor( size ) {
		this.frameX = 0;
		this.items = [];
		this.lastDir = 0;
		this.orientation = 0;
		this.speed = 8;
		this.x = 0;
		this.y = 0;
		this.size = size;
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		let x = this.x;
		let frameX = 0;
		let frameY = 0;

		if( this.lastDir !== 0 ) {
			frameX = 32 * ~~( this.frameX % 2 );
			frameY = 32;
		}

		let body = 32 * this.size;
		let face = 16 * this.size;

		if( this.orientation > 0 ) {
			ctx.setTransform( -1, 0, 0, 1, x + body, 0 );
			x = 0;
		}

		ctx.drawImage( Renderer.sprites.pl, frameX, frameY, 32, 32, x, this.y, body, body );
		ctx.drawImage( Renderer.sprites.pl, 32, 0, 16, 16, x + 8 * this.size, this.y + 12 * this.size, face, face );

		ctx.setTransform( 1, 0, 0, 1, 0, 0 );
	}


	/**
	 * Move the character.
	 * @param {number} dt
	 * @param {object} dir
	 * @param {number} dir.x
	 */
	update( dt, dir ) {
		if( dir.x !== 0 ) {
			this.orientation = ( dir.x < 0 ) ? -1 : 1;
			this.frameX = this.frameX + dt * 0.25;
		}

		this.lastDir = dir.x;
		this.x += Math.round( dir.x * this.speed );
	}


}
