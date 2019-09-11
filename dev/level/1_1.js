'use strict';


class Level_1_1 extends Level {


	/**
	 * Episode 1: How to send back a Ghost
	 * @constructor
	 * @extends {Level}
	 * @param {?object} flags
	 * @param {Item[]}  flags.items   - Previously collected items.
	 * @param {boolean} flags.success
	 */
	constructor( flags ) {
		super();

		document.head.querySelector( 'title' ).textContent = 'S2E1: How to send back a ghost';

		this.flags = flags || {};

		this.items = [
			new Item(
				'SALT SHAKER',
				'Bolster your ghost defense!\nMore time for button prompts.',
				{ time: 1.5 },
				450, 0, 3, Item.drawSaltShaker
			),
			new Item(
				'IRON PAN',
				'Become more convincing.\nMore mistakes allowed.',
				{ goal: 0.7 },
				0, 0, 5, Item.drawPan
			)
		];

		this.ui_challenge = new UI_Text( 'CHALLENGE', 'bold 21px sans-serif', [255, 255, 255], 0, 0, true );
		this.ui_challenge.visible = false;

		this.ui_collect = new UI_Text( '', 'bold 18px sans-serif', [255, 255, 255], 0, 0, true );

		this.player = new Player( 5 );
		this.player.x = this.flags.success ? Renderer.centerX + 100 : 100;
		this.player.orientationX = this.flags.success ? -1 : 1;
		this.player.orientationY = 0;

		if( Array.isArray( this.flags.items ) ) {
			this.flags.items.forEach( usedItem => {
				this.items.forEach( item => {
					if( item.name === usedItem.name ) {
						this.player.items.push( item );
						item.collected = true;
					}
				} );
			} );
		}

		this.playerMirror = new Player( 5 );

		this.ghostDir = 1;
		this.ghostY = 0;

		if( !this.flags.success ) {
			this.mod = new Moderation( Moderation.SCRIPT.LEVEL_1_1 );

			this.mod1 = new Player( 3 );
			this.mod1.color = Renderer.COLOR.MOD_1;
			this.mod1.face = 4;
			this.mod1.orientationX = 1;
			this.mod1.progress = 10;
			this.mod1.x = 40;
			this.mod1.y = 80;

			this.mod2 = new Player( 3 );
			this.mod2.color = Renderer.COLOR.MOD_2;
			this.mod2.face = 4;
			this.mod2.orientationX = -1;
			this.mod2.progress = 35;
			this.mod2.x = this.mod1.x + this.mod1.width + 40;
			this.mod2.y = 80;
		}

		this.bottomHeight = 200;
	}


	/**
	 * Draw the item description.
	 * @private
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number}                   height
	 * @param {object}                   item
	 */
	_drawDesc( ctx, height, item ) {
		let x = Renderer.centerX - 200;

		ctx.fillStyle = Renderer.COLOR.WHITE;
		ctx.font = 'bold italic 21px sans-serif';
		ctx.textAlign = 'left';
		ctx.fillText( item.name, x, height + 76 );

		item.desc.forEach( ( t, i ) => {
			ctx.font = i ? '21px sans-serif' : 'italic 21px sans-serif';
			ctx.fillText( t, x, height + 112 + i * 36 );
		} );

		ctx.fillStyle = Renderer.COLOR.BLUE_1;
		ctx.fillRect( x - 20, height + 30, 440, 10 );
		ctx.fillRect( x - 20, height + 170, 440, 10 );
		ctx.fillRect( x - 30, height + 40, 10, 130 );
		ctx.fillRect( x + 420, height + 40, 10, 130 );
	}


