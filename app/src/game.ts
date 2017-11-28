/// <reference path="../lib/phaser.comments.d.ts"/>

class MainState extends Phaser.State {

    public static VERSION:string="0.01 26-Nov-17 Phaser-CE 2.8.7 (c) PSR 2017";
    private displayMusic:IMusic;
    private playMusic:IMusic;
    private background:Background;
    private player:Player;
    private renderManager:RenderManager;
    private barPosition:number = 0;
    private lastBar:number = -1;
    private lastQBeat:number = -1;
    private metronome:Phaser.Sound;
    private chordBox:ChordBox;

    init(music:IMusic) {

        Configuration.initialise();
        var json1:any = this.game.cache.getJSON("music");
        this.displayMusic = new Music(json1);
        this.playMusic = this.displayMusic;
    }

    create() {    
        this.background = new Background(this.game,this.displayMusic.getTitle());
        this.renderManager = new RenderManager(this.game,this.displayMusic);
        this.metronome = this.game.add.audio("metronome");
        this.player = new Player(this.game);
        this.chordBox = new ChordBox(this.game);
    }
    
    destroy() : void {
        this.displayMusic = this.playMusic = null;
        this.renderManager.destroy();
        this.background.destroy();
        this.chordBox.destroy();
        this.chordBox = this.background = this.renderManager = null;
    }

    update() : void {
        // Time in milliseconds
        var elapsedMS:number = this.game.time.elapsedMS;
        // Beats per minute
        var adj:number = this.displayMusic.getDefaultTempo();
        // Beats per second
        adj = adj / 60;
        // Bars per second
        adj = adj / this.displayMusic.getBeats();
        this.barPosition = this.barPosition + elapsedMS * adj / 1000 * Configuration.speedScalar;
        // Move display.
        this.renderManager.moveTo(-this.barPosition);
        // Update progress bar
        this.background.setProgress(100*this.barPosition / this.displayMusic.getBarCount());
        // Calc beat/qbeat position.
        var bar:number = Math.floor(this.barPosition);
        var qBeat:number = Math.floor((this.barPosition-bar)*4*this.displayMusic.getBeats());
        // Check if changed and we need to update stuff.    
        if ((this.lastBar != bar || this.lastQBeat != qBeat) && 
                                bar < this.displayMusic.getBarCount()) {
            this.lastBar = bar;
            this.lastQBeat = qBeat;
            if (qBeat % 4 == 0) {
                this.metronome.play("",0,qBeat == 0 ? 1 : 0.3);
            }
            var cBar:IBar = this.playMusic.getBar(bar);
            for (var n:number = 0;n < cBar.getStrumCount();n++) {
                if (cBar.getStrum(n).getStartTime() == qBeat) {
                    this.actionStrum(cBar.getStrum(n));
                }
            } 
        }
    }

    actionStrum(strum:IStrum):void {
        var chrom:number[] = strum.getStrum();
        var tuning:number[] = Configuration.instrument.getTuning();
        for (var n:number = 0;n < Configuration.strings;n++) {
            var s:string = "";
            if (chrom[n] != Strum.NOSTRUM) {
                s = Configuration.instrument.mapOffsetToFret(chrom[n]);
                var note:number = chrom[n] + tuning[n];
                //console.log(n,note,tuning[n],chrom[n]);
                this.player.play(n,note);
            }
            this.background.setStringBoxText(n,s);
        }
        var chordStrum:IStrum = strum.getNextChordChange();
        if (chordStrum != null) {
            console.log(chordStrum.getChordName());             
            this.chordBox.setState(chordStrum.getChordName(),chordStrum.getStrum());
        } else {
            console.log(null);
            this.chordBox.setState(null,null);
        }
    }
}    
