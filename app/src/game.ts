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
    private playStyle = 0;

    init(music:IMusic) {

        Configuration.initialise();
        var json1:any = this.game.cache.getJSON("music_melody");
        this.melodyMusic = new Music(json1);
        this.playMusic = this.displayMusic = this.melodyMusic;
        if (BootState.differentBacktrack()) {
            var json2:any = this.game.cache.getJSON("music_chords");
            this.chordMusic = new Music(json2);
        }

    }

    create() {    
        this.background = new Background(this.game,this,
                     this.displayMusic.getTitle(),this.displayMusic.getBarCount());
        this.metronome = this.game.add.audio("metronome");
        this.player = new Player(this.game);
        this.chordBox = new ChordBox(this.game);
        this.speedArrow = new SpeedArrow(this.game);
        this.restart();
    }
    
    destroy() : void {
        this.displayMusic = this.playMusic = null;
        this.renderManager.destroy();
        this.background.destroy();
        this.chordBox.destroy();
        this.chordBox = this.background = this.renderManager = null;
    }

    nextPlayStyle(): void {
        this.playStyle += 1;
        // Styles: 0 M/M 1 S 2 SD 3 M/C 4 C/M 5 C/C
        if (this.playStyle == 6) this.playStyle = 0;
        if (!BootState.differentBacktrack() && this.playStyle ==3) this.playStyle = 0;
        //console.log(this.playStyle);
        this.restart();
    }

    restart(): void {
        if (this.renderManager != null) {
            this.renderManager.destroy();
        }
        this.displayMusic = this.playMusic = this.melodyMusic;
        if (this.playStyle >= 4) this.displayMusic = this.chordMusic;
        if (this.playStyle == 3 || this.playStyle == 5) {
            this.playMusic = this.chordMusic;
        }
        this.displayMusic.setSimplify(false,false);
        this.playMusic.setSimplify(false,false);
        if (this.playStyle == 1 || this.playStyle == 2) {
            this.displayMusic.setSimplify(true,this.playStyle == 2);
            this.playMusic.setSimplify(true,this.playStyle == 2);
        }
        this.renderManager = new RenderManager(this.game,this.displayMusic);       
        this.barPosition = 0;
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
