'use strict';


class Level_1_2 extends Level {


	/**
	 * Episode 1: How to send back a Ghost
	 * Phase 2: Rhythm fight
	 * @constructor
	 * @param {Player} player
	 */
	constructor( player ) {
		super();

		let t = 2;
		let data = [];

		// Circle.
		let num = 15;
		let minSize = Math.min( window.innerWidth, window.innerHeight ) * 0.8;
		let offsetX = ( window.innerWidth - minSize ) / 2;
		let offsetY = ( window.innerHeight - minSize ) / 2;

		for( let i = 1; i <= num; i++ ) {
			let key = 20 + Math.floor( i / 4 );
			let step = i / num * Math.PI * 2;

			let x = Math.sin( step ) + 1;
			let y = Math.cos( step ) + 1;
			x = Math.round( offsetX + x / 2 * minSize );
			y = Math.round( offsetY + y / 2 * minSize );

			data.push( [[x, y], key, t] );
			t += 0.5;
		}

		// Line.
		num = 12;
		offsetX = window.innerWidth * 0.2 / 2;
		offsetY = window.innerHeight * 0.2 / 2;

		for( let i = 1; i <= num; i++ ) {
			let key = ( i % 2 ) ? 23 : 22;
			let step = 1 - i / num;
			let x = Math.round( offsetX + step * window.innerWidth * 0.8 );
			let y = Math.round( offsetY + step * window.innerHeight * 0.8 );

			data.push( [[x, y], key, t] );
			t += 0.4;
		}

		this.rhythm = new Rhythm( data, player.items );
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		let over = window.innerWidth * 0.1;

		ctx.fillStyle = '#30D';
		ctx.fillRect( 0, 0, window.innerWidth, window.innerHeight );

		ctx.fillStyle = '#08F';
		ctx.beginPath();
		ctx.moveTo( 0, 0 );
		ctx.lineTo( window.innerWidth / 2 + over, 0 );
		ctx.lineTo( window.innerWidth / 2 - over, window.innerHeight );
		ctx.lineTo( 0, window.innerHeight );
		ctx.closePath();
		ctx.fill();

		this.rhythm.draw( ctx );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.rhythm.update( dt );
	}


}
