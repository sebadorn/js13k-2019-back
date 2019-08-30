'use strict';


class Level_Start extends Level {


	/**
	 *
	 * @constructor
	 * @extends {Level}
	 */
	constructor() {
		super();

		this.ui_title = new UI_Text( 'How to send back…', 'italic 48px serif', [255, 255, 255], 0, 100, true );
		this.ui_gp = new UI_Text(
			'To activate a gamepad, press a button on it.',
			'21px sans-serif', [255, 255, 255], 0, 200, true
		);
		this.ui_start = new UI_Text( 'TO START PRESS', '21px sans-serif', [255, 255, 255], 0, 262, true );

		this.ui_gp.blink();

		Input.on( 'gp_connect', () => {
			this.ui_gp.visible = false;
		} );

		Input.on( 'gp_disconnect', () => {
			this.ui_gp.visible = true;
		} );

		this.player = new Player( 10 );
		this.walk = false;
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		ctx.fillStyle = '#F07727';
		ctx.fillRect( 0, 0, window.innerWidth, window.innerHeight );

		this.player.draw( ctx );

		this.ui_title.draw( ctx );
		this.ui_gp.draw( ctx );
		this.ui_start.draw( ctx );

		UI_Symbol.draw( ctx, Input.ACTION.INTERACT, [window.innerWidth / 2 + 105, 240, 28] );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.ui_title.centerX();
		this.ui_gp.centerX();
		this.ui_start.centerX();
		this.ui_gp.update( dt );

		this.player.y = window.innerHeight - 320;

		// Character is out of view, change level.
		if( this.player.x > window.innerWidth * 1.5 ) {
			Renderer.changeLevel( new Level_1_1() );
			// Renderer.changeLevel( new Level_1_2( [] ) );
		}
		// Update animation of character walking out.
		else if( this.walk ) {
			this.player.update( dt, { x: 1 } );
		}
		else if( Input.isPressed( Input.ACTION.INTERACT, true ) ) {
			new Level_Intro();
			new Level_1_2( {} );

			this.walk = true;
		}
		// Readjust character x position in case window width changes.
		else {
			this.player.x = window.innerWidth / 2 - 160;
		}
	}


}
