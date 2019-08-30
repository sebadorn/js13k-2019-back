'use strict';


class Level_1_1 extends Level {


	/**
	 * Episode 1: How to send back a Ghost
	 * Phase 1: Gathering supplies + Crafting
	 * @constructor
	 * @extends {Level}
	 */
	constructor() {
		super();

		this.items = [
			new Item( 'Salt Shaker', 100 )
		];

		this.ui_title = new UI_Text(
			'How to send back a Ghost'.toUpperCase(),
			'21px sans-serif', [255, 255, 255], 0, 28, true
		);

		this.ui_collect = new UI_Text( '[Collect]', '16px sans-serif', [255, 255, 255], 0, 0 );
		this.ui_collect.visible = false;

		this.player = new Player( 5 );
		this.player.x = 100;
		this.player.orientation = 1;

		this.ghostY = 0;
	}


	/**
	 *
	 */
	checkItems() {
		this.ui_collect.visible = false;

		this.items.forEach( ( item, i ) => {
			let dist = Math.abs( item.x - this.player.x );

			if( dist < 100 ) {
				this.ui_collect.x = item.x;
				this.ui_collect.y = Math.round( window.innerHeight * 0.8 );
				this.ui_collect.visible = true;

				if( Input.isPressed( Input.ACTION.INTERACT, true ) ) {
					this.player.items.push( item );
					this.items.splice( i, 1 );
				}
			}
		} );
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		let height = Math.ceil( window.innerHeight * 0.8 );
		this.player.y = height - 160;

		ctx.fillStyle = '#A9673D';
		ctx.fillRect( 0, 0, window.innerWidth, height );

		let y = height - 320 + Math.sin( this.ghostY ) * 20;
		ctx.drawImage( Renderer.sprites.gh, 0, 0, 16, 32, window.innerWidth / 2 - 80, ~~y, 160, 320 );

		this.player.draw( ctx );

		ctx.fillStyle = '#303040';
		ctx.fillRect( 0, height, window.innerWidth, window.innerHeight - height );

		this.ui_title.draw( ctx );
		this.ui_collect.draw( ctx );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		// if( this.ui_bar.value <= 0 ) {
		// 	if( Input.isPressed( Input.ACTION.INTERACT ) ) { // TODO: use other way to progress
		// 		Renderer.changeLevel( new Level_1_2( this.player ) );
		// 	}
		// }
		// else {
			this.ui_title.centerX();

			let dir = Input.getDirections();
			this.player.update( dt, dir );

			this.ghostY = this.ghostY + dt * 0.025;

			if( this.ghostY > Math.PI * 2 ) {
				this.ghostY -= Math.PI * 2;
			}

			this.checkItems();
		// }
	}


}
