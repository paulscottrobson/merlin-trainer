/// <reference path="../../lib/phaser.comments.d.ts"/>

class Merlin implements IInstrument {

    private chords:any;

    constructor() {
        this.chords = {};
        var cList:string[] = Merlin.chordInfo.split(" ");
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
                byName = byName + this.mapOffsetToFret(c);
            }
        }
        if (byName in this.chords) {
            s = this.chords[byName];
            s = s[0].toUpperCase()+s.substr(1).toLowerCase();
        }
        return s;
    };

    private static fretMap:string[] = [
        "0","0^","1","1^","2","3","3^","4","4^","5","5^","6","7","7^"
    //   D   D#   E   F    F#  G   G#   A   A#   B   C    C#  D   D#
    ];
 
    private static chordInfo:string = "D:002 E:113 F#m:224 G:013 A:124 Bm:210 "+ 
        "C#dim:123 D:234 Em:345 F#:456 G:335 A:446 Bm:550 C#dim:346 "+
        "D5:000 E5:111 F#5:222 G5:333 A5:101 B5:212 C#5:323 "+
        "Dmaj7:022 Em7:133 F#m7:244 Gmaj7:312 A7:423 Bm7:534 C#o:645";        
}