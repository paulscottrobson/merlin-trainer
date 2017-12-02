/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Music interface
 * 
 * @interface IMusic
 */
interface IMusic {
    /**
     * Get the default tempo in bpm
     * 
     * @returns {number} 
     * @memberof Music
     */
    getDefaultTempo():number;
    /**
     * Get the number of quarterbeats in the bar
     * 
     * @returns {number} 
     * @memberof Music
     */
    getBeats():number;
    /**
     * Get the number of bars
     * 
     * @returns {number} 
     * @memberof Music
     */
    getBarCount():number;
    /**
     * Get the title
     * 
     * @returns {string} 
     * @memberof Music
     */
    getTitle():string;
    /**
     * Get a bar, indexed from 0.
     * 
     * @param {number} barNumber 
     * @returns {IBar} 
     * @memberof Music
     */
    getBar(barNumber:number):IBar;

    setSimplify(simplify:boolean,useDrone:boolean);
    getSimplify(): boolean;
    getDroneUse(): boolean;

    /**
     * Convert to a string.
     * 
     * @returns {string} 
     * @memberof Music
     */
    toString():string;
}