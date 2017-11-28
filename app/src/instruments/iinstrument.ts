/// <reference path="../../lib/phaser.comments.d.ts"/>

interface IInstrument {
    /**
     * Get number of strings
     * 
     * @returns {number} 
     * @memberof IInstrument
     */
    getStringCount():number;
    /**
     * Return tuning
     * 
     * @returns {number[]} one per string, base note.
     * @memberof IInstrument
     */
    getTuning():number[];
    /**
     * Convert a fret position to a number.
     * 
     * @param {number} fret 
     * @returns {string} 
     * @memberof IInstrument
     */
    mapOffsetToFret(fret:number):string;
    /**
     * Is it a double string ?
     * 
     * @param {number} stringID 
     * @returns {boolean} 
     * @memberof IInstrument
     */
    isDoubleString(stringID:number):boolean;
    /**
     * Get the chord, if any, corresponding to the given chromatic offsets.
     * 
     * @param {number[]} chromOffset 
     * @returns {string} 
     * @memberof IInstrument
     */
    getChordName(chromOffset:number[]):string;
}

