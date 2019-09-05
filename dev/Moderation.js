'use strict';


class Moderation {


	/**
	 *
	 * @constructor
	 * @param {object} script
	 */
	constructor( script ) {
		this.script = script;
		this.step = 0;
		this.progress = 0;
		this.waited = 0;
	}


	/**
	 * Get all text up to and including the current point.
	 * @return {Array}
	 */
	getText() {
		return this.script[this.step];
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		let item = this.script[this.step];
		let wait = item[3] || 3;

		if( this.progress >= this.waited + wait ) {
			this.waited += wait;
			this.step++;
		}

		if( this.step >= this.script.length ) {
			this.step = this.script.length - 1;
			this.onDone && this.onDone();
			this.onDone = null;
		}

		this.progress += dt / Renderer.TARGET_FPS;
	}


}


Moderation.SCRIPT = {
	INTRO: [
		// Talker ID; player face; text lines; wait before showing the line
		[1, 0, [], 1],
		[0, 4, ['Welcome to a new season of HOW TO SEND BACK...!']],
		[0, 4, ['Previously we informed our dear viewers on how', 'to return packets, unwanted gifts, and the like.'], 4],
		[0, 4, ['Honestly, the show did not very well.', 'But this time we made sure to spice things up!'], 4],
		[0, 0, ['And we are joined by a real celebrity today!']],
		[1, 4, ["Hi, I'm John from the finances section."]],
		[0, 0, [], 1],
		[1, 0, ['There was no more room in the budget.']],
		[1, 0, [], 1],
		[1, 0, ['Also, why is there an', String.fromCharCode( 8220 ) + 'emergency priest' + String.fromCharCode( 8221 ) + ' on standby?'], 4],
		[0, 0, [], 1]
	],
	LEVEL_1: [
		[0, 'Here we are! How exciting! This first episode will confront our participant with quite the novelty. In ...'],
		[0, '... Say it with me John.'],
		[1, "I've never seen a script. I have no idea what is going to happen."],
		[0, 'HOW TO SEND BACK A GHOST!']
	]
};
