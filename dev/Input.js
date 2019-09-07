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

	// 1: Keyboard
	// 2: Playstation Controller
	// 3: XBox Controller
	PROMPTS: 1,

	_gpButtons: {},
	_ignoreUntilPressedAgain: {},
	_on: {
		'esc': [],
		'gp_connect': [],
		'gp_disconnect': [],
		'interact': []
	},
	_onKeyDown: {},

	gamepads: {},
	keystate: {},
	numGamepads: 0,


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
				kb.push( 37 ); // LEFT
				gp.push( 14 );
				break;

			case this.ACTION.FIGHT_4:
				kb.push( 37, 65 ); // LEFT, A
				gp.push( 2, 14 );
				break;

			case this.ACTION.UP:
				kb.push( 38 ); // UP
				gp.push( 12 );
				break;

			case this.ACTION.FIGHT_3:
				kb.push( 38, 87 ); // UP, W
				gp.push( 3, 12 );
				break;

			case this.ACTION.RIGHT:
				kb.push( 39 ); // RIGHT
				gp.push( 15 );
				break;

			case this.ACTION.FIGHT_2:
				kb.push( 39, 68 ); // RIGHT, D
				gp.push( 1, 15 );
				break;

			case this.ACTION.DOWN:
				kb.push( 40 ); // DOWN
				gp.push( 13 );
				break;

			case this.ACTION.FIGHT_1:
				kb.push( 40, 83 ); // DOWN, S
				gp.push( 0, 13 );
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
			let ks = this.keystate[ev.which];

			if( !ks || !ks.waitForReset ) {
				this.keystate[ev.which] = {
					time: Date.now()
				};

				this._onKeyDown[ev.which] && this._onKeyDown[ev.which]();
			}

			if( ev.which === 49 ) {
				Input.PROMPTS = 1;
			}
			else if( ev.which === 50 ) {
				Input.PROMPTS = 2;
			}
			else if( ev.which === 51 ) {
				Input.PROMPTS = 3;
			}
		};

		document.body.onkeyup = ( ev ) => {
			this.keystate[ev.which] = {
				time: 0
			};
		};

		window.addEventListener( 'gamepadconnected', ( ev ) => {
			let id = String( ev.gamepad.id ).toLowerCase();

			if(
				id.indexOf( 'sony' ) >= 0 ||
				id.indexOf( 'dualshock' ) >= 0 ||
				id.indexOf( 'playstation' ) >= 0 ||
				id.indexOf( 'ps3' ) >= 0
			) {
				Input.PROMPTS = 2;
			}
			else if(
				id.indexOf( 'xbox' ) >= 0 ||
				id.indexOf( 'microsoft' ) >= 0
			) {
				Input.PROMPTS = 3;
			}

			this.numGamepads++;
			this.gamepads[ev.gamepad.index] = ev.gamepad;
			this._on.gp_connect.forEach( cb => cb() );
		} );

		window.addEventListener( 'gamepaddisconnected', ( ev ) => {
			Input.PROMPTS = 1;

			this.numGamepads--;
			delete this.gamepads[ev.gamepad.index];
			this._on.gp_disconnect.forEach( cb => cb() );
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
			if( this.isPressedGamepad( key, forget ) ) {
				return true;
			}
		}

		// Also check axes.
		if( action === this.ACTION.LEFT || action === this.ACTION.FIGHT_4 ) {
			for( let index in this.gamepads ) {
				let gp = this.gamepads[index];

				if( gp.axes[6] && gp.axes[6] <= -0.2 ) {
					return true;
				}
			}
		}
		else if( action === this.ACTION.RIGHT ) {
			for( let index in this.gamepads ) {
				let gp = this.gamepads[index];

				if( gp.axes[6] && gp.axes[6] >= 0.2 ) {
					return true;
				}
			}
		}
		else if( action === this.ACTION.UP || action === this.ACTION.FIGHT_3 ) {
			for( let index in this.gamepads ) {
				let gp = this.gamepads[index];

				if( gp.axes[7] && gp.axes[7] <= -0.2 ) {
					return true;
				}
			}
		}
		else if( action === this.ACTION.DOWN ) {
			for( let index in this.gamepads ) {
				let gp = this.gamepads[index];

				if( gp.axes[7] && gp.axes[7] >= 0.2 ) {
					return true;
				}
			}
		}

		return false;
	},


	/**
	 * Check if a button is currently being pressed.
	 * @param  {number}  code   - Button code.
	 * @param  {boolean} forget
	 * @return {boolean}
	 */
	isPressedGamepad( code, forget ) {
		for( let index in this.gamepads ) {
			let gp = this.gamepads[index];
			let button = gp.buttons[code];

			if( button && button.pressed ) {
				// TODO: not working as intended; copy button states in update() part?
				if( this._ignoreUntilPressedAgain[code] ) {
					delete this._ignoreUntilPressedAgain[code];
					return false;
				}

				if( forget ) {
					this._ignoreUntilPressedAgain[code] = true;
				}

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
		let ks = this.keystate[code];

		if( ks && ks.time ) {
			if( forget ) {
				ks.time = 0;
				ks.waitForReset = true;
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

		for( let gamepad of gamepads ) {
			this.gamepads[gamepad.index] = gamepad;
			this._gpButtons[gamepad.index] = gamepad.buttons.slice( 0 );
		}
	}


};
