'use strict';


class Moderation {


	/**
	 *
	 * @constructor
	 * @param {object} script
	 */
	constructor( script ) {
		this.script = script;
	}


	/**
	 * Draw a moderator
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number}                   x
	 * @param {number}                   y
	 * @param {number}                   size
	 * @param {string[]}                 colors
	 */
	drawMod( ctx, x, y, size, colors ) {
		// Body
		ctx.fillStyle = colors[0];
		ctx.fillRect( x, y + size, size * 16, size * 14 );
		ctx.fillRect( x + size, y, size * 14, size * 16 );

		// Tie
		// TODO:
		ctx.fillStyle = colors[1];

		// Eyes
		ctx.fillStyle = '#FFF';
		ctx.fillRect( x + size * 3, y + size * 5, size, size * 2 );
		ctx.fillRect( x + size * 9, y + size * 5, size, size * 2 );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		// TODO:
	}


}


Moderation.SCRIPTS = {
	INTRO: [
		[1, 'Welcome to a new season of HOW TO SEND BACK…!'],
		[1, 'Three years ago we instructed our dear viewers how to return packets, unwanted gifts and the like.'],
		[1, 'Honestly, the show did not very well back then. But this time we made sure to spice things up!'],
		[1, 'I am your host and will be joined by a real celebrity … erm, please introduce yourself!'],
		[2, "Hi, I'm John from finances. We were over-budget as it were, so I guess I will fill the role of co-moderator."],
		[1, '…'],
		[2, 'Seriously, why do we need an “emergency priest” on standby?']
	],
	LEVEL_1: [
		[1, 'Here we are! How exciting! This first episode will confront our participant with quite the novelty. In …'],
		[1, '… Say it with me John.'],
		[2, "I've never seen a script. I have no idea what is going to happen."],
		[1, 'Well, that is interesting in its own way then. Now let us start with:'],
		[1, 'HOW TO SEND BACK A GHOST!']
	]
};
