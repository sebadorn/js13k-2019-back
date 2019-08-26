'use strict';


/**
 * @namespace Renderer
 */
const Renderer = {


	TARGET_FPS: 60,

	cnv: null,
	ctx: null,
	last: 0,
	level: null,
	sprites: {},


	/**
	 *
	 * @param {Level} level
	 */
	changeLevel( level ) {
		Input.off( 'gp_connect' );
		Input.off( 'gp_disconnect' );

		this.level = level;
	},


	/**
	 * Clear the canvas.
	 */
	clear() {
		this.ctx.clearRect( 0, 0, this.cnv.width, this.cnv.height );
	},


	/**
	 * Draw to the canvas.
	 * @param {number} dt - Factor of difference between target FPS and actual value.
	 *     = 1.0: 60 FPS
	 *     > 1.0: Less FPS
	 *     < 1.0: More FPS
	 */
	draw( dt ) {
		this.clear();
		this.level && this.level.draw( this.ctx );
	},


	/**
	 * Draw the pause screen.
	 * @param {number} dt
	 */
	drawPause( dt ) {
		this.clear();
		this.ui_pause.draw( this.ctx );
	},


	/**
	 * Initialize the renderer.
	 * @param {function} cb
	 */
	init( cb ) {
		this.cnv = document.getElementById( 'c' );
		this.ctx = this.cnv.getContext( '2d' );

		this.ui_pause = new UI_Text( Lang.pause, 'bold 50px sans-serif', [255, 255, 255], 100, 300 );

		let symbols = new Image();
		symbols.src = 'assets/symbols.gif';
		symbols.onload = () => {
			this.sprites.symbols = symbols;

			window.addEventListener( 'resize', () => this.resize() );
			this.resize();

			window.addEventListener( 'blur', () => this.isPaused = true );

			cb();
		};
	},


	/**
	 * Start the main loop. Update logic, render to the canvas.
	 * @param {number} [timestamp = 0]
	 */
	mainLoop( timestamp = 0 ) {
		Input.update();

		if( timestamp > 0 ) {
			let diff = timestamp - this.last; // Time that passed between frames. [ms]

			// Target speed of 60 FPS (=> 1000 / 60 ~= 16.667 [ms]).
			let dt = diff / 1000 * this.TARGET_FPS;

			// Uncomment to show FPS in window title:
			// document.querySelector( 'title' ).textContent = ~~( dt * this.TARGET_FPS ) + ' FPS';

			this.ctx.imageSmoothingEnabled = false;

			if( this.isPaused ) {
				this.drawPause( dt );

				if( Input.isPressed( Input.ACTION.INTERACT, true ) ) {
					this.isPaused = false;
				}
			}
			else {
				if( Input.isPressed( Input.ACTION.ESC, true ) ) {
					this.isPaused = true;
				}
				else {
					this.level && this.level.update( dt );
					this.draw( dt );
				}
			}
		}

		this.last = timestamp;

		requestAnimationFrame( t => this.mainLoop( t ) );
	},


	/**
	 * Resize the cnv.
	 */
	resize() {
		this.cnv.height = window.innerHeight;
		this.cnv.width = window.innerWidth;
	}


};
