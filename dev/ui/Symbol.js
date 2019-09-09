'use strict';


/**
 * @namespace UI_Symbol
 */
const UI_Symbol = {


	/**
	 * Draw a symbol.
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number}                   action - Action type to draw the symbol for.
	 * @param {number[]}                 s      - x, y, and size.
	 */
	draw( ctx, action, s ) {
		let x = s[0];
		let y = s[1];
		let sh = s[2] / 2;
		let dest = [x, y, s[2], s[2]];

		let img = Renderer.sprites.sy;
		let offset = 10;

		// Keyboard
		if( Input.PROMPTS === 1 ) {
			if( action === Input.ACTION.FIGHT_1 ) {
				action = Input.ACTION.DOWN;
			}
			else if( action === Input.ACTION.FIGHT_2 ) {
				action = Input.ACTION.RIGHT;
			}
		}
		// Playstation Controller
		else if( Input.PROMPTS === 2 ) {
			offset = 5;
		}
		// XBox Controller
		else if( Input.PROMPTS === 3 ) {
			offset = 0;
		}

		if( Input.PROMPTS !== 1 ) {
			if( action === Input.ACTION.INTERACT ) {
				action = Input.ACTION.FIGHT_1;
			}
			else if( action === Input.ACTION.FIGHT_3 ) {
				action = Input.ACTION.UP;
			}
			else if( action === Input.ACTION.FIGHT_4 ) {
				action = Input.ACTION.LEFT;
			}
		}

		// Button background.
		ctx.beginPath();
		ctx.fillStyle = Renderer.COLOR.BLACK;
		ctx.arc( x + sh, y + sh, Math.ceil( s[2] * 0.9 ), 0, Math.PI * 2 );
		ctx.closePath();
		ctx.fill();

		switch( action ) {
			case Input.ACTION.DOWN:
				ctx.translate( x + sh, y + sh );
				ctx.rotate( -Math.PI / 2 );
				ctx.translate( -x - sh, -y - sh );
				ctx.drawImage( img, 0, 10, 5, 5, ...dest );
				break;

			case Input.ACTION.LEFT:
				ctx.drawImage( img, 0, 10, 5, 5, ...dest );
				break;

			case Input.ACTION.RIGHT:
				ctx.setTransform( -1, 0, 0, 1, x + s[2], y );
				ctx.drawImage( img, 0, 10, 5, 5, 0, 0, s[2], s[2] );
				break;

			case Input.ACTION.UP:
				ctx.translate( x + sh, y + sh );
				ctx.rotate( Math.PI / 2 );
				ctx.translate( -x - sh, -y - sh );
				ctx.drawImage( img, 0, 10, 5, 5, ...dest );
				break;

			case Input.ACTION.FIGHT_1:
				ctx.drawImage( img, 0, offset, 5, 5, ...dest );
				break;

			case Input.ACTION.FIGHT_2:
				ctx.drawImage( img, 5, offset, 5, 5, ...dest );
				break;

			case Input.ACTION.FIGHT_3:
				ctx.drawImage( img, 15, offset, 5, 5, ...dest );
				break;

			case Input.ACTION.FIGHT_4:
				ctx.drawImage( img, 10, offset, 5, 5, ...dest );
				break;

			case Input.ACTION.INTERACT:
				ctx.drawImage( img, 5, 10, 5, 5, ...dest );
				break;
		}

		ctx.setTransform( 1, 0, 0, 1, 0, 0 );
	}


};
