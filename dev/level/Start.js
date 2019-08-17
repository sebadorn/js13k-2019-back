'use strict';


class Level_Start extends Level {


	/**
	 *
	 * @constructor
	 * @extends {Level}
	 */
	constructor() {
		Input.on( 'gp_connect', () => {
			// TODO:
		} );

		Input.on( 'gp_disconnect', () => {
			// TODO:
		} );
	}


	/**
	 *
	 * @override
	 */
	draw( ctx ) {
		ctx.fillStyle = '#FFF';
		ctx.font = 'bold 50px sans-serif';
		ctx.fillText( Lang.title, 100, 100 );

		// TODO: add start option
		// TODO: add gamepad hint ("press button to enable")
	}


	update( dt ) {
		//
	}


}
