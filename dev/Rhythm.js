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

		// Speed at which the "notes" arrive.
		this.speed = 1.5; // [s]
		// Time progression.
		this.time = 0; // [s]

		this.track = [
			[0, 20,  0,  0, 20, 20,  0, 20,  0,  0,  0],
			[0,  0, 21,  0,  0,  0, 22,  0, 21,  0,  0],
			[0,  0,  0, 23,  0,  0,  0,  0,  0, 22, 21]
		];
		this.numNotes = this.track[0].length;
		this.timeLength = this.speed * this.numNotes;
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		let xEnd = window.innerWidth / 2;
		let xStart = xEnd + 600;

		this.track.forEach( ( line, i ) => {
			line.forEach( ( note, j ) => {
				if( !note ) {
					return;
				}

				let time = j * this.speed;

				// Already passed.
				if( time < this.time ) {
					return;
				}

				// Not yet visible.
				if( time - this.time > this.speed ) {
					return;
				}

				let progress = ( time - this.time ) / this.speed;
				let x = Math.round( xStart * progress + xEnd * ( 1 - progress ) );
				let y = Math.round( window.innerHeight * 0.1 + i * 50 );

				ctx.globalAlpha = 1 - progress;
				UI_Symbol.draw( ctx, note, [x, y, 42] );
			} );
		} );

		ctx.globalAlpha = 1;
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.time += dt / Renderer.TARGET_FPS;
	}


}
