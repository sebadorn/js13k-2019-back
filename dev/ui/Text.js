'use strict';


class UI_Text {


	/**
	 *
	 * @constructor
	 * @param {string}   text
	 * @param {string}   font
	 * @param {number[]} color
	 * @param {number}   x
	 * @param {number}   y
	 * @param {?boolean} center
	 */
	constructor( text, font, color, x, y, center ) {
		this.text = text;
		this.font = font;
		this.color = [...color, 1];
		this.visible = true;
		this.x = x;
		this.y = y;
		this.center = center;
	}


	/**
	 * Have the text blink (or stop it).
	 * @param {boolean} [val = true]
	 */
	blink( val = true ) {
		this._blinkStep = 0.01;
		this._blink = val;
	}


	/**
	 * Center the text on the x axis.
	 */
	centerX() {
		this.x = Math.round( window.innerWidth / 2 );
	}


	/**
	 * Draw the text.
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		if( this.visible ) {
			ctx.fillStyle = `rgba(${ this.color.join(',') })`;
			ctx.font = this.font;
			ctx.textAlign = this.center ? 'center' : 'left';
			ctx.fillText( this.text, this.x, this.y );
		}
	}


	/**
	 * Update text effects which are time-dependant.
	 * @param {number} dt
	 */
	update( dt ) {
		if( this._blink ) {
			if( this.color[3] >= 1 ) {
				this._blinkStep = -0.01;
			}
			else if( this.color[3] <= 0 ) {
				this._blinkStep = 0.01;
			}

			this.color[3] += this._blinkStep;
		}
	}


}
