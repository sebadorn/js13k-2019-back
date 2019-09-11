'use strict';


/**
 * @namespace GameAudio
 */
const GameAudio = {


	data: {
		beat: {
		  songData: [
		    { // Instrument 0
		      i: [
		      0, // OSC1_WAVEFORM
		      255, // OSC1_VOL
		      116, // OSC1_SEMI
		      1, // OSC1_XENV
		      0, // OSC2_WAVEFORM
		      255, // OSC2_VOL
		      116, // OSC2_SEMI
		      0, // OSC2_DETUNE
		      1, // OSC2_XENV
		      14, // NOISE_VOL
		      4, // ENV_ATTACK
		      6, // ENV_SUSTAIN
		      45, // ENV_RELEASE
		      0, // ARP_CHORD
		      0, // ARP_SPEED
		      0, // LFO_WAVEFORM
		      0, // LFO_AMT
		      0, // LFO_FREQ
		      0, // LFO_FX_FREQ
		      2, // FX_FILTER
		      136, // FX_FREQ
		      15, // FX_RESONANCE
		      0, // FX_DIST
		      32, // FX_DRIVE
		      0, // FX_PAN_AMT
		      0, // FX_PAN_FREQ
		      66, // FX_DELAY_AMT
		      6 // FX_DELAY_TIME
		      ],
		      // Patterns
		      p:  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		      // Columns
		      c: [
		        {n: [123,,123,,123,,123,,123,,123,,123,,123],
		         f: []}
		      ]
		    },
		    { // Instrument 1
		      i: [
		      0, // OSC1_WAVEFORM
		      0, // OSC1_VOL
		      140, // OSC1_SEMI
		      0, // OSC1_XENV
		      0, // OSC2_WAVEFORM
		      0, // OSC2_VOL
		      140, // OSC2_SEMI
		      0, // OSC2_DETUNE
		      0, // OSC2_XENV
		      60, // NOISE_VOL
		      4, // ENV_ATTACK
		      10, // ENV_SUSTAIN
		      34, // ENV_RELEASE
		      0, // ARP_CHORD
		      0, // ARP_SPEED
		      0, // LFO_WAVEFORM
		      187, // LFO_AMT
		      5, // LFO_FREQ
		      0, // LFO_FX_FREQ
		      1, // FX_FILTER
		      239, // FX_FREQ
		      135, // FX_RESONANCE
		      0, // FX_DIST
		      32, // FX_DRIVE
		      108, // FX_PAN_AMT
		      5, // FX_PAN_FREQ
		      16, // FX_DELAY_AMT
		      4 // FX_DELAY_TIME
		      ],
		      // Patterns
		      p: [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
		      // Columns
		      c: [
		        {n: [],
		         f: []},
		        {n: [126,,,,126,,,,130,,,,130],
		         f: []}
		      ]
		    },
		  ],
		  rowLen: 11025,   // In sample lengths
		  patternLen: 16,  // Rows per pattern
		  endPattern: 8,  // End pattern
		  numChannels: 2  // Number of channels
	    },
		hit: {
	      songData: [
	        { // Instrument 0
	          i: [
	          3, // OSC1_WAVEFORM
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
	          0, // FX_DELAY_AMT
	          4 // FX_DELAY_TIME
	          ],
	          // Patterns
	          p: [1],
	          // Columns
	          c: [
	            {n: [144],
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
	 * @param  {string}  key
	 * @param  {boolean} loop
	 * @param  {number}  volume
	 * @return {Audio}
	 */
	play( key, loop, volume ) {
		let audio = new Audio( this.objectURLs[key] );
		audio.loop = !!loop;
		audio.volume = volume || GameAudio.VOLUME;
		audio.play();

		return audio;
	}


};


GameAudio.VOLUME = 0.2;
