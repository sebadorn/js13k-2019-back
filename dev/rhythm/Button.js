'use strict';


class Rhythm_Button {


	/**
	 *
	 * @constructor
	 * @param {number[]} pos    - Oosition on the screen.
	 * @param {number}   symbol - An identifier from Input.ACTION.
	 * @param {number}   time   - When the button has to be pressed.
	 */
	constructor( pos, symbol, time ) {
		this.pos = pos;
		this.symbol = symbol;
		this.time = time;
		this.speed = 3;

		this.canBeRemoved = false;
		this.isHit = 0;
		this.wasWrong = false;
		this.progress = 0;
		this.diff = -1;
	}


	/**
	 *
	 * @private
	 * @param {number}    progress
	 * @param {boolean[]} pressed
	 * @param {number}    index
	 */
	_checkPressed( progress, pressed, index ) {
		if( pressed[index] ) {
			this.isHit = progress;
		}
		else {
			let others = [0, 1, 2, 3];
			others[index] = -1;

			if(
				pressed[others[0]] ||
				pressed[others[1]] ||
				pressed[others[2]] ||
				pressed[others[3]]
			) {
				this.isHit = progress;
				this.wasWrong = true;
			}
		}
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		let x = this.pos[0];
		let y = this.pos[1];

		if( this.wasWrong ) {
			// TODO:
		}
		else if( this.isHit ) {
			let diff = this.progress - this.isHit;
			let speed = 0.2;

			if( diff > speed ) {
				this.canBeRemoved = true;
				return;
			}

			let percent = diff / speed;
			let r = Math.round( percent * 80 );

			ctx.fillStyle = '#F00';
			ctx.beginPath();
			ctx.arc( x, y, r, 0, Math.PI * 2 );
			ctx.closePath();
			ctx.fill();
		}
		else if( this.diff >= 0 && this.diff <= this.speed ) {
			let percent = this.diff / this.speed;
			let angleStart = -Math.PI / 2;
			let angleEnd = Math.PI * ( percent * 2 - 0.5 );

			// Timer around button.
			ctx.beginPath();
			ctx.fillStyle = this.getColorTimer( percent );
			ctx.arc( x, y, 48, angleStart, angleEnd );
			ctx.lineTo( x, y );
			ctx.closePath();
			ctx.fill();

			UI_Symbol.draw( ctx, this.symbol, [x - 21, y - 21, 42] );
		}
	}


	/**
	 * Get the color for the timer.
	 * @param  {number} percent
	 * @return {string}
	 */
	getColorTimer( percent ) {
		let r = 250;
		let g = 160;
		let b = 90;

		if( this.symbol === Input.ACTION.FIGHT_1 ) {
			if( Input.PROMPTS === 3 ) {
				r = 50;
				g = 210;
			}
			else {
				r = 90;
				b = 230;
			}
		}
		else if( this.symbol === Input.ACTION.FIGHT_2 ) {
			if( Input.PROMPTS === 3 ) {
				g = 60;
				b = 60;
			}
			else {
				g = 150;
				b = 50;
			}
		}
		else if( this.symbol === Input.ACTION.FIGHT_3 ) {
			if( Input.PROMPTS === 3 ) {
				r = 240;
				g = 230;
				b = 70;
			}
			else {
				r = 50;
				g = 210;
			}
		}
		else { // FIGHT_4
			if( Input.PROMPTS === 3 ) {
				r = 90;
				b = 230;
			}
			else {
				r = 220;
				g = 140;
				b = 210;
			}
		}

		return `rgba(${ r },${ g },${ b },${ 1 - percent })`;
	}


	/**
	 *
	 * @return {number}
	 */
	getRating() {
		if( this.isHit && !this.wasWrong ) {
			if( Math.abs( this.diff ) <= Rhythm_Button.TIME_DIFF_MIN ) {
				return 4;
			}
			else if( this.diff < Rhythm_Button.TIME_DIFF_MAX / 2 ) {
				return 3;
			}
			else if( this.diff < Rhythm_Button.TIME_DIFF_MAX / 1.5 ) {
				return 2;
			}

			return 1;
		}

		return 0;
	}


	/**
	 *
	 * @param {number}    progress
	 * @param {boolean[]} pressed
	 * @param {boolean}   check
	 * @param {function}  onNext
	 */
	update( progress, pressed, check, onNext ) {
		let checkNext = check;

		this.diff = this.time - progress;

		if( !this.isHit ) {
			if( check && this.diff >= Rhythm_Button.TIME_DIFF_MIN && this.diff <= Rhythm_Button.TIME_DIFF_MAX ) {
				if( this.symbol === Input.ACTION.FIGHT_1 ) {
					this._checkPressed( progress, pressed, 0 );
				}
				else if( this.symbol === Input.ACTION.FIGHT_2 ) {
					this._checkPressed( progress, pressed, 1 );
				}
				else if( this.symbol === Input.ACTION.FIGHT_3 ) {
					this._checkPressed( progress, pressed, 2 );
				}
				else if( this.symbol === Input.ACTION.FIGHT_4 ) {
					this._checkPressed( progress, pressed, 3 );
				}

				if( this.isHit ) {
					this.progress = progress;
					checkNext = false;

					if( !this.wasWrong ) {
						GameAudio.play( 'hit' );
					}

					onNext( this.getRating() );
				}
			}

			if( this.wasWrong || this.diff < Rhythm_Button.TIME_DIFF_MIN ) {
				this.canBeRemoved = true;
			}

			if( this.diff < Rhythm_Button.TIME_DIFF_MIN ) {
				onNext( -1 );
			}
		}
		else {
			this.progress = progress;
		}

		return checkNext;
	}


}


Rhythm_Button.TIME_DIFF_MIN = -0.1;
Rhythm_Button.TIME_DIFF_MAX = 0.5;
