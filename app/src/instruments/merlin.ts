/// <reference path="../../lib/phaser.comments.d.ts"/>

class Merlin implements IInstrument {

    private chords:any;

    constructor() {
        this.chords = {};
        var cList:string[] = Chords.chordInfo.split(" ");
        for (var c of cList) {
            var name:string = c.split(":")[0].toLowerCase();
            var finger:string = c.split(":")[1];
            var reverse:string = finger.charAt(2)+finger.charAt(1)+finger.charAt(0);
            this.chords[finger] = name;
            this.chords[reverse] = name;
        }
    }

    getStringCount(): number {
        return 3;        
    }
    getTuning(): number[] {
        return [1,8,13];
    }
    mapOffsetToFret(fret: number): string {
        return Merlin.fretMap[fret];
    }
    isDoubleString(stringID: number): boolean {
        return (stringID == 2);
    }

    getChordName(chromOffset:number[]):string {
        var s:string = null;
        var byName:string = "";
        for (var c of chromOffset) {
            if (c == Strum.NOSTRUM) {
                byName = byName + "-";
            } else {
                byName = byName + this.mapOffsetToFret(c).toString();
            }
        }
        if (this.chords[byName] != undefined) {
            s = this.chords[byName];
            s = s[0].toUpperCase()+s.substr(1).toLowerCase();
        }
        return s;
    };

    private static fretMap:string[] = [
        "0","0^","1","1^","2","3","3^","4","4^","5","5^","6","7","7^"
    //   D   D#   E   F    F#  G   G#   A   A#   B   C    C#  D   D#
    ];
 
         
}