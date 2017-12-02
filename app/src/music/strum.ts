/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Concrete strum.
 * 
 * @class Strum
 * @implements {IStrum}
 */
class Strum implements IStrum {

    private strum:number[];
    private startTime:number;
    private length:number;
    private bar:IBar;
    private music:IMusic;
    public static NOSTRUM:number = -1;
    private chordName:string;
    private nextChordChange:IStrum;

    constructor(def:string,startTime:number,bar:IBar) {
        this.startTime = startTime;
        this.bar = bar;
        this.music = bar.getMusic();
        this.strum = [];
        def = def.toLowerCase();
        this.length = def.charCodeAt(Configuration.strings)-96;
        for (var i = 0;i < Configuration.strings;i++) {
            var fret = def.charAt(i) == "-" ? Strum.NOSTRUM : def.charCodeAt(i)-97;
            this.strum.push(fret);
        }        
        this.chordName = Configuration.instrument.getChordName(this.strum);    
        //console.log(this.strum,this.chordName);
        this.nextChordChange = null;
        //console.log(this.strum,this.length,def,this.toString());
    }

    simplify(chrom:number[],drone:boolean):number[] {
        var result:number[] = [];
        var highNote:number = -1;
        for (var n:number = 0;n < chrom.length;n++) {
            result[n] = chrom[n];
            if (chrom[n] != Strum.NOSTRUM) highNote = n;
        }
        for (var n:number = 0;n < highNote;n++) {
            result[n] = drone ? 0 : Strum.NOSTRUM;            
        }
        
        return result;  
    }

    getStrum(): number[] {
        if (this.music.getSimplify()) {
            return this.simplify(this.strum,this.music.getDroneUse());
        }
        return this.strum;
    }
    getStartTime(): number {
        return this.startTime;
    }
    getEndTime(): number {
        return this.startTime+this.length;
    }
    getLength(): number {
        return this.length;
    }
    getBar(): IBar {
        return this.bar;
    }
    getChordName(): string {
        return this.chordName;
    }
    setNextChordChange(s:IStrum): void {
        this.nextChordChange = s;
    }
    getNextChordChange(): IStrum {
        return this.nextChordChange;
    }
    toString(): string {
        var s = "";
        for (var x of this.strum) {
            s = s + ((x < 0) ? "-":x.toString());
        }
        s = s + ","+this.length.toString();
        return "{"+s+"}";
    }
    
}