'use strict';


class Level_1_1 extends Level {


	/**
	 * Episode 1: How to send back a Ghost
	 * @constructor
	 * @extends {Level}
	 * @param {?object} stats
	 */
	constructor( stats ) {
		super();

		this.items = [
			new Item( 'Salt Shaker', 450, 0, 3, Item.drawSaltShaker ),
			new Item( 'Iron Pan', 0, 0, 5, Item.drawPan )
		];

		this.ui_title = new UI_Text(
			'how to send back a Ghost'.toUpperCase(),
			'21px sans-serif', [255, 255, 255], 0, 28, true
		);

		this.ui_challenge = new UI_Text( 'challenge'.toUpperCase(), 'bold 21px sans-serif', [255, 255, 255], 0, 0, true );
		this.ui_challenge.visible = false;

		this.ui_collect = new UI_Text( '', 'bold 18px sans-serif', [255, 255, 255], 0, 0, true );

		this.player = new Player( 5 );
		this.player.x = 100;
		this.player.orientationX = 1;
		this.player.orientationY = 0;

		this.ghostDir = 1;
		this.ghostY = 0;
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	checkItems( ctx ) {
		this.ui_collect.visible = false;

		this.items.forEach( ( item, i ) => {
			if( item.collected ) {
				return;
			}

			let dist = Math.abs( item.centerX - this.player.x );

			if( dist < 100 ) {
				this.ui_collect.x = item.centerX;
				this.ui_collect.y = item.y - 20;
				this.ui_collect.text = ( 'collect ' + item.name ).toUpperCase();
				this.ui_collect.visible = true;

				UI_Symbol.draw( ctx, Input.ACTION.INTERACT, [item.centerX - 10, item.y - 80, 20] );

				if( Input.isPressed( Input.ACTION.INTERACT, true ) ) {
					this.player.items.push( item );
					item.collected = true;
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

		ctx.strokeStyle = '#000';

		// Background color
		ctx.fillStyle = '#1A1F26';
		ctx.fillRect( 0, 0, window.innerWidth, height );

		// Drawer
		ctx.fillStyle = '#0A0A0A';
		ctx.fillRect( 420, height - 100, 120, 90 );
		ctx.fillRect( 420, height - 10, 10, 10 );
		ctx.fillRect( 530, height - 10, 10, 10 );
		ctx.fillStyle = '#202014';
		ctx.fillRect( 430, height - 90, 100, 70 );
		ctx.fillStyle = '#0A0A0A';
		ctx.fillRect( 420, height - 100, 120, 10 );
		ctx.fillRect( 420, height - 60, 120, 10 );
		ctx.fillRect( 460, height - 80, 40, 10 );
		ctx.fillRect( 460, height - 40, 40, 10 );

		// Door
		ctx.fillStyle = 'rgba(194,111,56,0.8)';
		ctx.beginPath();
		ctx.moveTo( 0, height - 340 );
		ctx.lineTo( 400, height );
		ctx.lineTo( 0, height );
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = '#000';
		ctx.fillRect( 0, height - 340, 5, 340 );

		// Lamp
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.moveTo( Renderer.centerX, 0 );
		ctx.lineTo( Renderer.centerX, height - 500 );
		ctx.closePath();
		ctx.stroke();
		ctx.fillStyle = '#000';
		ctx.fillRect( Renderer.centerX - 50, height - 500, 100, 50 );

		// Ghost
		let y = Math.round( height - 320 + Math.sin( this.ghostY ) * 20 );

		if( this.ghostDir < 0 ) {
			ctx.setTransform( this.ghostDir, 0, 0, 1, ( Renderer.centerX - 80 ) * 2 + 160, 0 );
		}

		ctx.drawImage( Renderer.sprites.gh, 0, 0, 16, 32, Renderer.centerX - 80, y, 160, 320 );
		ctx.setTransform( 1, 0, 0, 1, 0, 0 );

		// Lamp light
		let alpha = ( Math.random() > 0.99 ) ? 0.2 : 0;
		ctx.fillStyle = `rgba(221,238,255,${ alpha })`;
		ctx.beginPath();
		ctx.moveTo( Renderer.centerX - 50, height - 450 );
		ctx.lineTo( Renderer.centerX - 200, height );
		ctx.lineTo( Renderer.centerX + 200, height );
		ctx.lineTo( Renderer.centerX + 50, height - 450 );
		ctx.closePath();
		ctx.fill();

		// Player
		this.player.y = height - this.player.height;
		this.player.draw( ctx );

		// Bottom border / Floor
		ctx.fillStyle = '#293340';
		ctx.fillRect( 0, height, window.innerWidth, window.innerHeight - height );
		ctx.lineWidth = 10;
		ctx.beginPath();
		ctx.moveTo( 0, height + 5 );
		ctx.lineTo( window.innerWidth, height + 5 );
		ctx.closePath();
		ctx.stroke();

		// Items
		this.items[0].y = height - 112;
		this.items[1].y = height - 60;
		this.checkItems( ctx );
		this.items.forEach( item => !item.collected && item.draw( ctx ) );

		// Text and prompts
		this.ui_title.draw( ctx );
		this.ui_collect.draw( ctx );

		this.ui_challenge.y = height - 160;
		this.ui_challenge.centerX();
		this.ui_challenge.draw( ctx );

		if( this.ui_challenge.visible ) {
			UI_Symbol.draw( ctx, Input.ACTION.INTERACT, [Renderer.centerX - 10, height - 230, 20] );
		}
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.ui_title.centerX();

		this.player.update( dt, Input.getDirections() );

		if( this.player.x < 20 ) {
			this.player.x = 20;
			this.player.lastDir = 0;
			this.player.orientationY = 1;
		}
		else if( this.player.x > window.innerWidth - 40 ) {
			this.player.x = window.innerWidth - 40;
			this.player.lastDir = 0;
		}

		this.ghostY = this.ghostY + dt * 0.025;

		if( this.ghostY > Math.PI * 2 ) {
			this.ghostY -= Math.PI * 2;
		}

		let dist = this.player.x + this.player.width / 2 - Renderer.centerX;
		this.ghostDir = ( dist < 0 ) ? -1 : 1;

		if( Math.abs( dist ) <= 100 ) {
			this.ui_challenge.visible = true;

			if( Input.isPressed( Input.ACTION.INTERACT ) ) {
				Renderer.changeLevel( new Level_1_2( this.player ) );
			}
		}
		else {
			this.ui_challenge.visible = false;
		}

		this.items[1].x = window.innerWidth - 400;
	}


}
