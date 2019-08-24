'use strict';


class Rhythm {


	/**
	 * Rhythm game.
	 * @constructor
	 * @param {number} difficulty - [1, 3] from easy to hard
	 * @param {Item[]} items      - Items which can influence the difficulty.
	 */
	constructor( difficulty, items ) {
		this.difficulty = difficulty;
		this.items = items;

		this.line = {
			0: [],
			1: [],
			2: [],
			3: []
		};

		// Speed at which the "notes" arrive.
		this.speed = 2; // [s]
		this.time = 0;

		// Number of "notes".
		this.length = 10;

		// Generate rhythm.
		for( let i = 0; i < this.length; i++ ) {
			let lines = [0, 1, 2, 3];
			let index = Math.round( Math.random() * 3 );
			lines.splice( index, 1 );

			this.line[index].push( 1 );

			lines.forEach( index => {
				this.line[index].push( 0 );
			} );
		}
	}


	/**
	 *
	 * @private
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number}                   i
	 */
	_drawLine( ctx, i ) {
		let stepY = i * 60;

		ctx.fillStyle = '#FFF';
		ctx.moveTo( 100, 400 + stepY );
		ctx.lineTo( 600, 400 + stepY );

		ctx.fillStyle = '#FFFF00';

		let noteX = 0;
		let noteSize = 40;

		// Draw all notes and offset their position
		// based on the current time progress.
		this.line[i].forEach( note => {
			noteX += noteSize + 20;
			// TODO: include time in position

			if( note ) {
				ctx.fillRect( noteX, 400 + stepY - noteSize / 2, noteSize, noteSize );
			}
		} );
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		this._drawLine( ctx, 0 );
		this._drawLine( ctx, 1 );
		this._drawLine( ctx, 2 );
		this._drawLine( ctx, 3 );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		// Time progression.
		this.time += dt / Renderer.TARGET_FPS;
	}


}
