'use strict';


class Level_1_2 {


	/**
	 * Episode 1: How to send back a Ghost
	 * Phase 2: Rhythm fight
	 * @constructor
	 * @param {Player}  player
	 * @param {boolean} skipIntro
	 */
	constructor( player, skipIntro ) {
		let data = [
			// [relative pos, symbol, timeout before note is shown]

			// Slow intro
			[[0.35, 0.50], 20, 2.00],
			[[0.45, 0.50], 21, 2.00],
			[[0.55, 0.50], 22, 2.00],
			[[0.65, 0.50], 23, 2.00],

			// Warm-up (still intro)
			[[0.80, 0.10], 21, 5.00],
			[[0.70, 0.10], 21, 0.50],
			[[0.60, 0.10], 23, 0.50],
			[[0.50, 0.10], 23, 0.50],

			[[0.70, 0.50], 20, 1.00],
			[[0.60, 0.50], 20, 0.50],
			[[0.50, 0.50], 22, 0.50],
			[[0.40, 0.50], 22, 0.50],

			// Getting serious

			// Line 1
			[[0.70, 0.25], 20, 7.00],
			[[0.65, 0.25], 20, 0.50],
			[[0.60, 0.20], 21, 0.50],
			[[0.55, 0.15], 22, 0.50],
			[[0.50, 0.15], 22, 0.50],
			[[0.45, 0.20], 23, 0.50],
			[[0.40, 0.20], 23, 0.50],
			[[0.35, 0.15], 22, 0.50],
			[[0.30, 0.25], 20, 0.50],

			// Line 2
			[[0.30, 0.80], 21, 1.00],
			[[0.35, 0.75], 22, 0.50],
			[[0.40, 0.85], 20, 0.50],
			[[0.45, 0.75], 22, 0.50],
			[[0.50, 0.85], 20, 0.50],
			[[0.55, 0.80], 23, 0.50],
			[[0.60, 0.80], 23, 0.50],
			[[0.65, 0.80], 23, 0.50],
			[[0.70, 0.80], 23, 0.50],

			// Left - squiggly down - right
			[[0.70, 0.40], 22, 0.50],
			[[0.65, 0.40], 22, 0.50],
			[[0.60, 0.40], 22, 0.50],
			[[0.55, 0.40], 22, 0.50],
			[[0.50, 0.40], 22, 0.50],
			[[0.45, 0.45], 23, 0.50],
			[[0.50, 0.50], 20, 0.50],
			[[0.55, 0.55], 21, 0.50],
			[[0.50, 0.65], 20, 0.50],
			[[0.45, 0.70], 23, 0.50],
			[[0.50, 0.75], 20, 0.50],
			[[0.55, 0.80], 21, 0.50],
			[[0.60, 0.80], 21, 0.50],
			[[0.65, 0.80], 21, 0.50],

			// Final
			[[0.80, 0.70], 21, 1.00],
			[[0.70, 0.70], 20, 1.00],
			[[0.60, 0.60], 23, 1.00],
			[[0.50, 0.50], 22, 1.00],
			[[0.40, 0.40], 23, 1.00],
			[[0.30, 0.30], 22, 1.00],
			[[0.10, 0.35], 21, 1.00],
			[[0.10, 0.50], 20, 0.50],
			[[0.10, 0.65], 20, 0.50],
			[[0.10, 0.80], 20, 0.50],
			[[0.10, 0.80], 22, 2.00]
		];

		let t = 2;

		data.forEach( item => {
			item[0][0] *= window.innerWidth;
			item[0][1] *= window.innerHeight;
			item[2] += t;
			t = item[2];
		} );

		if( skipIntro ) {
			data = data.slice( 12 );
		}

		this.goal = Math.round( ( data.length - 12 ) * 0.8 );

		player.orientationX = -1;
		player.orientationY = 0;
		player.lastDir = 0;
		player.size = 10;
		this.player = player;
		this.ghostY = 0;

		this.rhythm = new Rhythm( data, player.items );
		this.isDone = 0;

		if( skipIntro ) {
			this.rhythm.time = 21;
		}

		this.rhythm.onNext = ( rating ) => {
			// rating: -1 missed, 0 wrong, 1 bad, 2 okay, 3 good, 4 perfect
			if( this.rhythm.time > 21 ) { // No face changes in the intro phase
				this.player.face = 1;

				if( rating < 1 ) {
					this.player.face = 2;
				}
				else if( rating < 2 ) {
					this.player.face = 3;
				}
			}
		};

		this.rhythm.onDone = () => {
			this.isDone = this.rhythm.time;
			this.beat.pause();
		};

		this.beat = GameAudio.play( 'beat', true, 1 );
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		if( this.isDone ) {
			this.rhythm.drawResult( ctx, this.goal );
			return;
		}

		ctx.fillStyle = `rgb(41,51,64)`;
		ctx.fillRect( 0, 0, window.innerWidth, window.innerHeight );

		// Ghost
		if( this.rhythm.time >= 22 ) {
			let alpha = Math.min( 1, this.rhythm.time - 22 );
			let ghostOffY = Math.round( Math.sin( this.ghostY ) * 50 );

			ctx.globalAlpha = alpha;
			ctx.translate( 160, 320 );
			ctx.rotate( 15 * Math.PI / 180 );
			ctx.translate( -160, -320 - ghostOffY );
			ctx.drawImage( Renderer.sprites.gh, 0, 0, 16, 32, 0, 0, 320, 640 );
			ctx.setTransform( 1, 0, 0, 1, 0, 0 );


			// Progress bar

			let stats = this.rhythm.stats;
			let balance = stats.correct - stats.wrong - stats.missed;
			let progress = Math.min( this.goal, balance ) / this.goal;

			let width = Math.round( window.innerWidth / 3 );
			let x = Renderer.centerX - Math.round( width / 2 );

			// Border
			ctx.fillStyle = '#000';
			ctx.fillRect( x - 5, window.innerHeight - 115, 5, 15 );
			ctx.fillRect( x, window.innerHeight - 120, width, 5 );
			ctx.fillRect( x, window.innerHeight - 100, width, 5 );
			ctx.fillRect( x + width, window.innerHeight - 115, 5, 15 );

			// Ghost energy
			let playerWidth = Math.round( progress * width );
			ctx.fillStyle = '#4B5E77';
			ctx.fillRect( x, window.innerHeight - 115, width - playerWidth, 15 );
			// Player energy
			ctx.fillStyle = '#C26F38';
			ctx.fillRect( x + width - playerWidth, window.innerHeight - 115, playerWidth, 15 );

			ctx.globalAlpha = 1;
		}

		// Player
		this.player.x = window.innerWidth - this.player.width - 80;
		this.player.y = window.innerHeight - this.player.height;
		this.player.draw( ctx );

		ctx.font = 'bold 21px sans-serif';
		ctx.textAlign = 'center';

		if( this.rhythm.time < 11 ) {
			ctx.fillText( 'Hit the button shortly before its timer runs out:'.toUpperCase(), Renderer.centerX, window.innerHeight * 0.3 );
		}
		else if( this.rhythm.time < 13 ) {
			ctx.fillText( 'Now faster.'.toUpperCase(), Renderer.centerX, window.innerHeight * 0.4);
		}
		else if( this.rhythm.time > 20 && this.rhythm.time < 24 ) {
			ctx.fillText( 'Time for the real deal.'.toUpperCase(), Renderer.centerX, window.innerHeight * 0.4);
		}

		this.rhythm.draw( ctx );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		if( this.isDone ) {
			if( Input.isPressed( Input.ACTION.INTERACT ) ) {
				Renderer.level = new Level_1_1( {
					success: this.rhythm.stats.correct >= this.goal
				} );
			}

			return;
		}

		this.player.update( dt, { x: 0 } );
		this.ghostY = this.ghostY + dt * 0.05;

		if( this.ghostY > Math.PI * 2 ) {
			this.ghostY -= Math.PI * 2;
		}

		this.rhythm.update( dt );
	}


}
