'use strict';


/**
 * @namespace Crafting
 */
const Crafting = {


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Player}                   player
	 */
	draw( ctx, player ) {
		player.items.forEach( item => {
			item.draw( ctx );
		} );
	},


	/**
	 *
	 * @param {number} dt
	 * @param {Player} player
	 */
	update( dt, player ) {
		//
	}


};
