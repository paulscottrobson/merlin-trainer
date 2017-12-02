/// <reference path="../lib/phaser.comments.d.ts"/>

class MainState extends Phaser.State {

    public static VERSION:string="0.01 26-Nov-17 Phaser-CE 2.8.7 (c) PSR 2017";
    private melodyMusic:IMusic;
    private chordMusic:IMusic;
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
    private speedArrow:SpeedArrow;
    private loopPoint:number = 0;
    private displayNext:boolean = false;

    init(music:IMusic) {

        Configuration.initialise();
        var json1:any = this.game.cache.getJSON("music_melody");
        this.melodyMusic = new Music(json1);
        this.playMusic = this.displayMusic = this.melodyMusic;
        if (BootState.differentBacktrack()) {
            var json2:any = this.game.cache.getJSON("music_chords");
        }

    }

    create() {    
        this.background = new Background(this.game,this,
                     this.displayMusic.getTitle(),this.displayMusic.getBarCount());
        this.renderManager = new RenderManager(this.game,this.displayMusic);
        this.metronome = this.game.add.audio("metronome");
        this.player = new Player(this.game);
        this.chordBox = new ChordBox(this.game);
        this.speedArrow = new SpeedArrow(this.game);
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
        // Speed adjust
        adj = adj * this.speedArrow.scalar();
        // Bars per second
        adj = adj / this.displayMusic.getBeats();
        this.barPosition = this.barPosition + elapsedMS * adj / 1000 * Configuration.speedScalar;
        // Move display.
        this.renderManager.moveTo(-this.barPosition);
        // Update arrow
        this.speedArrow.updateRotate(elapsedMS);
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
                    this.actionPlayStrum(cBar.getStrum(n));
                }
            } 
            var cBar2:IBar = this.displayMusic.getBar(bar);
            for (var n:number = 0;n < cBar2.getStrumCount();n++) {
                if (cBar2.getStrum(n).getStartTime() == qBeat) {
                    this.actionDisplayStrum(cBar2.getStrum(n));
                }
            } 
        }
    }

    goLoopPosition(): void {
        this.barPosition = this.loopPoint;
    }

    setLoopPosition(barPos:number): void {
        this.barPosition = barPos;
        this.loopPoint = barPos;
    }

    actionPlayStrum(strum:IStrum):void {
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
        }
    }

    actionDisplayStrum(strum:IStrum): void {
        var chrom:number[] = strum.getStrum();
        var tuning:number[] = Configuration.instrument.getTuning();
        for (var n:number = 0;n < Configuration.strings;n++) {
            var s:string = "";
            if (chrom[n] != Strum.NOSTRUM) {
                s = Configuration.instrument.mapOffsetToFret(chrom[n]);
            }
            this.background.setStringBoxText(n,s);
        }
        if (this.displayNext) {
            var chordStrum:IStrum = strum.getNextChordChange();
            if (chordStrum != null) {
                //console.log(chordStrum.getChordName());             
                this.chordBox.setState(chordStrum.getChordName(),chordStrum.getStrum());
            } else {
                //console.log(null);
                this.chordBox.setState(null,null);
            }
        } else {
            var chordName:string = strum.getChordName();
            if (chordName != null) {
                this.chordBox.setState(chordName,strum.getStrum());
            }
        }
    }
}    
