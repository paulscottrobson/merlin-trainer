/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Bar implementation.
 * 
 * @class Bar
 * @implements {IBar}
 */
class Bar implements IBar {

    private music:IMusic;
    private barNumber:number;
    private strums:IStrum[];

    constructor(def:string,music:IMusic,barNumber:number) {
        this.music = music;
        this.barNumber = barNumber;
        this.strums = [];
        var qbTime = 0;
        for (var s of def.split(":")) {
            if (s != "") {
                var strum:IStrum = new Strum(s,qbTime,this);
                qbTime = qbTime + strum.getLength();
                this.strums.push(strum);
            }
        }
    }
    getMusic(): IMusic {
        return this.music;
    }
    getBarNumber(): number {
        return this.barNumber;
    }
    getStrumCount(): number {
        return this.strums.length;
    }
    getStrum(strumID: number): IStrum {
        return this.strums[strumID];
    }
    toString():string {
        var s:string = "";
        for (var s1 of this.strums) {
            s = s + " "+s1.toString();
        }
        return "{"+s+"}";
    }
    
}