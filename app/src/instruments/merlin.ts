/// <reference path="../../lib/phaser.comments.d.ts"/>

class Merlin implements IInstrument {
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

    private static fretMap:string[] = [
        "0","0^","1","1^","2","3","3^","4","4^","5","5^","6","7","7^"
    //   D   D#   E   F    F#  G   G#   A   A#   B   C    C#  D   D#
    ];
    
}