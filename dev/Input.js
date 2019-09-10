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
	_ignoreUntilReleased: {},
	_on: {
		'esc': [],
		'gp_connect': [],
		'gp_disconnect': [],
		'interact': []
	},
	_onKeyDown: {},

	gamepads: {},
	isFirefox: false,
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
				gp.push( this.isFirefox ? 3 : 2, 14 );
				break;

			case this.ACTION.UP:
				kb.push( 38 ); // UP
				gp.push( 12 );
				break;

			case this.ACTION.FIGHT_3:
				kb.push( 38, 87 ); // UP, W
				gp.push( this.isFirefox ? 2 : 3, 12 );
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
		let ua = String( navigator.userAgent ).toLowerCase();
		this.isFirefox = ( ua.indexOf( 'firefox' ) >= 0 );

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
		// Has to be done as workaround for Firefox.
		// @see https://bugzilla.mozilla.org/show_bug.cgi?id=1464940
		if(
			action === this.ACTION.LEFT ||
			action === this.ACTION.FIGHT_4
		) {
			for( let index in this.gamepads ) {
				let gp = this.gamepads[index];

				if( gp.axes[6] && gp.axes[6] <= -0.2 ) {
					if( this._ignoreUntilReleased['axis6-'] ) {
						return false;
					}

					if( forget ) {
						this._ignoreUntilReleased['axis6-'] = true;
					}

					return true;
				}
			}
		}
		else if(
			action === this.ACTION.RIGHT ||
			action === this.ACTION.FIGHT_2
		) {
			for( let index in this.gamepads ) {
				let gp = this.gamepads[index];

				if( gp.axes[6] && gp.axes[6] >= 0.2 ) {
					if( this._ignoreUntilReleased['axis6+'] ) {
						return false;
					}

					if( forget ) {
						this._ignoreUntilReleased['axis6+'] = true;
					}

					return true;
				}
			}
		}
		else if(
			action === this.ACTION.UP ||
			action === this.ACTION.FIGHT_3
		) {
			for( let index in this.gamepads ) {
				let gp = this.gamepads[index];

				if( gp.axes[7] && gp.axes[7] <= -0.2 ) {
					if( this._ignoreUntilReleased['axis7-'] ) {
						return false;
					}

					if( forget ) {
						this._ignoreUntilReleased['axis7-'] = true;
					}

					return true;
				}
			}
		}
		else if(
			action === this.ACTION.DOWN ||
			action === this.ACTION.FIGHT_1
		) {
			for( let index in this.gamepads ) {
				let gp = this.gamepads[index];

				if( gp.axes[7] && gp.axes[7] >= 0.2 ) {
					if( this._ignoreUntilReleased['axis7+'] ) {
						return false;
					}

					if( forget ) {
						this._ignoreUntilReleased['axis7+'] = true;
					}

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
			let buttons = this.gamepads[index].buttons;
			let button = buttons[code];

			if( button && button.pressed ) {
				if( this._ignoreUntilReleased[code] ) {
					return false;
				}

				if( forget ) {
					this._ignoreUntilReleased[code] = true;
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
			// Chromium has 4 indices, but they may be null as value.
			if( !gamepad ) {
				continue;
			}

			this.gamepads[gamepad.index] = gamepad;

			for( let code in this._ignoreUntilReleased ) {
				if( code === 'axis6-' || code === 'axis6+' ) {
					if( !gamepad.axes[6] ) {
						delete this._ignoreUntilReleased[code];
					}
				}
				else if( code === 'axis7-' || code === 'axis7+' ) {
					if( !gamepad.axes[7] ) {
						delete this._ignoreUntilReleased[code];
					}
				}
				else if( gamepad.buttons[code] && !gamepad.buttons[code].pressed ) {
					delete this._ignoreUntilReleased[code];
				}
			}
		}
	}


};
