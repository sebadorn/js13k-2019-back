'use strict';


class Item {


	/**
	 * Item for player.
	 * @constructor
	 * @param {string} name
	 * @param {number} x
	 */
	constructor( name, x ) {
		this.name = name;
		this.x = x;
		this.y = 0;

		this.selected = false;
	}


	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw( ctx ) {
		//
	}


}
