/// <reference path="../../lib/phaser.comments.d.ts"/>
/// <reference path="./merlin.ts"/>

class Strumstick extends Merlin {
    mapOffsetToFret(fret: number): string {
        var s:string = super.mapOffsetToFret(fret);
        if (s.charAt(0) >= '6') {
            s = (parseInt(s.charAt(0),10)+1)+s.substr(1);
        }
        return s;
    }
}