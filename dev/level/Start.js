'use strict';


class Level_Start extends Level {


	/**
	 *
	 * @constructor
	 * @extends {Level}
	 */
	constructor() {
		super();

		this.ui = {
			gp: new UI_Text( Lang.startGamepad, '16px sans-serif', [255, 255, 255], 100, 200 ),
			start: new UI_Text( Lang.start, '16px sans-serif', [255, 255, 255], 100, 240 ),
			title: new UI_Text( Lang.title, 'bold 50px sans-serif', [255, 255, 255], 100, 100 )
		};

		this.ui.gp.blink();

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
		this.ui.title.draw( ctx );
		this.ui.gp.draw( ctx );
		this.ui.start.draw( ctx );
	}


	/**
	 *
	 * @override
	 */
	update( dt ) {
		this.ui.gp.update( dt );
	}


}
