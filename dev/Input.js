'use strict';


/**
 * @namespace Input
 */
const Input = {


	ACTION: {
		ESC: 1,
		INTERACT: 2,

		LEFT: 10,
		UP: 11,
		RIGHT: 12,
		DOWN: 13,

		FIGHT_1: 20,
		FIGHT_2: 21,
		FIGHT_3: 22,
		FIGHT_4: 23
	},

	_on: {
		esc: [],
		gp_connect: [],
		gp_disconnect: [],
		interact: []
	},
	_onKeyDown: {},

	gamepads: {},
	keystate: {},


	/**
	 *
	 * @return {object}
	 */
	getDirections() {
		let x = 0;
		let y = 0;

		if( this.isPressed( this.ACTION.LEFT ) ) {
			x = -1;
		}
		else if( this.isPressed( this.ACTION.RIGHT ) ) {
			x = 1;
		}

		if( this.isPressed( this.ACTION.UP ) ) {
			y = -1;
		}
		else if( this.isPressed( this.ACTION.DOWN ) ) {
			y = 1;
		}

		return { x, y };
	},


	/**
	 * Get the keyboard key codes and gamepad
	 * button codes for a certain action.
	 * @param  {number} action
	 * @return {object}
	 */
	getKeysForAction( action ) {
		let kb = [];
		let gp = [];

		switch( action ) {
			case this.ACTION.ESC:
				kb.push( 27 ); // ESC
				gp.push( 9 );
				break;

			case this.ACTION.INTERACT:
				kb.push( 13, 69 ); // ENTER, E
				gp.push( 0 );
				break;

			case this.ACTION.LEFT:
				kb.push( 37, 65 ); // LEFT, A
				gp.push( 14 );
				break;

			case this.ACTION.UP:
				kb.push( 38, 87 ); // UP, W
				gp.push( 12 );
				break;

			case this.ACTION.RIGHT:
				kb.push( 39, 68 ); // RIGHT, D
				gp.push( 15 );
				break;

			case this.ACTION.DOWN:
				kb.push( 40, 83 ); // DOWN, S
				gp.push( 13 );
				break;

			case this.ACTION.FIGHT_1:
				// TODO:
				break;

			case this.ACTION.FIGHT_2:
				// TODO:
				break;

			case this.ACTION.FIGHT_3:
				// TODO:
				break;

			case this.ACTION.FIGHT_4:
				// TODO:
				break;
		}

		return {
			keyboard: kb,
			gamepad: gp
		};
	},


	// TODO: remove if not needed
	// /**
	//  *
	//  * @return {?number}
	//  */
	// getLastArrowKey() {
	//     let down = this.keystate[40] || 0;
	//     let left = this.keystate[37] || 0;
	//     let right = this.keystate[39] || 0;
	//     let up = this.keystate[38] || 0;

	//     let values = [down, left, right, up];
	//     values.sort( ( a, b ) => b - a );

	//     let max = values[0];

	//     if( !max ) {
	//         return null;
	//     }

	//     if( max === down ) { return 40; }
	//     if( max === left ) { return 37; }
	//     if( max === right ) { return 39; }
	//     if( max === up ) { return 38; }

	//     return null;
	// },


	/**
	 * Initialize the input handler.
	 */
	init() {
		document.body.onkeydown = ( ev ) => {
			ev.preventDefault();

			this.keystate[ev.which] = Date.now();
			this._onKeyDown[ev.which] && this._onKeyDown[ev.which]();
		};

		document.body.onkeyup = ( ev ) => {
			ev.preventDefault();

			this.keystate[ev.which] = 0;
		};

		window.addEventListener( 'gamepadconnected', ( ev ) => {
			this.gamepads[ev.gamepad.index] = ev.gamepad;
			this._on.gp_connect.forEach( cb => cb( ev.gamepad ) );
		} );

		window.addEventListener( 'gamepaddisconnected', ( ev ) => {
			delete this.gamepads[ev.gamepad.index];
			this._on.gp_disconnect.forEach( cb => cb( ev.gamepad ) );
		} );
	},


	/**
	 *
	 * @param  {number}   action
	 * @param  {?boolean} forget
	 * @return {boolean}
	 */
	isPressed( action, forget ) {
		let keys = this.getKeysForAction( action );

		for( let key of keys.keyboard ) {
			if( this.isPressedKey( key, forget ) ) {
				return true;
			}
		}

		for( let key of keys.gamepad ) {
			if( this.isPressedGamepad( key ) ) {
				return true;
			}
		}

		return false;
	},


	/**
	 * Check if a button is currently being pressed.
	 * @param  {number} code - Button code.
	 * @return {boolean}
	 */
	isPressedGamepad( code ) {
		for( let index in this.gamepads ) {
			let gp = this.gamepads[index];
			let button = gp.buttons[code];

			if( button && button.pressed ) {
				return true;
			}
		}

		return false;
	},


	/**
	 * Check if a key is currently being pressed.
	 * @param  {number}  code   - Key code.
	 * @param  {boolean} forget
	 * @return {boolean}
	 */
	isPressedKey( code, forget ) {
		if( this.keystate[code] ) {
			if( forget ) {
				delete this.keystate[code];
			}

			return true;
		}

		return false;
	},


	/**
	 * Remove an event listener.
	 * @param {string}    type
	 * @param {?function} cb
	 */
	off( type, cb ) {
		if( typeof cb !== 'function' ) {
			this._on[type] = [];
			return;
		}

		let pos = this._on[type].indexOf( cb );

		if( pos >= 0 ) {
			this._on[type].splice( pos, 1 );
		}
	},


	/**
	 * Add an event listener.
	 * @param {string}   type
	 * @param {function} cb
	 */
	on( type, cb ) {
		this._on[type].push( cb );
	},


	/**
	 * Add a listener for the keydown event.
	 * @param {number}   code - Key code.
	 * @param {function} cb   - Callback.
	 */
	onKeyDown( code, cb ) {
		this._onKeyDown[code] = cb;
	},


	/**
	 * Update gamepad data.
	 */
	update() {
		let gamepads = navigator.getGamepads();

		for( let index in this.gamepads ) {
			this.gamepads[index] = gamepads[index];
		}
	}


};