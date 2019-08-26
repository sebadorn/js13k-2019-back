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

		let f = s[2] / 7;

		let left = x + f + f;
		let right = x + s[2] - f - f;
		let top = y + f + f;
		let bottom = y + s[2] - f - f;

		ctx.lineWidth = f;

		switch( action ) {
			case Input.ACTION.DOWN:
				ctx.translate( x + sh, y + sh );
				ctx.rotate( -Math.PI / 2 );
				ctx.translate( -x - sh, -y - sh );
				ctx.drawImage( Renderer.sprites.symbols, 0, 0, 7, 7, ...dest );
				break;

			case Input.ACTION.LEFT:
				ctx.drawImage( Renderer.sprites.symbols, 0, 0, 7, 7, ...dest );
				break;

			case Input.ACTION.RIGHT:
				ctx.setTransform( -1, 0, 0, 1, x + s[2], y );
				ctx.drawImage( Renderer.sprites.symbols, 0, 0, 7, 7, 0, 0, s[2], s[2] );
				break;

			case Input.ACTION.UP:
				ctx.translate( x + sh, y + sh );
				ctx.rotate( Math.PI / 2 );
				ctx.translate( -x - sh, -y - sh );
				ctx.drawImage( Renderer.sprites.symbols, 0, 0, 7, 7, ...dest );
				break;

			case Input.ACTION.FIGHT_1:
				ctx.drawImage( Renderer.sprites.symbols, 14, 0, 7, 7, ...dest );
				ctx.strokeStyle = '#06F';
				ctx.beginPath();
				ctx.moveTo( left, top );
				ctx.lineTo( right, bottom );
				ctx.moveTo( left, bottom );
				ctx.lineTo( right, top );
				ctx.closePath();
				ctx.stroke();
				break;

			case Input.ACTION.FIGHT_2:
				ctx.drawImage( Renderer.sprites.symbols, 14, 0, 7, 7, ...dest );
				ctx.strokeStyle = '#D6B';
				ctx.strokeRect( left, top, s[2] - f * 4, s[2] - f * 4 );
				break;

			case Input.ACTION.FIGHT_3:
				ctx.drawImage( Renderer.sprites.symbols, 14, 0, 7, 7, ...dest );
				ctx.strokeStyle = '#6B0';
				ctx.beginPath();
				ctx.moveTo( left, bottom );
				ctx.lineTo( x + s[2] / 2, top );
				ctx.lineTo( right, bottom );
				ctx.lineTo( left, bottom );
				ctx.closePath();
				ctx.stroke();
				break;

			case Input.ACTION.FIGHT_4:
				ctx.drawImage( Renderer.sprites.symbols, 14, 0, 7, 7, ...dest );
				ctx.strokeStyle = '#F00';
				ctx.beginPath();
				ctx.arc( x + sh, y + sh, sh - f * 2, 0, Math.PI * 2 );
				ctx.closePath();
				ctx.stroke();
				break;

			case Input.ACTION.INTERACT:
				ctx.drawImage( Renderer.sprites.symbols, 7, 0, 7, 7, ...dest );
				break;
		}

		ctx.setTransform( 1, 0, 0, 1, 0, 0 );
	}


};
