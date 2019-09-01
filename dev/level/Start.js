'use strict';


class Level_Start extends Level {


	/**
	 *
	 * @constructor
	 * @extends {Level}
	 */
	constructor() {
		super();

		this.ui_title = new UI_Text( 'How to send back…', 'italic 72px serif', [255, 255, 255], 0, 0, true );
		this.ui_gp = new UI_Text(
			// Why toUpperCase() instead of just writing it? Because
			// this way it works better for the ZIP compression.
			'to activate a gamepad, press a button on it.'.toUpperCase(),
			'21px sans-serif', [255, 255, 255], 0, 0, true
		);
		this.ui_start = new UI_Text( 'to start press'.toUpperCase(), '21px sans-serif', [255, 255, 255], 0, 0, true );

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
		ctx.fillStyle = '#C26F38';
		ctx.fillRect( 0, 0, window.innerWidth, window.innerHeight );

		this.player.draw( ctx );
		this.ui_title.draw( ctx );

		if( !this.walk ) {
			this.ui_gp.draw( ctx );
			this.ui_start.draw( ctx );
			UI_Symbol.draw( ctx, Input.ACTION.INTERACT, [window.innerWidth / 2 + 84, this.player.y - 73, 28] );
		}

		ctx.lineWidth = 100;
		ctx.strokeStyle = '#1A1F26';
		ctx.strokeRect( 0, 0, window.innerWidth, window.innerHeight );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.ui_title.y = Math.round( window.innerHeight / 3 );
		this.ui_title.centerX();

		this.player.y = window.innerHeight - this.player.height - 50;

		this.ui_gp.centerX();
		this.ui_gp.update( dt );
		this.ui_gp.y = this.player.y - 160;

		this.ui_start.centerX();
		this.ui_start.x -= 20;
		this.ui_start.y = this.player.y - 50;

		// Character is out of view, change level.
		if( this.player.x > window.innerWidth * 1.2 ) {
			Renderer.changeLevel( new Level_1_1() );
			// Renderer.changeLevel( new Level_1_2( this.player ) );
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
			this.player.x = ( window.innerWidth - this.player.width ) / 2;
			this.player.update( dt, { x: 0 } );
		}
	}


}
