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
    public static NOSTRUM:number = -1;

    constructor(def:string,startTime:number,bar:IBar) {
        this.startTime = startTime;
        this.bar = bar;
        this.strum = [];
        def = def.toLowerCase();
        this.length = def.charCodeAt(Configuration.strings)-96;
        for (var i = 0;i < Configuration.strings;i++) {
            var fret = def.charAt(i) == "-" ? Strum.NOSTRUM : def.charCodeAt(i)-97;
            this.strum.push(fret);
        }
        // console.log(this.strum,this.length,def,this.toString());
    }
    getStrum(): number[] {
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
    toString(): string {
        var s = "";
        for (var x of this.strum) {
            s = s + ((x < 0) ? "-":x.toString());
        }
        s = s + ","+this.length.toString();
        return "{"+s+"}";
    }
    
}