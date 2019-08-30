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

		// Diagonal line.
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

		this.goal = Math.round( data.length * 0.8 );

		this.bgLeftAlpha = 0;
		this.bgRightAlpha = 0;
		this.ghostY = 0;
		this.srcPlayerFace = [32, 16, 16, 16];

		this.rhythm = new Rhythm( data, player.items );

		this.rhythm.onNext = ( rating ) => {
			// rating: -1 missed, 0 wrong, 1 bad, 2 okay, 3 good, 4 perfect
			this.srcPlayerFace[0] = 32;
			this.srcPlayerFace[1] = 16;

			if( rating < 1 ) {
				this.srcPlayerFace[0] = 48;
				this.srcPlayerFace[1] = 0;

				this.bgRightAlpha = 0.25;
			}
			else if( rating < 2 ) {
				this.srcPlayerFace[0] = 48;
				this.srcPlayerFace[1] = 16;
			}
			// >= 2
			else if( rating > 1 ) {
				this.bgLeftAlpha = 0.25;
			}
		};
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		let stats = this.rhythm.stats;
		let balance = stats.correct - stats.wrong - stats.missed;
		let progress = Math.min( this.goal, balance ) / this.goal;

		let wh = window.innerWidth / 2;
		let x = wh * progress;
		let over = window.innerWidth * 0.1;

		let r1, g1, b1, r2, g2, b2;

		if( balance < 0 ) {
			r1 = ( 1 + progress ) * 33 - progress * 41;
			g1 = ( 1 + progress ) * 33 - progress * 51;
			b1 = ( 1 + progress ) * 33 - progress * 64;

			r2 = 41;
			g2 = 51;
			b2 = 64;
		}
		else {
			r1 = ( 1 - progress ) * 33 + progress * 233;
			g1 = ( 1 - progress ) * 33 + progress * 133;
			b1 = ( 1 - progress ) * 33 + progress *  64;

			r2 = ( 1 - progress ) * 41 + progress * 233;
			g2 = ( 1 - progress ) * 51 + progress * 133;
			b2 = 64;
		}

		ctx.fillStyle = `rgb(${ ~~r1 },${ ~~g1 },${ ~~b1 })`;
		ctx.fillRect( 0, 0, window.innerWidth, window.innerHeight );

		if( this.bgRightAlpha > 0 ) {
			ctx.fillStyle = `rgba(0,0,0,${ this.bgRightAlpha })`;
			ctx.fillRect( 0, 0, window.innerWidth, window.innerHeight );
		}

		// Diagonal splitting the screen vertically.
		ctx.fillStyle = `rgb(${ ~~r2 },${ ~~g2 },${ ~~b2 })`;
		ctx.beginPath();
		ctx.moveTo( 0, 0 );
		ctx.lineTo( wh + over - x, 0 );
		ctx.lineTo( wh - over - x, window.innerHeight );
		ctx.lineTo( 0, window.innerHeight );
		ctx.closePath();
		ctx.fill();

		if( this.bgLeftAlpha > 0 ) {
			ctx.fillStyle = `rgba(0,0,0,${ this.bgLeftAlpha })`;
			ctx.fill();
		}

		// Ghost
		let ghostOffY = Math.round( Math.sin( this.ghostY ) * 50 );

		ctx.translate( 160, 320 );
		ctx.rotate( 15 * Math.PI / 180 );
		ctx.translate( -160, -320 - ghostOffY );
		ctx.drawImage( Renderer.sprites.gh, 0, 0, 16, 32, 0, 0, 320, 640 );
		ctx.setTransform( 1, 0, 0, 1, 0, 0 );

		// Player
		ctx.drawImage( Renderer.sprites.pl, 0, 0, 32, 32, window.innerWidth - 320, window.innerHeight - 320, 320, 320 );
		ctx.drawImage( Renderer.sprites.pl, ...this.srcPlayerFace, window.innerWidth - 240, window.innerHeight - 200, 160, 160 );

		this.rhythm.draw( ctx );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		if( this.bgLeftAlpha > 0 ) {
			this.bgLeftAlpha = Math.max( 0, this.bgLeftAlpha - dt * 0.05 );
		}

		if( this.bgRightAlpha > 0 ) {
			this.bgRightAlpha = Math.max( 0, this.bgRightAlpha - dt * 0.05 );
		}

		this.ghostY = this.ghostY + dt * 0.05;

		if( this.ghostY > Math.PI * 2 ) {
			this.ghostY -= Math.PI * 2;
		}

		this.rhythm.update( dt );
	}


}
