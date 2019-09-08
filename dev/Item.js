'use strict';


class Item {


	/**
	 * Item for player.
	 * @constructor
	 * @param {string}   name
	 * @param {string}   desc
	 * @param {object}   effect
	 * @param {number}   x
	 * @param {number}   y
	 * @param {number}   size
	 * @param {function} fnDraw
	 */
	constructor( name, desc, effect, x, y, size, fnDraw ) {
		this.name = name;
		this.desc = desc.split( '\n' );
		this.effect = effect;
		this.collected = false;

		this.centerX = x; // Overwritten in draw function.
		this.x = x;
		this.y = y;
		this.size = size;

		this.draw = fnDraw;
	}


}


/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
Item.drawSaltShaker = function( ctx ) {
	// Glas
	ctx.fillStyle = 'rgba(210,216,216,0.5)';
	ctx.fillRect( this.x, this.y, this.size * 8, this.size * 4 );

	// Metal cap
	ctx.fillStyle = '#888';
	ctx.fillRect( this.x, this.y, this.size * 2, this.size * 4 );

	// Salt
	ctx.fillStyle = '#FFF';
	ctx.fillRect( this.x + this.size * 2, this.y + this.size * 3, this.size * 6, this.size );
	ctx.fillRect( this.x + this.size * 3, this.y + this.size * 2, this.size * 5, this.size );
	ctx.fillRect( this.x + this.size * 4, this.y, this.size * 4, this.size * 2 );

	this.centerX = this.x + this.size * 4;
};


/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
Item.drawPan = function( ctx ) {
	ctx.save();
	ctx.translate( this.x, this.y );
	ctx.rotate( 62 * Math.PI / 180 );
	ctx.translate( -this.x, -this.y );

	let s2 = this.size * 2;
	let s4 = this.size * 4;
	let s6 = this.size * 6;

	ctx.fillStyle = '#000';
	ctx.fillRect( this.x + s2, this.y, s6, this.size * 10 );
	ctx.fillRect( this.x, this.y + s2, this.size * 10, s6 );
	ctx.fillRect( this.x + this.size, this.y + this.size, this.size * 8, this.size * 8 );
	ctx.fillRect( this.x + s4, this.y + this.size * 10, s2, this.size * 5 );

	ctx.fillStyle = '#333';
	ctx.fillRect( this.x + s2, this.y + this.size, s6, this.size * 8 );
	ctx.fillRect( this.x + this.size, this.y + s2, this.size * 8, s6 );
	ctx.fillRect( this.x + s4, this.y + this.size * 10, s2, this.size );

	ctx.fillStyle = '#555';
	ctx.fillRect( this.x + this.size * 3, this.y + s2, s4, s6 );
	ctx.fillRect( this.x + s2, this.y + this.size * 3, s6, s4 );

	ctx.restore();

	this.centerX = this.x + this.size * 10 - 70;
};
