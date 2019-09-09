'use strict';


class Player {


	/**
	 * Player.
	 * @constructor
	 * @param {number} size
	 */
	constructor( size ) {
		this.color = Renderer.COLOR.BLACK;
		this.face = 0;
		this.frameX = 0;
		this.items = [];
		this.lastDir = 0;
		this.orientationX = 0;
		this.orientationY = 0;
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

		if( this.orientationX > 0 ) {
			ctx.setTransform( -1, 0, 0, 1, x + this.width, 0 );
			x = 0;
		}

		let y = this.y + Math.round( ( Math.sin( this.progress * 0.05 ) + 1 ) * this.size * 0.1 );

		this.drawBody( ctx, x, y );
		this.drawFace( ctx, x, y );

		ctx.setTransform( 1, 0, 0, 1, 0, 0 );
	}


	/**
	 * Draw the body (head, torso, legs, no face).
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number}                   x
	 * @param {number}                   y
	 */
	drawBody( ctx, x, y ) {
		let s2 = this.size * 2;
		let s4 = this.size * 4;
		let s16 = this.size * 16;

		// Torso/head
		ctx.fillStyle = this.color;
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
			// Center legs when facing the viewer.
			if( this.face === 4 ) {
				ctx.fillRect( x + s4, this.y + s16, s2, s4 );
				ctx.fillRect( x + this.size * 10, this.y + s16, s2, s4 );
			}
			else {
				ctx.fillRect( x + this.size * 3, this.y + s16, s2, s4 );
				ctx.fillRect( x + this.size * 9, this.y + s16, s2, s4 );
			}
		}
	}


	/**
	 * Draw the face.
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number}                   x
	 * @param {number}                   y
	 */
	drawFace( ctx, x, y ) {
		let s2 = this.size * 2;
		let s3 = this.size * 3;
		let s4 = this.size * 4;
		let s5 = this.size * 5;
		let s9 = this.size * 9;

		ctx.fillStyle = '#FFF';

		// Faces are drawn facing to the left.
		// Facing to the right is done by just mirroring (-1 scaling for x).

		let seconds = this.progress / Renderer.TARGET_FPS;
		let blink = false;

		// Every 6 seconds blink for 1/10 of a second.
		if( Math.round( seconds ) % 6 === 0 ) {
			if( seconds - Math.floor( seconds ) <= 0.1 ) {
				blink = true;
			}
		}

		// blank stare
		if( this.face === 0 ) {
			if( !blink ) {
				let offset = this.orientationY * this.size;

				// left eye
				ctx.fillRect( x + s3, y + s5 + offset, this.size, s2 );

				// right eye
				ctx.fillRect( x + s9, y + s5 + offset, this.size, s2 );
			}
		}
		// blank stare at viewer
		else if( this.face === 4 ) {
			if( !blink ) {
				// left eye
				ctx.fillRect( x + s4, y + s5, this.size, s2 );

				// right eye
				ctx.fillRect( x + this.size * 11, y + s5, this.size, s2 );
			}
		}
		// angry
		else if( this.face === 1 ) {
			// left brow
			ctx.fillRect( x + s2, y + s2, s2, this.size );
			ctx.fillRect( x + s4, y + s3, this.size, this.size );

			// right brow
			ctx.fillRect( x + s9, y + s2, s2, this.size );
			ctx.fillRect( x + this.size * 8, y + s3, this.size, this.size );

			if( !blink ) {
				// left eye
				ctx.fillRect( x + s3, y + s4, this.size, s2 );

				// right eye
				ctx.fillRect( x + s9, y + s4, this.size, s2 );
			}

			// mouth
			ctx.fillRect( x + s5, y + s9, s3, this.size );
		}
		// pain
		else if( this.face === 2 ) {
			// left eye
			ctx.fillRect( x + s2, y + s4, this.size, this.size );
			ctx.fillRect( x + s3, y + s5, this.size, this.size );
			ctx.fillRect( x + s2, y + this.size * 6, this.size, this.size );

			// right eye
			ctx.fillRect( x + this.size * 10, y + s4, this.size, this.size );
			ctx.fillRect( x + s9, y + s5, this.size, this.size );
			ctx.fillRect( x + this.size * 10, y + this.size * 6, this.size, this.size );

			// mouth
			ctx.fillRect( x + s5, y + s9, s3, s2 );
		}
		// shocked
		else if( this.face === 3 ) {
			if( !blink ) {
				let offset = this.orientationY * this.size;

				// left eye
				ctx.fillRect( x + s3, y + s4 + offset, this.size, s3 );

				// right eye
				ctx.fillRect( x + s9, y + s4 + offset, this.size, s3 );
			}

			// mouth
			ctx.fillRect( x + s4, y + this.size * 10, s4, this.size );
			ctx.fillRect( x + s4, y + this.size * 11, s5, this.size );
		}
	}


	/**
	 * Move the character.
	 * @param {number} dt
	 * @param {object} dir
	 * @param {number} dir.x
	 * @param {number} dir.y
	 */
	update( dt, dir ) {
		this.progress += dt;

		this.orientationY = 0;

		if( typeof dir.y === 'number' && dir.y !== 0 ) {
			this.orientationY = ( dir.y < 0 ) ? -1 : 1;
		}

		if( dir.x !== 0 ) {
			this.orientationX = ( dir.x < 0 ) ? -1 : 1;
			this.frameX = this.frameX + dt * 0.2;
		}
		else {
			this.frameX = 0;
		}

		this.lastDir = dir.x;
		this.x += Math.round( dir.x * this.speed );
	}


}
