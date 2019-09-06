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

		let data = [
			// [relative pos, symbol, timeout before note]

			// Slow intro
			[[0.35, 0.50], 20, 0.00],
			[[0.45, 0.50], 21, 2.00],
			[[0.55, 0.50], 22, 2.00],
			[[0.65, 0.50], 23, 2.00],

			//
			[[0.80, 0.10], 21, 2.00],
			[[0.75, 0.10], 21, 0.50],
			[[0.70, 0.10], 21, 0.50],
			[[0.70, 0.20], 23, 0.25],
			[[0.65, 0.20], 23, 0.25],
			[[0.65, 0.10], 21, 0.75],
			[[0.60, 0.10], 21, 0.50]
		];

		let t = 2;

		data.forEach( item => {
			item[0][0] *= window.innerWidth;
			item[0][1] *= window.innerHeight;
			item[2] += t;
			t = item[2];
		} );

		this.goal = Math.round( data.length * 0.8 );

		this.ghostY = 0;

		player.orientationX = -1;
		player.orientationY = 0;
		player.lastDir = 0;
		player.size = 10;
		this.player = player;

		this.rhythm = new Rhythm( data, player.items );

		this.rhythm.onNext = ( rating ) => {
			// rating: -1 missed, 0 wrong, 1 bad, 2 okay, 3 good, 4 perfect
			this.player.face = 1;

			if( rating < 1 ) {
				this.player.face = 2;
			}
			else if( rating < 2 ) {
				this.player.face = 3;
			}
		};

		this.rhythm.onDone = () => {
			this.beat.pause();

			if( this.rhythm.stats.correct >= this.goal ) {
				// TODO:
			}
			else {
				Renderer.level = new Level_1_1( this.rhythm.stats );
			}
		};

		this.beat = GameAudio.play( 'beat', true, 1 );
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		let stats = this.rhythm.stats;
		let balance = stats.correct - stats.wrong - stats.missed;
		let progress = Math.min( this.goal, balance ) / this.goal;

		let x = Renderer.centerX * progress;
		let over = window.innerWidth * 0.1;

		let r1, g1, b1, r2, g2, b2;

		if( balance < 0 ) {
			r1 = ( 1 + progress ) * 26 - progress * 41;
			g1 = ( 1 + progress ) * 31 - progress * 51;
			b1 = ( 1 + progress ) * 38 - progress * 64;

			r2 = 26;
			g2 = 31;
			b2 = 38;
		}
		else {
			r1 = ( 1 - progress ) * 26 + progress * 233;
			g1 = ( 1 - progress ) * 31 + progress * 133;
			b1 = ( 1 - progress ) * 38 + progress *  64;

			r2 = ( 1 - progress ) * 26 + progress * 233;
			g2 = ( 1 - progress ) * 31 + progress * 133;
			b2 = ( 1 - progress ) * 38 + progress *  64;
		}

		ctx.fillStyle = `rgb(${ ~~r1 },${ ~~g1 },${ ~~b1 })`;
		ctx.fillRect( 0, 0, window.innerWidth, window.innerHeight );

		// Diagonal splitting the screen vertically.
		ctx.fillStyle = `rgb(${ ~~r2 },${ ~~g2 },${ ~~b2 })`;
		ctx.beginPath();
		ctx.moveTo( 0, 0 );
		ctx.lineTo( Renderer.centerX + over - x, 0 );
		ctx.lineTo( Renderer.centerX - over - x, window.innerHeight );
		ctx.lineTo( 0, window.innerHeight );
		ctx.closePath();
		ctx.fill();

		// Ghost
		let ghostOffY = Math.round( Math.sin( this.ghostY ) * 50 );

		ctx.translate( 160, 320 );
		ctx.rotate( 15 * Math.PI / 180 );
		ctx.translate( -160, -320 - ghostOffY );
		ctx.drawImage( Renderer.sprites.gh, 0, 0, 16, 32, 0, 0, 320, 640 );
		ctx.setTransform( 1, 0, 0, 1, 0, 0 );

		// Player
		this.player.x = window.innerWidth - this.player.width - 80;
		this.player.y = window.innerHeight - this.player.height;
		this.player.draw( ctx );

		this.rhythm.draw( ctx );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.player.update( dt, { x: 0 } );
		this.ghostY = this.ghostY + dt * 0.05;

		if( this.ghostY > Math.PI * 2 ) {
			this.ghostY -= Math.PI * 2;
		}

		this.rhythm.update( dt );
	}


}
