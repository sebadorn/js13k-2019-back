'use strict';


class Level_1_2 extends Level {


	/**
	 * Episode 1: How to send back a Ghost
	 * Phase 2: Rhythm fight
	 * @constructor
	 * @extends {Level}
	 * @param {Player}  player
	 * @param {boolean} skipIntro
	 */
	constructor( player, skipIntro ) {
		super();

		let data = [
			// [relative pos, symbol, timeout before note is shown]

			// Slow intro
			[[0.35, 0.50], Input.ACTION.FIGHT_1, 2.00],
			[[0.45, 0.50], Input.ACTION.FIGHT_2, 2.00],
			[[0.55, 0.50], Input.ACTION.FIGHT_3, 2.00],
			[[0.65, 0.50], Input.ACTION.FIGHT_4, 2.00],

			// Warm-up (still intro)
			[[0.70, 0.20], Input.ACTION.FIGHT_2, 4.50],
			[[0.65, 0.20], Input.ACTION.FIGHT_2, 0.50],
			[[0.60, 0.20], Input.ACTION.FIGHT_4, 0.50],
			[[0.55, 0.20], Input.ACTION.FIGHT_4, 0.50],

			[[0.45, 0.20], Input.ACTION.FIGHT_2, 1.00],
			[[0.40, 0.20], Input.ACTION.FIGHT_4, 0.50],
			[[0.35, 0.20], Input.ACTION.FIGHT_2, 0.50],
			[[0.30, 0.20], Input.ACTION.FIGHT_4, 0.50],

			[[0.70, 0.70], Input.ACTION.FIGHT_1, 1.50],
			[[0.65, 0.70], Input.ACTION.FIGHT_1, 0.50],
			[[0.60, 0.70], Input.ACTION.FIGHT_3, 0.50],
			[[0.55, 0.70], Input.ACTION.FIGHT_3, 0.50],

			[[0.45, 0.70], Input.ACTION.FIGHT_1, 1.00],
			[[0.40, 0.70], Input.ACTION.FIGHT_3, 0.50],
			[[0.35, 0.70], Input.ACTION.FIGHT_1, 0.50],
			[[0.30, 0.70], Input.ACTION.FIGHT_3, 0.50],

			// Getting serious

			// Line 1
			[[0.70, 0.25], Input.ACTION.FIGHT_1, 7.00],
			[[0.65, 0.25], Input.ACTION.FIGHT_1, 0.50],
			[[0.60, 0.20], Input.ACTION.FIGHT_2, 0.50],
			[[0.55, 0.15], Input.ACTION.FIGHT_3, 0.50],
			[[0.50, 0.15], Input.ACTION.FIGHT_3, 0.50],
			[[0.45, 0.20], Input.ACTION.FIGHT_4, 0.50],
			[[0.40, 0.20], Input.ACTION.FIGHT_4, 0.50],
			[[0.35, 0.15], Input.ACTION.FIGHT_3, 0.50],
			[[0.30, 0.25], Input.ACTION.FIGHT_1, 0.50],

			// Line 2
			[[0.30, 0.80], Input.ACTION.FIGHT_2, 1.50],
			[[0.35, 0.75], Input.ACTION.FIGHT_3, 0.50],
			[[0.40, 0.85], Input.ACTION.FIGHT_1, 0.50],
			[[0.45, 0.75], Input.ACTION.FIGHT_3, 0.50],
			[[0.50, 0.85], Input.ACTION.FIGHT_1, 0.50],
			[[0.55, 0.80], Input.ACTION.FIGHT_4, 0.50],
			[[0.60, 0.80], Input.ACTION.FIGHT_4, 0.50],
			[[0.65, 0.80], Input.ACTION.FIGHT_4, 0.50],
			[[0.70, 0.80], Input.ACTION.FIGHT_4, 0.50],

			// Left - squiggly down - right
			[[0.70, 0.20], Input.ACTION.FIGHT_3, 1.50],
			[[0.65, 0.20], Input.ACTION.FIGHT_3, 0.50],
			[[0.60, 0.20], Input.ACTION.FIGHT_3, 0.50],
			[[0.55, 0.20], Input.ACTION.FIGHT_3, 0.50],
			[[0.50, 0.20], Input.ACTION.FIGHT_3, 0.50],
			[[0.45, 0.25], Input.ACTION.FIGHT_4, 0.50],
			[[0.50, 0.30], Input.ACTION.FIGHT_1, 0.50],
			[[0.55, 0.35], Input.ACTION.FIGHT_2, 0.50],
			[[0.50, 0.45], Input.ACTION.FIGHT_1, 0.50],
			[[0.45, 0.50], Input.ACTION.FIGHT_4, 0.50],
			[[0.50, 0.55], Input.ACTION.FIGHT_1, 0.50],
			[[0.55, 0.60], Input.ACTION.FIGHT_2, 0.50],
			[[0.60, 0.60], Input.ACTION.FIGHT_2, 0.50],
			[[0.65, 0.60], Input.ACTION.FIGHT_2, 0.50],

			[[0.80, 0.40], Input.ACTION.FIGHT_4, 1.50],
			[[0.75, 0.40], Input.ACTION.FIGHT_4, 0.50],
			[[0.65, 0.40], Input.ACTION.FIGHT_1, 1.00],
			[[0.65, 0.30], Input.ACTION.FIGHT_1, 0.50],
			[[0.55, 0.30], Input.ACTION.FIGHT_2, 1.00],
			[[0.50, 0.30], Input.ACTION.FIGHT_2, 0.50],
			[[0.40, 0.30], Input.ACTION.FIGHT_3, 1.00],
			[[0.40, 0.40], Input.ACTION.FIGHT_3, 0.50],

			// Final
			[[0.80, 0.70], Input.ACTION.FIGHT_2, 1.50],
			[[0.70, 0.70], Input.ACTION.FIGHT_1, 0.50],
			[[0.65, 0.65], Input.ACTION.FIGHT_1, 0.50],
			[[0.60, 0.60], Input.ACTION.FIGHT_4, 0.50],
			[[0.55, 0.55], Input.ACTION.FIGHT_2, 0.50],
			[[0.50, 0.50], Input.ACTION.FIGHT_3, 0.50],
			[[0.45, 0.45], Input.ACTION.FIGHT_4, 0.50],
			[[0.40, 0.40], Input.ACTION.FIGHT_4, 0.50],
			[[0.35, 0.35], Input.ACTION.FIGHT_1, 0.50],
			[[0.30, 0.30], Input.ACTION.FIGHT_3, 0.50],
			[[0.25, 0.25], Input.ACTION.FIGHT_1, 0.50],

			[[0.15, 0.20], Input.ACTION.FIGHT_1, 1.50],
			[[0.15, 0.30], Input.ACTION.FIGHT_1, 0.50],
			[[0.15, 0.40], Input.ACTION.FIGHT_1, 0.50],
			[[0.15, 0.50], Input.ACTION.FIGHT_1, 0.50],
			[[0.15, 0.60], Input.ACTION.FIGHT_1, 0.50],
			[[0.15, 0.70], Input.ACTION.FIGHT_1, 0.50],
			[[0.15, 0.70], Input.ACTION.FIGHT_3, 2.00],
			[[0.15, 0.70], Input.ACTION.FIGHT_1, 2.00]
		];

		let t = 2;

		data.forEach( item => {
			item[0][0] = Math.round( item[0][0] * window.innerWidth );
			item[0][1] = Math.round( item[0][1] * window.innerHeight );
			item[2] += t;
			t = item[2];
		} );

		// Intro is not part of the goal.
		let goalPercent = 0.8;

		player.items.forEach( item => {
			if( !item.effect ) {
				return;
			}

			if( item.effect.goal ) {
				goalPercent = Math.min( goalPercent, item.effect.goal );
			}

			if( item.effect.time ) {
				Rhythm_Button.TIME_DIFF_MAX = Math.max( Rhythm_Button.TIME_DIFF_MAX, item.effect.time );
			}
		} );

		this.goal = Math.round( data.length * goalPercent );

		if( skipIntro ) {
			data = data.slice( 12 );
		}

		player.orientationX = -1;
		player.orientationY = 0;
		player.lastDir = 0;
		player.size = 10;
		this.player = player;
		this.ghostY = 0;

		this.rhythm = new Rhythm( data );
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

			let interval = setInterval( () => {
				if( this.beat.volume < 0.1 || this.beat.paused ) {
					this.beat.pause();
					clearInterval( interval );
				}
				else {
					this.beat.volume -= 0.1;
				}
			}, 250 );
		};

