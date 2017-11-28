/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Music implementation
 * 
 * @class Music
 * @implements {IMusic}
 */
class Music implements IMusic {
    private beats:number;
    private tempo:number;
    private name:string;
    private bars:IBar[];

    constructor(music:any) {
        this.beats = parseInt(music.beats,10);
        this.tempo = parseInt(music.tempo,10);
        this.name = music.title;
        this.bars = [];
        for (var b of music.bars) {
            this.bars.push(new Bar(b,this,this.bars.length));
        }
        //console.log(this.toString());
        var cLastStrum:IStrum = null;
        for (var n:number = this.bars.length-1;n >= 0;n--) {
            cLastStrum = this.bars[n].scanNextStrum(cLastStrum);
        }
    }

    getDefaultTempo(): number {
        return this.tempo;
    }
    getBeats(): number {
        return this.beats;
    }
    getBarCount(): number {
        return this.bars.length;
    }
    getTitle(): string {
        return this.name;
    }
    getBar(barNumber: number): IBar {
        return this.bars[barNumber];
    }
    toString(): string {
        var s:string = "{" + this.getTitle()+" "+this.getDefaultTempo()+" "+this.getBeats()+" "+this.getBarCount();
        for (var b of this.bars) s = s + " "+b.toString();
        return s+"}";
    }
}