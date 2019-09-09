'use strict';


class Level_Credits extends Level {


	/**
	 *
	 * @constructor
	 * @extends {Level}
	 */
	constructor() {
		super();

		this.player = new Player( 20 );
		this.ui_text = new UI_Text( 'Thanks for playing!', 'italic 56px serif', [255, 255, 255], 0, 0, true );
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		// Fade from orange to black.
		let pc = Math.min( 1, this.progress / 10 );
		let r = ( 1 - pc ) * 194 + pc;
		let g = ( 1 - pc ) * 111 + pc;
		let b = ( 1 - pc ) *  56 + pc;

		ctx.fillStyle = `rgb(${ ~~r },${ ~~g },${ ~~b })`;
		ctx.fillRect( 0, 0, window.innerWidth, window.innerHeight );

		this.player.draw( ctx );
		this.ui_text.draw( ctx );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		super.update( dt );

		let textY = 0.5;

		if( this.progress < 10 ) {
			let dir = Input.getDirections();
			this.player.update( dt, { x: 0, y: dir.y } );
			this.player.x = Renderer.centerX - Math.round( this.player.width / 2 );
			this.player.y = window.innerHeight - this.player.height;
		}
		// Have the character walk out of screen.
		else {
			if( this.player.x < window.innerWidth + 100 ) {
				this.player.update( dt, { x: 1 } );
			}

			// Shortly after have the title scroll down to the center.
			if( this.progress >= 13 ) {
				textY += Math.min( 0.5, ( this.progress - 13 ) / 4 );
			}
		}

		this.ui_text.x = Renderer.centerX;
		this.ui_text.y = Math.round( Renderer.centerY * textY );
	}


}
