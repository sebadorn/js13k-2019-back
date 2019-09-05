'use strict';


class Level_Intro extends Level {


	/**
	 *
	 * @constructor
	 * @extends {Level}
	 */
	constructor() {
		super();

		this.mod = new Moderation( Moderation.SCRIPT.INTRO );
		this.progress = 0;
		this.changeLevel = 0;
		this.offsetX = 0;

		this.mod1 = new Player( 10 );
		this.mod1.color = '#77172F';
		this.mod1.face = 4;
		this.mod1.orientationX = 1;

		this.mod2 = new Player( 10 );
		this.mod2.color = '#3B5C2B';
		this.mod2.face = 4;
		this.mod2.progress = 10;

		this.mod.onDone = () => {
			this.changeLevel = this.progress;
		};
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		ctx.fillStyle = '#C26F38';
		ctx.fillRect( 0, 0, window.innerWidth, window.innerHeight );

		if( this.changeLevel ) {
			if( this.progress - this.changeLevel >= 2 ) {
				Renderer.drawBorder();
				Renderer.level = new Level_Start();

				return;
			}
		}

		if( this.progress <= 1.5 ) {
			ctx.fillStyle = '#000';
			ctx.fillRect( 0, 0, window.innerWidth, window.innerHeight );

			if( this.progress >= 1 ) {
				let p = this.progress - 1;
				let w = window.innerWidth;
				let h = window.innerHeight;

				if( p < 0.25 ) {
					w *= p * 4;
					h = 2;
				}
				else {
					let f = ( p - 0.25 ) * 4;
					h *= f * f;
				}

				let x = Math.round( Renderer.centerX - w / 2 );
				let y = Math.round( Renderer.centerY - h / 2 );

				ctx.fillStyle = '#C26F38';
				ctx.fillRect( x, y, w, h );
			}
		}
		else {
			this.mod1.draw( ctx );
			this.mod2.draw( ctx );

			let [talkerID, face, text] = this.mod.getText();

			if( text.length ) {
				let width = 620;

				let padding = 24;
				let bubbleHeight = padding * 2 + text.length * 21;

				if( text.length > 1 ) {
					bubbleHeight += ( text.length - 1 ) * 11;
				}

				let x = 0;
				let y = this.mod1.y - bubbleHeight - 16;

				ctx.fillStyle = 'rgba(0,0,0,0.5)';
				ctx.font = '21px sans-serif';
				ctx.textBaseline = 'top';

				// Right
				if( talkerID ) {
					this.mod2.face = face;
					x = this.mod2.x - padding - width;

					ctx.beginPath();
					ctx.moveTo( x + width, y + bubbleHeight );
					ctx.lineTo( x + width - 20, y + bubbleHeight );
					ctx.lineTo( x + width, y + bubbleHeight + 20 );
					ctx.closePath();
				}
				// Left
				else {
					this.mod1.face = face;
					x = this.mod1.x + this.mod1.width + padding;

					ctx.beginPath();
					ctx.moveTo( x, y + bubbleHeight );
					ctx.lineTo( x + 20, y + bubbleHeight );
					ctx.lineTo( x, y + bubbleHeight + 20 );
					ctx.closePath();
				}

				ctx.fillRect( x, y, width, bubbleHeight );
				ctx.fill();

				ctx.fillStyle = '#FFF';

				text.forEach( ( t, i ) => {
					ctx.fillText( t, x + padding, y + padding + i * 32 );
				} );
			}
			else {
				if( talkerID ) {
					this.mod2.face = face;
				}
				else {
					this.mod1.face = face;
				}
			}
		}

		Renderer.drawBorder();
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		// Skip the intro.
		if( this.progress > 1.5 && Input.isPressed( Input.ACTION.INTERACT, true ) ) {
			this.progress += dt / Renderer.TARGET_FPS;
			this.changeLevel = this.progress;

			return;
		}

		if( this.changeLevel ) {
			let diff = this.progress - this.changeLevel;
			this.offsetX = Math.round( diff / 2 * window.innerWidth );
		}

		this.mod1.x = 130 - this.offsetX;
		this.mod1.y = window.innerHeight - this.mod1.height - 50;

		this.mod2.x = window.innerWidth - 280 - this.offsetX;
		this.mod2.y = window.innerHeight - this.mod1.height - 50;

		this.mod1.update( dt, { x: 0 } );
		this.mod2.update( dt, { x: 0 } );

		if( this.progress > 1.5 ) {
			this.mod.update( dt );
		}

		this.progress += dt / Renderer.TARGET_FPS;
	}


}
