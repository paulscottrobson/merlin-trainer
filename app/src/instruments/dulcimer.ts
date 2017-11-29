/// <reference path="../../lib/phaser.comments.d.ts"/>
/// <reference path="./merlin.ts"/>

class Dulcimer extends Merlin {

    mapOffsetToFret(fret: number): string {
        var s:string = super.mapOffsetToFret(fret);
        if (s.charAt(0) == '6') {
            s = s.charAt(0)+"+"+s.substr(1);
        }
        return s;
    }   
}