'use strict';


/**
 * @namespace Renderer
 */
const Renderer = {


	COLOR: {
		BLACK: '#000',
		BLUE_1: '#4B5E77',
		BLUE_2: '#293340',
		BLUE_3: '#1A1F26',
		MOD_1: '#7D3A19',
		MOD_2: '#37536E',
		ORANGE: '#C26F38',
		WHITE: '#FFF'
	},

	TARGET_FPS: 60,

	last: 0,
	sprites: {
		'gh': null,
		'sy': null
	},


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
	 */
	draw() {
		this.clear();
		this.level && this.level.draw( this.ctx );
	},


	/**
	 * Draw a border.
	 */
	drawBorder() {
		this.ctx.lineWidth = 100;
		this.ctx.strokeStyle = Renderer.COLOR.BLUE_3;
		this.ctx.strokeRect( 0, 0, window.innerWidth, window.innerHeight );
	},


	/**
	 * Draw the pause screen.
	 */
	drawPause() {
		this.clear();

		this.ctx.fillStyle = Renderer.COLOR.ORANGE;
		this.ctx.fillRect( 0, 0, window.innerWidth, window.innerHeight );

		this.ui_pause.centerX();
		this.ui_pause.y = Renderer.centerY - 80;
		this.ui_pause.draw( this.ctx );

		UI_Symbol.draw( this.ctx, Input.ACTION.INTERACT, [Renderer.centerX - 15, Renderer.centerY - 15, 30] );
	},


	/**
	 * Initialize the renderer.
	 * @param {function} cb
	 */
	init( cb ) {
		this.cnv = document.getElementById( 'c' );
		this.ctx = this.cnv.getContext( '2d' );

		this.ui_pause = new UI_Text(
			'PAUSED', 'bold 42px sans-serif', [255, 255, 255], 0, 0, true
		);

		this.loadImages( () => {
			window.addEventListener( 'resize', () => this.resize() );
			this.resize();

			cb();
		} );
	},


	/**
	 * Load asset images.
	 * @param {function} cb
	 */
	loadImages( cb ) {
		let list = [
			'gh', // ghost
			'sy'  // symbols
		];

		let next = ( i ) => {
			if( i >= list.length ) {
				cb();
				return;
			}

			let value = list[i];
			let img = new Image();
			img.src = Renderer.ASSETS + `${ value }.gif`;
			img.onload = () => {
				this.sprites[value] = img;
				next( i + 1 );
			};
		};

		next( 0 );
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
			// document.querySelector( 'title' ).textContent = Math.round( dt * this.TARGET_FPS ) + ' FPS';

			this.ctx.imageSmoothingEnabled = false;
			this.ctx.lineWidth = 1;
			this.ctx.textBaseline = 'alphabetic';

			if( this.isPaused ) {
				this.drawPause( dt );

				if(
					Input.isPressed( Input.ACTION.INTERACT, true ) ||
					Input.isPressed( Input.ACTION.ESC, true )
				) {
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
	 * Resize the canvas.
	 */
	resize() {
		this.cnv.height = window.innerHeight;
		this.cnv.width = window.innerWidth;

		this.centerX = Math.round( window.innerWidth / 2 );
		this.centerY = Math.round( window.innerHeight / 2 );
	}


};
