'use strict';


/**
 * @namespace Renderer
 */
const Renderer = {


	cnv: null,
	ctx: null,
	last: 0,
	level: null,


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
	 * Initialize the renderer.
	 */
	init() {
		this.cnv = document.getElementById( 'c' );
		this.ctx = this.cnv.getContext( '2d' );

		window.addEventListener( 'resize', () => this.resize() );
		this.resize();
	},


	/**
	 * Start the main loop. Update logic, render to the canvas.
	 * @param {number} [timestamp = 0]
	 */
	mainLoop( timestamp = 0 ) {
		Input.update();

		if( timestamp > 0 ) {
			let diff = timestamp - this.last; // Time that passed between frames. [ms]

			// Target speed of 60 FPS (=> 1000 / 60 = 50 / 3 [ms]).
			// diff / ( 1000 / 60 ) <=> diff * 3 / 50
			const dt = diff * 3 / 50;

			// Uncomment to show FPS in window title:
			// document.querySelector( 'title' ).textContent = ~~( dt * 60 ) + ' FPS';

			this.level && this.level.update( dt );
			this.draw( dt );
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
