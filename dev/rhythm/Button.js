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
		this.speed = 2;

		this.canBeRemoved = false;
		this.isHit = 0;
		this.wasWrong = false;
		this.progress = 0;
		this.diff = -1;

		this.ui_rating = new UI_Text( '', '18px sans-serif', [255, 255, 255], 0, 0, true );
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

		// 1 second after hitting the button mark it for removal.
		// Leaves time for a quick UI feedback to the player.
		if( this.isHit ) {
			if( this.progress - this.isHit > 1 ) {
				this.canBeRemoved = true;
			}
		}

		// Show rating.
		if( this.isHit || this.wasWrong ) {
			let rating = this.getRating();

			this.ui_rating.x = x;
			this.ui_rating.y = y - 45;
			this.ui_rating.text = rating[1].toUpperCase();
			this.ui_rating.draw( ctx );
		}
		// Show button prompt with timer.
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

			UI_Symbol.draw( ctx, this.symbol, [x - 15, y - 15, 30] );
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
	 * @return {Array}
	 */
	getRating() {
		if( this.isHit && !this.wasWrong ) {
			if( Math.abs( this.diff ) <= Math.abs( Rhythm_Button.TIME_DIFF_MIN ) ) {
				return [4, 'perfect'];
			}
			else if( this.diff < Rhythm_Button.TIME_DIFF_MAX / 3 ) {
				return [3, 'great'];
			}
			else if( this.diff < Rhythm_Button.TIME_DIFF_MAX / 1.5 ) {
				return [2, 'good'];
			}

			return [1, 'bad'];
		}
		else if( this.isHit && this.wasWrong ) {
			return [0, 'wrong'];
		}

		return [-1, 'missed'];
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

		let diff = this.time - progress;

		if( !this.isHit ) {
			this.diff = diff;

			if( check && diff >= Rhythm_Button.TIME_DIFF_MIN && diff <= Rhythm_Button.TIME_DIFF_MAX ) {
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

					onNext( this.getRating()[0] );
				}
			}

			if( diff < Rhythm_Button.TIME_DIFF_MIN - 1 ) {
				this.canBeRemoved = true;
			}
			else if( !this.wasWrong && diff < Rhythm_Button.TIME_DIFF_MIN ) {
				this.wasWrong = true;
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
Rhythm_Button.TIME_DIFF_MAX = 1.5;
