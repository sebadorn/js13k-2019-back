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
	 */
	constructor( text, font, color, x, y ) {
		this.text = text;
		this.font = font;
		this.color = [...color, 1];
		this.visible = true;
		this.x = x;
		this.y = y;
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
	 * Draw the text.
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		if( this.visible ) {
			ctx.fillStyle = `rgba(${ this.color.join(',') })`;
			ctx.font = this.font;
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
