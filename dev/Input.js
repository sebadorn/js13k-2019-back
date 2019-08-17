'use strict';


/**
 * @namespace Input
 */
const Input = {


	_on: {
		gp_connect: [],
		gp_disconnect: []
	},
	_onKeyDown: {},

	gamepads: {},
	keystate: {},


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
	 * Check if a key is currently being pressed.
	 * @param  {number} code - Key code.
	 * @return {boolean}
	 */
	isPressed( code ) {
		return !!this.keystate[code];
	},


	/**
	 * Remove an event listener.
	 * @param {string}   type
	 * @param {function} cb
	 */
	off( type, cb ) {
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
