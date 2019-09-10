'use strict';


class Rhythm {


	/**
	 * Rhythm game.
	 * @constructor
	 * @param {Array[]} data
	 */
	constructor( data ) {
		this.time = 0;

		this.stats = {
			correct: 0,
			hit: 0,
			missed: 0,
			total: data.length,
			wrong: 0
		};

		this.buttons = [];
		this.ignoreUntil = -1;

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
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number}                   goal
	 */
	drawResult( ctx, goal ) {
		if( this.stats.correct >= goal ) {
			ctx.fillStyle = Renderer.COLOR.ORANGE;
			ctx.fillRect( 0, 0, window.innerWidth, window.innerHeight );
			ctx.fillStyle = '#000';

			ctx.font = 'bold italic 56px serif';
			ctx.textAlign = 'center';
			ctx.fillText( 'WELL DONE!', Renderer.centerX, Math.max( 40, Renderer.centerY - 220 ) );
		}
		else {
			ctx.fillStyle = Renderer.COLOR.BLUE_1;
			ctx.fillRect( 0, 0, window.innerWidth, window.innerHeight );
			ctx.fillStyle = Renderer.COLOR.WHITE;
		}

		let y = Renderer.centerY - 80;

		ctx.font = 'bold 56px sans-serif';
		ctx.textAlign = 'center';
		ctx.fillText( `${ this.stats.correct }/${ this.stats.total }`, Renderer.centerX, y );

		ctx.font = 'bold 21px sans-serif';
		ctx.fillText( `REQUIRED: ${ goal }`, Renderer.centerX, y += 57 );

		UI_Symbol.draw( ctx, Input.ACTION.INTERACT, [Renderer.centerX - 10, y += 87, 20] );
		ctx.fillText( 'CONTINUE', Renderer.centerX, y += 87 );
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
			if( this.time <= this.ignoreUntil ) {
				checkNext = false;
			}

			checkNext = btn.update( this.time, pressed, checkNext, ( rating ) => {
				// Try to avoid that an input for a missed note ruins
				// the next one. But that's really hard to balance.
				// Worst case it flips the problem and the correct input
				// is not recognized in time.
				if( rating === -1 ) {
					this.ignoreUntil = this.time + 0.05;
				}

				this.onNext( rating );
			} );

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
