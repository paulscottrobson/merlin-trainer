/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Configuration information.
 * 
 * @class Configuration
 */
class Configuration {
    /**
     * Display width
     * 
     * @memberof Configuration
     */
    public static width:number;
    /**
     * Display height
     * 
     * @type {number}
     * @memberof Configuration
     */
    public static height:number;

    public static initialise(game:Phaser.Game): void {
        Configuration.width = game.width;
        Configuration.height = game.height;
    }
}