'use strict';


class Level_Start extends Level {


	/**
	 *
	 * @constructor
	 * @extends {Level}
	 */
	constructor() {
		super();

		this.ui_gp = new UI_Text(
			'To activate a gamepad, press a button on it.',
			'16px sans-serif', [255, 255, 255], 100, 200
		);
		this.ui_start = new UI_Text( 'START', 'bold 21px sans-serif', [255, 255, 255], 140, 262 );
		this.ui_title = new UI_Text( 'How to send back...', 'bold 50px sans-serif', [255, 255, 255], 100, 100 );

		this.ui_gp.blink();

		Input.on( 'gp_connect', () => {
			this.ui_gp.visible = false;
		} );

		Input.on( 'gp_disconnect', () => {
			this.ui_gp.visible = true;
		} );
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		this.ui_title.draw( ctx );
		this.ui_gp.draw( ctx );
		this.ui_start.draw( ctx );

		UI_Symbol.draw( ctx, Input.ACTION.INTERACT, [100, 240, 28] );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.ui_gp.update( dt );

		if( Input.isPressed( Input.ACTION.INTERACT, true ) ) {
			// Renderer.changeLevel( new Level_Intro() );
			new Level_Intro(); // TODO: remove
			Renderer.changeLevel( new Level_1_2( [] ) );
		}
	}


}
