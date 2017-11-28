/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Bar interface.
 * 
 * @interface IBar
 */
interface IBar {
    /**
     * Get the owning music object
     * 
     * @returns {IMusic} 
     * @memberof IBar
     */
    getMusic():IMusic;
    /**
     * Get the bar number
     * 
     * @returns {number} 
     * @memberof IBar
     */
    getBarNumber():number;
    /**
     * Get the number of strums
     * 
     * @returns {number} 
     * @memberof IBar
     */
    getStrumCount():number;
    /**
     * Get a specific strum, indexed from zero.
     * 
     * @param {number} strumID 
     * @returns {number} 
     * @memberof IBar
     */
    getStrum(strumID:number):IStrum;
    /**
     * Convert to a string.
     * 
     * @returns {string} 
     * @memberof Music
     */
    toString():string;

    scanNextStrum(currentStrum:IStrum):IStrum;        
}