/// <reference path="../lib/phaser.comments.d.ts"/>

class MainState extends Phaser.State {

    public static VERSION:string="0.01 26-Nov-17 Phaser-CE 2.8.7 (c) PSR 2017";
    public music:IMusic;
    
    init(music:IMusic) {
        this.music = new Music(music);
        var bgr:Background = new Background(this.game,this.music.getTitle());
        for (var b:number = 4;b >= 0;b--) {
            var rnd:Renderer = new Renderer(this.game,this.music.getBar(b));
            rnd.moveTo(b*Configuration.barDepth);
            rnd.sort();
        }
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
