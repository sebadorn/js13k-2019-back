'use strict';


class Player {


	/**
	 * Player.
	 * @constructor
	 * @param {number} size
	 */
	constructor( size ) {
		this.faceX = 0;
		this.faceY = 0;
		this.frameX = 0;
		this.items = [];
		this.lastDir = 0;
		this.orientation = 0;
		this.progress = 0;
		this.size = size;
		this.speed = 8;
		this.x = 0;
		this.y = 0;
	}


	/**
	 * Getter for player height.
	 * @return {number}
	 */
	get height() {
		return this.size * 20;
	}


	/**
	 * Getter for player width.
	 * @return {number}
	 */
	get width() {
		return this.size * 16;
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		let x = this.x;
		let y = this.y;

		if( this.orientation > 0 ) {
			ctx.setTransform( -1, 0, 0, 1, x + this.width, 0 );
			x = 0;
		}

		y += Math.round( ( Math.sin( this.progress * 0.05 ) + 1 ) * this.size * 0.1 );

		this.drawBody( ctx, x, y );
		this.drawFace( ctx, x, y );

		ctx.setTransform( 1, 0, 0, 1, 0, 0 );
	}


	/**
	 * Draw the body (head, torso, legs, no face)
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number}                   x
	 * @param {number}                   y
	 */
	drawBody( ctx, x, y ) {
		let s2 = this.size * 2;
		let s4 = this.size * 4;
		let s16 = this.size * 16;

		// Torso/head
		ctx.fillStyle = '#000';
		ctx.fillRect( x, y + this.size, s16, this.size * 14 );
		ctx.fillRect( x + this.size, y, this.size * 14, s16 );

		// Legs
		// Walking
		if( this.lastDir !== 0 ) {
			ctx.fillRect( x + this.size * 3, this.y + s16, s2, s2 );
			ctx.fillRect( x + this.size * 9, this.y + s16, s2, s2 );

			// Frame 1
			if( ~~this.frameX % 2 ) {
				ctx.fillRect( x + s4, this.y + this.size * 18, s2, this.size );
				ctx.fillRect( x + this.size * 9, this.y + s16, s2, s4 );
			}
			// Frame 0
			else {
				ctx.fillRect( x + this.size *  3, this.y + s16, s2, s4 );
				ctx.fillRect( x + this.size * 10, this.y + this.size * 18, s2, this.size );
			}
		}
		// Standing
		else {
			ctx.fillRect( x + this.size * 3, this.y + s16, s2, s4 );
			ctx.fillRect( x + this.size * 9, this.y + s16, s2, s4 );
		}
	}


	/**
	 * Draw the face.
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number}                   x
	 * @param {number}                   y
	 */
	drawFace( ctx, x, y ) {
		ctx.drawImage( Renderer.sprites.pf, this.faceX, this.faceY, 16, 16, x, y, this.size * 16, this.size * 16 );
	}


	/**
	 * Set the face image coordinate.
	 * @param {number} x
	 * @param {number} y
	 */
	setFace( x, y ) {
		this.faceX = x * 16;
		this.faceY = y * 16;
	}


	/**
	 * Move the character.
	 * @param {number} dt
	 * @param {object} dir
	 * @param {number} dir.x
	 */
	update( dt, dir ) {
		this.progress += dt;

		if( dir.x !== 0 ) {
			this.orientation = ( dir.x < 0 ) ? -1 : 1;
			this.frameX = this.frameX + dt * 0.2;
		}
		else {
			this.frameX = 0;
		}

		this.lastDir = dir.x;
		this.x += Math.round( dir.x * this.speed );
	}


}
