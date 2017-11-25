/// <reference path="../lib/phaser.comments.d.ts"/>

class MainState extends Phaser.State {

    public static VERSION:string="0.93 16-Nov-17 Phaser-CE 2.8.7 (c) PSR 2017";
    public music:IMusic;

    init(music:IMusic) {
        console.log(music);
        this.music = new Music(music);
    }

    create() {    
    }
    
    destroy() : void {
    }

    update() : void {
        // Time in milliseconds
        var elapsed:number = this.game.time.elapsedMS;
    }
}    