		this.beat = GameAudio.play( 'beat', true, 0.9 );
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
		if( this.rhythm.time >= 27 ) {
			let alpha = Math.min( 1, this.rhythm.time - 27 );
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
			progress = Math.min( 1, Math.max( 0, progress ) );

			let width = Math.round( window.innerWidth / 3 );
			let x = Renderer.centerX - Math.round( width / 2 );
			let y = window.innerHeight - 80;
			let marker = Math.round( ( 1 - this.goal / stats.total ) * width );

			// Border
			ctx.fillStyle = '#000';
			ctx.fillRect( x - 5, y + 5, 5, 15 );
			ctx.fillRect( x, y, width, 5 );
			ctx.fillRect( x, y + 20, width, 5 );
			ctx.fillRect( x + width, y + 5, 5, 15 );

			// Ghost energy
			let playerWidth = Math.round( progress * width );
			ctx.fillStyle = '#4B5E77';
			ctx.fillRect( x, y + 5, width - playerWidth, 15 );
			// Player energy
			ctx.fillStyle = '#C26F38';
			ctx.fillRect( x + width - playerWidth, y + 5, playerWidth, 15 );

			ctx.fillStyle = '#000';
			ctx.fillRect( x + marker, y + 5, 2, 15 );

			ctx.globalAlpha = 1;
		}

		// Player
		this.player.x = window.innerWidth - this.player.width - 80;
		this.player.y = window.innerHeight - this.player.height;
		this.player.draw( ctx );

		ctx.font = 'bold 21px sans-serif';
		ctx.textAlign = 'center';

		if( this.rhythm.time < 11 ) {
			ctx.fillText( 'HIT THE BUTTON SHORTLY BEFORE ITS TIMER RUNS OUT:', Renderer.centerX, window.innerHeight * 0.3 );
		}
		else if( this.rhythm.time < 13 ) {
			ctx.fillText( 'NOW FASTER.', Renderer.centerX, window.innerHeight * 0.4);
		}
		else if( this.rhythm.time > 25 && this.rhythm.time < 29 ) {
			ctx.fillText( 'TIME FOR THE REAL DEAL.', Renderer.centerX, window.innerHeight * 0.4);
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
				let level = new Level_1_1( {
					items: this.player.items,
					success: this.rhythm.stats.correct >= this.goal
				} );

				Renderer.changeLevel( level );
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
