'use strict';


class Rhythm_Button {


	/**
	 *
	 * @constructor
	 * @param {number[]} pos    - Relative position on the screen.
	 *     Each coordinate being in [0, 1].
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
		let x = Math.round( this.pos[0] * window.innerWidth );
		let y = Math.round( this.pos[1] * window.innerHeight );

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
			ctx.arc( x + 21, y + 21, r, 0, Math.PI * 2 );
			ctx.closePath();
			ctx.fill();
		}
		else if( this.diff >= 0 && this.diff <= this.speed ) {
			let percent = this.diff / this.speed;
			let border = 32;
			let r = border + Math.round( percent * 108 );
			let alpha = ( 1 - percent ) * 0.6;

			ctx.beginPath();
			ctx.fillStyle = `rgba(255,255,255,${ alpha })`;
			ctx.arc( x + 21, y + 21, r, 0, Math.PI * 2 );
			ctx.closePath();
			ctx.fill();

			ctx.beginPath();
			ctx.fillStyle = '#000';
			ctx.arc( x + 21, y + 21, border, 0, Math.PI * 2 );
			ctx.closePath();
			ctx.fill();

			UI_Symbol.draw( ctx, this.symbol, [x, y, 42] );
		}
	}


	/**
	 *
	 */
	playSound() {
		zzfx( 0.8, 0, 440, 0.5, 0.05, 0, 0, 0, 0 );
	}


	/**
	 *
	 * @param {number}    progress
	 * @param {boolean[]} pressed
	 * @param {boolean}   check
	 */
	update( progress, pressed, check ) {
		let checkNext = check;

		this.diff = this.time - progress;

		if( !this.isHit ) {
			if( check && this.diff >= 0 && this.diff <= 1 ) {
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
						this.playSound();
					}
				}
			}

			if( this.wasWrong || this.diff < 0 ) {
				this.canBeRemoved = true;
			}
		}
		else {
			this.progress = progress;
		}

		return checkNext;
	}


}
