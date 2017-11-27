/// <reference path="../lib/phaser.comments.d.ts"/>

class MainState extends Phaser.State {

    public static VERSION:string="0.01 26-Nov-17 Phaser-CE 2.8.7 (c) PSR 2017";
    private displayMusic:IMusic;
    private playMusic:IMusic;
    private background:Background;
    private renderManager:RenderManager;
    private barPosition:number = 0;

    init(music:IMusic) {
        Configuration.initialise();
        this.displayMusic = new Music(music);
        this.playMusic = this.displayMusic;
    }

    create() {    
        this.background = new Background(this.game,this.displayMusic.getTitle());
        this.renderManager = new RenderManager(this.game,this.displayMusic);
    }
    
    destroy() : void {
        this.displayMusic = this.playMusic = null;
        this.renderManager.destroy();
        this.background.destroy();
        this.background = this.renderManager = null;
    }

    update() : void {
        // Time in milliseconds
        var elapsed:number = this.game.time.elapsedMS;
        this.barPosition -= 0.003;
        this.renderManager.moveTo(this.barPosition);
    }
}    
