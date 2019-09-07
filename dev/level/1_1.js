'use strict';


class Level_1_1 {


	/**
	 * Episode 1: How to send back a Ghost
	 * @constructor
	 * @param {?object} flags
	 * @param {boolean} flags.success
	 */
	constructor( flags ) {
		this.flags = flags || {};

		this.items = [
			new Item( 'Salt Shaker', 450, 0, 3, Item.drawSaltShaker ),
			new Item( 'Iron Pan', 0, 0, 5, Item.drawPan )
		];

		this.ui_challenge = new UI_Text( 'challenge'.toUpperCase(), 'bold 21px sans-serif', [255, 255, 255], 0, 0, true );
		this.ui_challenge.visible = false;

		this.ui_collect = new UI_Text( '', 'bold 18px sans-serif', [255, 255, 255], 0, 0, true );

		this.player = new Player( 5 );
		this.player.x = this.flags.success ? Renderer.centerX + 100 : 100;
		this.player.orientationX = this.flags.success ? -1 : 1;
		this.player.orientationY = 0;

		this.ghostDir = 1;
		this.ghostY = 0;

		this.progress = 0;

		this.mod = new Moderation( Moderation.SCRIPT.LEVEL_1_1 );

		this.mod1 = new Player( 3 );
		this.mod1.color = '#77172F';
		this.mod1.face = 4;
		this.mod1.orientationX = 1;
		this.mod1.progress = 10;
		this.mod1.x = 40;
		this.mod1.y = 80;

		this.mod2 = new Player( 3 );
		this.mod2.color = '#3B5C2B';
		this.mod2.face = 4;
		this.mod2.orientationX = -1;
		this.mod2.progress = 35;
		this.mod2.x = this.mod1.x + this.mod1.width + 60;
		this.mod2.y = 80;
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

		// Ghost sinks into floor.
		if( this.flags.success ) {
			y = height - 320;

			if( this.progress >= 2 ) {
				y = Math.round( y + 420 * ( this.progress - 2 ) / 5 );
			}
		}

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

		this.drawMod( ctx );

		// Items
		this.items[0].y = height - 112;
		this.items[1].y = height - 60;
		this.checkItems( ctx );
		this.items.forEach( item => !item.collected && item.draw( ctx ) );

		// Text and prompts
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
	 * @param {CanvasRenderingContext2D} ctx
	 */
	drawMod( ctx ) {
		let [talkerID, face, text] = this.mod.getText();

		let width = this.mod1.width + this.mod2.width + 100;
		let height = this.mod1.height + 60;

		ctx.fillStyle = '#000';
		ctx.fillRect( 20, 20, width, height );
		ctx.fillStyle = 'rgba(0,0,0,0.5)';
		ctx.fillRect( 20 + width, 20, window.innerWidth - 40 - width, height );

		if( text.length ) {
			let x = 50;
			let y = 65;

			ctx.fillStyle = '#FFF';
			ctx.font = '21px sans-serif';
			ctx.textAlign = 'left';

			if( this.mod.step === this.mod.script.length - 1 ) {
				x = Renderer.centerX - width;
				y = Math.round( height / 2 ) + 30;

				ctx.textAlign = 'center';
				ctx.font = 'bold italic 24px sans-serif';

				this.mod2.face = 4;
			}

			text.forEach( ( t, i ) => {
				ctx.fillText( t, x + width, y + i * 42 );
			} );
		}

		// Right
		if( talkerID ) {
			this.mod2.face = face;
		}
		// Left
		else {
			this.mod1.face = face;
		}

		this.mod1.draw( ctx );
		this.mod2.draw( ctx );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.progress += dt / Renderer.TARGET_FPS;

		if( !this.flags.success ) {
			this.mod.update( dt );
			this.mod1.update( dt, { x: 0 } );
			this.mod2.update( dt, { x: 0 } );

			this.player.update( dt, Input.getDirections() );

			if( this.player.x < 20 ) {
				this.player.x = 20;
				this.player.lastDir = 0;
			}
			else if( this.player.x > window.innerWidth - 40 ) {
				this.player.x = window.innerWidth - 40;
				this.player.lastDir = 0;
			}
		}
		// Watch the ghost sink into the floor.
		// Then skip to the credits.
		else {
			let y = -1;

			if( this.progress > 5 ) {
				y = 1;
			}
			else if( this.progress > 3.5 ) {
				y = 0;
			}

			this.player.update( dt, { x: 0, y } );

			if( this.progress >= 12 ) {
				Renderer.level = new Level_Credits();
			}
		}

		this.ghostY = this.ghostY + dt * 0.025;

		if( this.ghostY > Math.PI * 2 ) {
			this.ghostY -= Math.PI * 2;
		}

		let dist = this.player.x + this.player.width / 2 - Renderer.centerX;
		this.ghostDir = ( dist < 0 ) ? -1 : 1;

		if( !this.flags.success && Math.abs( dist ) <= 100 ) {
			this.ui_challenge.visible = true;

			if( Input.isPressed( Input.ACTION.INTERACT ) ) {
				Renderer.changeLevel( new Level_1_2( this.player, true ) );
			}
		}
		else {
			this.ui_challenge.visible = false;
		}

		this.items[1].x = window.innerWidth - 400;
	}


}
