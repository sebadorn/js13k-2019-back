'use strict';


class Rhythm {


	/**
	 * Rhythm game.
	 * @constructor
	 * @param {Array[]} data
	 * @param {Item}    item - Item which can influence the difficulty.
	 */
	constructor( data, item ) {
		this.item = item;
		this.time = 0;

		this.stats = {
			correct: 0,
			hit: 0,
			missed: 0,
			total: data.length,
			wrong: 0
		};

		this.buttons = [];

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

		// Reverse drawing order so the most imminent prompt
		// is always rendered last which means on top.
		for( let i = this.buttons.length - 1; i >= 0; i-- ) {
			this.buttons[i].draw( ctx );
		}
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
			checkNext = btn.update( this.time, pressed, checkNext, this.onNext );

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
			else {
				this.stats.correct++;
			}
		}
		else {
			this.stats.missed++;
		}

		if( this.stats.hit + this.stats.missed === this.stats.total ) {
			this.onDone();
			this.onDone = null;
		}
	}


}
