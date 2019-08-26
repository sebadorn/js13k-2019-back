'use strict';


class Level_Start extends Level {


	/**
	 *
	 * @constructor
	 * @extends {Level}
	 */
	constructor() {
		super();

		this.ui_gp = new UI_Text( Lang.startGamepad, '16px sans-serif', [255, 255, 255], 100, 200 );
		this.ui_start = new UI_Text( Lang.start, '16px sans-serif', [255, 255, 255], 100, 240 );
		this.ui_title = new UI_Text( Lang.title, 'bold 50px sans-serif', [255, 255, 255], 100, 100 );

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

		UI_Symbol.draw( ctx, Input.ACTION.LEFT, [100, 400, 40] );
		UI_Symbol.draw( ctx, Input.ACTION.RIGHT, [150, 400, 40] );
		UI_Symbol.draw( ctx, Input.ACTION.UP, [200, 400, 40] );
		UI_Symbol.draw( ctx, Input.ACTION.DOWN, [250, 400, 40] );
		UI_Symbol.draw( ctx, Input.ACTION.FIGHT_1, [300, 400, 40] );
		UI_Symbol.draw( ctx, Input.ACTION.FIGHT_2, [350, 400, 40] );
		UI_Symbol.draw( ctx, Input.ACTION.FIGHT_3, [400, 400, 40] );
		UI_Symbol.draw( ctx, Input.ACTION.FIGHT_4, [450, 400, 40] );
		UI_Symbol.draw( ctx, Input.ACTION.INTERACT, [500, 400, 40] );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.ui_gp.update( dt );

		if( Input.isPressed( Input.ACTION.INTERACT, true ) ) {
			Renderer.changeLevel( new Level_Intro() );
		}
	}


}
