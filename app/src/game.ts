/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Main Game class.
 * 
 * @class MainState
 * @extends {Phaser.State}
 */
class MainState extends Phaser.State {

    public static VERSION:string="0.01 11-Jun-18 Phaser-CE 2.8.7 (c) PSR 2018";

    init() {
        // Initialise config
        Configuration.initialise(this.game);
    }

    create() {    
    }
    
    destroy() : void {
    }

    update() : void {
        // Time in milliseconds
        var elapsedMS:number = this.game.time.elapsedMS;
    }
}    
