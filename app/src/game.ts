/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Main Game class.
 * 
 * @class MainState
 * @extends {Phaser.State}
 */
class MainState extends Phaser.State {

    public static VERSION:string="0.01 06-Dec-17 Phaser-CE 2.8.7 (c) PSR 2017";
    
    init() {
        // Initialise config
        Configuration.initialise(this.game);
        // Load in music
        var json:any = this.game.cache.getJSON("music");
    }

    create() {    
    }
   

    destroy() : void {
    }

    update() : void {
    }
}    
