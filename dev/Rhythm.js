'use strict';


class Rhythm {


	/**
	 * Rhythm game.
	 * @constructor
	 * @param {Item[]} items - Items which can influence the difficulty.
	 */
	constructor( items ) {
		this.items = items;
		this.time = 0;

		let t = 2;
		let data = [
			// pos, symbol, time
			[[0.60, 0.30], 21, t],
			[[0.70, 0.50], 21, t += 0.5],
			[[0.60, 0.70], 20, t += 0.5],
			[[0.50, 0.90], 20, t += 0.5],
			[[0.40, 0.70], 23, t += 0.5],
			[[0.30, 0.50], 23, t += 0.5],
			[[0.40, 0.30], 22, t += 0.5],
			[[0.50, 0.10], 22, t += 0.5]
		];

		this.buttons = [];
		this.stats = {
			hit: 0,
			missed: 0,
			total: data.length,
			wrong: 0
		};

		data.forEach( note => {
			this.buttons.push( new Rhythm_Button( ...note ) );
		} );
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		if( this.time === 0 ) {
			return;
		}

		this.buttons.forEach( btn => btn.draw( ctx ) );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.time += dt / Renderer.TARGET_FPS;

		let pressed = [
			Input.isPressed( Input.ACTION.FIGHT_1, true ),
			Input.isPressed( Input.ACTION.FIGHT_2, true ),
			Input.isPressed( Input.ACTION.FIGHT_3, true ),
			Input.isPressed( Input.ACTION.FIGHT_4, true )
		];

		let checkNext = true;

		this.buttons.forEach( ( btn, i ) => {
			checkNext = btn.update( this.time, pressed, checkNext );

			if( btn.canBeRemoved ) {
				this.updateStats( btn );
				this.buttons.splice( i, 1 );
			}
		} );
	}


	/**
	 *
	 * @param {Rhythm_Button} btn
	 */
	updateStats( btn ) {
		if( btn.isHit ) {
			this.stats.hit++;

			if( btn.wasWrong ) {
				this.stats.wrong++;
			}
		}
		else {
			this.stats.missed++;
		}
	}


}
