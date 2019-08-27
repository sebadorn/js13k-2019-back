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

		this.ui_title = new UI_Text( 'How to send back a Ghost', 'bold 50px sans-serif', [255, 255, 255], 100, 300 );

		this.ui_collect = new UI_Text( '[Collect]', '16px sans-serif', [255, 255, 255], 0, 0 );
		this.ui_collect.visible = false;

		this.ui_bar = new UI_Bar( 0, 40, 600, 20 );
		this.ui_bar.centerX();
		this.ui_bar.total = 30;
		this.ui_bar.value = 30;

		this.player = new Player();
		this.player.x = 100;
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
		if( this.ui_bar.value <= 0 ) {
			Crafting.draw( ctx, this.player );
		}
		else {
			let height = Math.ceil( window.innerHeight * 0.8 );
			this.player.y = height - this.player.height;

			ctx.fillStyle = '#A9673D';
			ctx.fillRect( 0, 0, window.innerWidth, height );

			ctx.fillStyle = '#303040';
			ctx.fillRect( 0, height, window.innerWidth, window.innerHeight - height );

			this.player.draw( ctx );
			this.ui_title.draw( ctx );
			this.ui_collect.draw( ctx );
			this.ui_bar.draw( ctx );
		}
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		if( this.ui_bar.value <= 0 ) {
			if( Input.isPressed( Input.ACTION.INTERACT ) ) { // TODO: use other way to progress
				Renderer.changeLevel( new Level_1_2( this.player ) );
			}
			else {
				Crafting.update( dt, this.player );
			}
		}
		else {
			let dir = Input.getDirections();
			this.player.move( dir );

			this.checkItems();

			this.ui_bar.value -= dt / Renderer.TARGET_FPS;
		}
	}


}
