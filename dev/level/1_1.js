'use strict';


/**
 * Episode 1: How to send back a Ghost
 * Phase 1: Gathering supplies + Crafting
 * Scene: Kitchen
 */
class Level_1_1 extends Level {


	/**
	 *
	 * @constructor
	 * @extends {Level}
	 */
	constructor() {
		super();

		this.ui_text = new UI_Text( 'How to send back a Ghost', 'bold 50px sans-serif', [255, 255, 255], 100, 300 );

		this.ui_bar = new UI_Bar( 0, 40, 600, 20 );
		this.ui_bar.centerX();
		this.ui_bar.total = 30;
		this.ui_bar.value = 30;

		this.player = new Player();
		this.player.x = 100;
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		let height = Math.ceil( window.innerHeight * 0.8 );
		this.player.y = height - this.player.height;

		ctx.fillStyle = '#A9673D';
		ctx.fillRect( 0, 0, window.innerWidth, height );

		ctx.fillStyle = '#303040';
		ctx.fillRect( 0, height, window.innerWidth, window.innerHeight - height );

		this.player.draw( ctx );
		this.ui_text.draw( ctx );
		this.ui_bar.draw( ctx );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		if( this.ui_bar.value <= 0 ) {
			// TODO: Gathering phase ended
			return;
		}

		let dir = Input.getDirections();
		this.player.move( dir );

		this.ui_bar.value -= dt / Renderer.TARGET_FPS;
	}


}
