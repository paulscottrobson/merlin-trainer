/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Strum interface
 * 
 * @interface IStrum
 */
interface IStrum {
    /**
     * Get the strum fret positions, first value is bass.
     * 
     * @returns {number[]} 
     * @memberof IStrum
     */
    getStrum():number[];
    /**
     * Get start time in quarterbeats
     * 
     * @returns {number} 
     * @memberof IStrum
     */
    getStartTime():number;
    /**
     * Get end time in quarterbeats
     * 
     * @returns {number} 
     * @memberof IStrum
     */
    getEndTime():number;
    /**
     * Get length in quarterbeats
     * 
     * @returns {number} 
     * @memberof IStrum
     */
    getLength():number;
    /**
     * Get owning bar
     * 
     * @returns {IBar} 
     * @memberof IStrum
     */
    getBar():IBar;
    /**
     * Render as string.
     * 
     * @returns {string} 
     * @memberof IStrum
     */
    toString():string;
}