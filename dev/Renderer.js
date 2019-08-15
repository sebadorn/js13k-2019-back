'use strict';


/**
 * @namespace Renderer
 */
const Renderer = {


	cnv: null,
	ctx: null,
	last: 0,


	/**
	 * Draw to the canvas.
	 */
	draw() {
		// TODO:
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
		if( timestamp > 0 ) {
			let diff = timestamp - this.last; // time that passed between frames

			// TODO: update game logic
			this.draw();
		}

		this.last = timestamp;

		requestAnimationFrame( () => this.mainLoop() );
	},


	/**
	 * Resize the cnv.
	 */
	resize() {
		this.cnv.height = window.innerHeight;
		this.cnv.width = window.innerWidth;
	}


};