	/**
	 * Draw the mirror.
	 * @private
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number}                   height
	 */
	_drawMirror( ctx, height ) {
		ctx.strokeStyle = Renderer.COLOR.BLACK;
		ctx.lineWidth = 4;
		ctx.strokeRect( window.innerWidth - 240, height - 160, 120, 120 );

		ctx.save();

		ctx.beginPath();
		ctx.rect( window.innerWidth - 238, height - 158, 116, 116 );
		ctx.clip();

		this.playerMirror.draw( ctx );

		ctx.fillStyle = 'rgba(210,250,250,0.3)';
		ctx.fillRect( window.innerWidth - 238, height - 158, 116, 116 );

		ctx.strokeStyle = 'rgba(255,255,255,0.1)';
		ctx.lineWidth = 20;
		ctx.beginPath();
		ctx.moveTo( window.innerWidth - 150, height - 170 );
		ctx.lineTo( window.innerWidth - 210, height );
		ctx.stroke();

		ctx.restore();
	}


	/**
	 * Draw the moderation.
	 * @private
	 * @param {CanvasRenderingContext2D} ctx
	 */
	_drawMod( ctx ) {
		if( this.flags.success ) {
			return;
		}

		let [talkerID, face, text] = this.mod.getText();

		let width = this.mod1.width + this.mod2.width + 80;
		let height = this.mod1.height + 80;
		let textWidth = Math.min( 420, window.innerWidth - 40 - width );

		ctx.fillStyle = Renderer.COLOR.BLACK;
		ctx.fillRect( 20, 20, width, height );
		ctx.fillStyle = 'rgba(0,0,0,0.5)';
		ctx.fillRect( 20 + width, 20, textWidth, height );

		if( text.length ) {
			let x = 50;
			let y = 65;

			ctx.fillStyle = Renderer.COLOR.WHITE;
			ctx.font = '21px sans-serif';
			ctx.textAlign = 'left';

			if( this.mod.step === this.mod.script.length - 1 ) {
				y = Math.round( height / 2 ) + 30;

				ctx.font = 'bold italic 24px sans-serif';
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
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number}                   height
	 */
	checkItems( ctx, height ) {
		this.ui_collect.visible = false;

		if( this.flags.success ) {
			return;
		}

		this.items.forEach( ( item, i ) => {
			if( item.collected ) {
				return;
			}

			let dist = Math.abs( item.centerX - this.player.x );

			if( dist < 100 ) {
				this.ui_collect.x = item.centerX;
				this.ui_collect.y = item.y - 20;
				this.ui_collect.text = 'COLLECT';
				this.ui_collect.visible = true;

				UI_Symbol.draw( ctx, Input.ACTION.INTERACT, [item.centerX - 10, item.y - 80, 20] );

				this._drawDesc( ctx, height, item );

				if( Input.isPressed( Input.ACTION.INTERACT, true ) ) {
					this.player.items.push( item );
					item.collected = true;
				}
			}
		} );

		let mirror = window.innerWidth - 180;
		let dist = Math.abs( mirror - 50 - this.player.x );

		if( dist < 100 ) {
			this.player.face = -1;

			this.ui_collect.x = mirror;
			this.ui_collect.y = height - 180;
			this.ui_collect.text = 'DROP ALL ITEMS';
			this.ui_collect.visible = true;

			UI_Symbol.draw( ctx, Input.ACTION.INTERACT, [mirror - 10, height - 240, 20] );

			this._drawDesc( ctx, height, { name: 'Mirror', desc: 'You got this!\nDrop all collected items.'.split( '\n' ) } );

			if( Input.isPressed( Input.ACTION.INTERACT, true ) ) {
				this.player.items.forEach( item => item.collected = false );
				this.player.items = [];
			}
		}
		else {
			this.player.face = 0;
		}
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		// let height = Math.ceil( window.innerHeight * 0.8 );
		let height = window.innerHeight - this.bottomHeight;

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
		ctx.fillStyle = Renderer.COLOR.BLACK;
		ctx.fillRect( 0, height - 340, 5, 340 );

		// Lamp
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.moveTo( Renderer.centerX, 0 );
		ctx.lineTo( Renderer.centerX, height - 500 );
		ctx.closePath();
		ctx.stroke();
		ctx.fillStyle = Renderer.COLOR.BLACK;
		ctx.fillRect( Renderer.centerX - 50, height - 500, 100, 50 );

		// Ghost
		let x = Renderer.centerX - 80;
		let y = Math.round( height - 320 + Math.sin( this.ghostY ) * 20 );

		// Ghost sinks into floor.
		if( this.flags.success ) {
			y = height - 320;

			// Start sinking.
			if( this.progress >= 2 ) {
				x += Math.round( Math.random() * 10 ); // vibrate
				y = Math.round( y + 420 * ( this.progress - 2 ) / 5 );
			}
		}

		if( this.ghostDir < 0 ) {
			ctx.setTransform( this.ghostDir, 0, 0, 1, x * 2 + 160, 0 );
		}

		ctx.drawImage( Renderer.sprites.gh, 0, 0, 16, 32, x, y, 160, 320 );
		ctx.setTransform( 1, 0, 0, 1, 0, 0 );

		// Lamp light
		let alpha = ( Math.random() > 0.98 ) ? 0.2 : 0;

		// The light flickering stops once the ghost is gone (or in the process of going).
		if( this.flags.success && this.progress >= 7 ) {
			alpha = 0.2;
		}

		ctx.fillStyle = `rgba(221,238,255,${ alpha })`;
		ctx.beginPath();
		ctx.moveTo( Renderer.centerX - 50, height - 450 );
		ctx.lineTo( Renderer.centerX - 200, height );
		ctx.lineTo( Renderer.centerX + 200, height );
		ctx.lineTo( Renderer.centerX + 50, height - 450 );
		ctx.closePath();
		ctx.fill();

		this._drawMirror( ctx, height );

		// Player
		this.player.y = height - this.player.height;
		this.player.draw( ctx );

		// Bottom border / Floor
		ctx.fillStyle = Renderer.COLOR.BLUE_2;
		ctx.fillRect( 0, height, window.innerWidth, window.innerHeight - height );
		ctx.lineWidth = 10;
		ctx.beginPath();
		ctx.moveTo( 0, height + 5 );
		ctx.lineTo( window.innerWidth, height + 5 );
		ctx.closePath();
		ctx.stroke();

		// Light circle on the floor the ghost vanishes into.
		if( this.flags.success ) {
			let width = 200;

			// Open quick.
			if( this.progress <= 0.5 ) {
				width = Math.round( width * this.progress * 2 );
			}
			// Close again.
			else if( this.progress >= 6 && this.progress <= 8 ) {
				width = Math.round( width * ( 1 - ( this.progress - 6 ) / 2 ) );
			}
			// Stay closed.
			else if( this.progress > 8 ) {
				width = 0;
			}

			ctx.fillStyle = Renderer.COLOR.ORANGE;
			ctx.fillRect( Renderer.centerX - Math.round( width / 2 ), height, width, 10 );
		}

		this._drawMod( ctx );

		// Items
		this.items[0].y = height - 112;
		this.items[1].y = height - 60;
		this.checkItems( ctx, height );
		this.items.forEach( item => {
			if( !item.collected ) {
				item.draw( ctx );
			}
		} );

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
	 * @param {number} dt
	 */
	update( dt ) {
		super.update( dt );

		if( !this.flags.success ) {
			this.mod.update( dt );
			this.mod1.update( dt, { x: 0 } );
			this.mod2.update( dt, { x: 0 } );

			let dir = Input.getDirections();
			this.player.update( dt, dir );
			this.playerMirror.update( dt, dir );

			if( this.player.x < 20 ) {
				this.player.x = 20;
				this.player.lastDir = 0;
			}
			else if( this.player.x > window.innerWidth - 40 ) {
				this.player.x = window.innerWidth - 40;
				this.player.lastDir = 0;
			}

			this.playerMirror.x = this.player.x + 40;
			this.playerMirror.y = this.player.y;
			this.playerMirror.orientationX = this.player.orientationX;
			this.playerMirror.orientationY = this.player.orientationY;

			if( this.player.face >= 0 ) {
				this.playerMirror.face = this.player.face;
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

			if( this.progress >= 13 ) {
				Renderer.changeLevel( new Level_Credits() );
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
				Renderer.changeLevel( new Level_1_2( this.player ) );
			}
		}
		else {
			this.ui_challenge.visible = false;
		}

		this.items[1].x = Math.min( Renderer.centerX + 300, window.innerWidth - 100 );
	}


}
