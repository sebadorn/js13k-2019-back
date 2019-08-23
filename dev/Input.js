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
	 * Get the keyboard key codes and gamepad
	 * button codes for a certain action.
	 * @param  {number} action
	 * @return {object}
	 */
	getKeysForAction( action ) {
		let kb = [];
		let gp = [];

		const ACTION = this.ACTION;

		switch( action ) {
			case ACTION.ESC:
				kb.push( 27 ); // ESC
				gp.push( 9 );
				break;

			case ACTION.INTERACT:
				kb.push( 13, 69 ); // ENTER, E
				gp.push( 0 );
				break;

			case ACTION.LEFT:
				kb.push( 37, 65 ); // LEFT, A
				gp.push( 14 );
				break;

			case ACTION.UP:
				kb.push( 38, 87 ); // UP, W
				gp.push( 12 );
				break;

			case ACTION.RIGHT:
				kb.push( 39, 68 ); // RIGHT, D
				gp.push( 15 );
				break;

			case ACTION.DOWN:
				kb.push( 40, 83 ); // DOWN, S
				gp.push( 13 );
				break;

			case ACTION.FIGHT_1:
				// TODO:
				break;

			case ACTION.FIGHT_2:
				// TODO:
				break;

			case ACTION.FIGHT_3:
				// TODO:
				break;

			case ACTION.FIGHT_4:
				// TODO:
				break;
		}

		return {
			keyboard: kb,
			gamepad: gp
		};
	},


	/**
	 * Initialize the input handler.
	 */
	init() {
		document.body.onkeydown = ( ev ) => {
			this.keystate[ev.which] = Date.now();
			this._onKeyDown[ev.which] && this._onKeyDown[ev.which]();
		};

		document.body.onkeyup = ( ev ) => {
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
	 * @param  {number} action
	 * @return {boolean}
	 */
	isPressed( action ) {
		let keys = this.getKeysForAction( action );

		for( let key of keys.keyboard ) {
			if( this.isPressedKey( key ) ) {
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
