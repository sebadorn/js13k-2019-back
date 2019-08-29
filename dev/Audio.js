'use strict';


/**
 * @namespace Audio
 */
const Audio = {


	data: {
		hit: {
		  songData: [
			{ // Instrument 0
			  i: [
			  0, // OSC1_WAVEFORM
			  255, // OSC1_VOL
			  152, // OSC1_SEMI
			  0, // OSC1_XENV
			  0, // OSC2_WAVEFORM
			  255, // OSC2_VOL
			  152, // OSC2_SEMI
			  12, // OSC2_DETUNE
			  0, // OSC2_XENV
			  0, // NOISE_VOL
			  2, // ENV_ATTACK
			  0, // ENV_SUSTAIN
			  60, // ENV_RELEASE
			  0, // ARP_CHORD
			  0, // ARP_SPEED
			  0, // LFO_WAVEFORM
			  0, // LFO_AMT
			  0, // LFO_FREQ
			  0, // LFO_FX_FREQ
			  2, // FX_FILTER
			  255, // FX_FREQ
			  0, // FX_RESONANCE
			  0, // FX_DIST
			  32, // FX_DRIVE
			  47, // FX_PAN_AMT
			  3, // FX_PAN_FREQ
			  157, // FX_DELAY_AMT
			  2 // FX_DELAY_TIME
			  ],
			  // Patterns
			  p: [1],
			  // Columns
			  c: [
				{n: [147],
				 f: []}
			  ]
			},
		  ],
		  rowLen: 5513,   // In sample lengths
		  patternLen: 32,  // Rows per pattern
		  endPattern: 0,  // End pattern
		  numChannels: 1  // Number of channels
		}
	},

	objectURLs: {},


	/**
	 *
	 * @param {function} cb
	 */
	init( cb ) {
		let keys = Object.keys( this.data );

		let next = ( i ) => {
			if( i >= keys.length ) {
				cb();
				return;
			}

			let key = keys[i];

			let player = new CPlayer();
			player.init( this.data[key] );

			let interval = setInterval( () => {
				if( interval && player.generate() >= 1 ) {
					clearInterval( interval );
					interval = 0;

					let wave = player.createWave();
					let blob = new Blob( [wave], { type: 'audio/wav' } );
					let objectURL = URL.createObjectURL( blob );
					this.objectURLs[key] = objectURL;

					next( i + 1 );
				}
			}, 10 );
		};

		next( 0 );
	},


	/**
	 * Play a sound.
	 * @param {string} key
	 */
	play( key ) {
		let audio = document.createElement( 'audio' );
		audio.src = this.objectURLs[key];
		audio.play();
	}


};
