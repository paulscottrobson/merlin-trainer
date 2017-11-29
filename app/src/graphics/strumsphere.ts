/// <reference path="../../lib/phaser.comments.d.ts"/>

class StrumSphere {
    private stringID:number;
    private sphere:Phaser.Image;
    private text:Phaser.BitmapText;
    private game:Phaser.Game;
    private isBent:boolean;

    constructor(game:Phaser.Game,stringID:number,chrom:number) {
        this.game = game;
        this.stringID = stringID;
        this.sphere = game.add.image(0,0,"sprites","sp"+StrumSphere.colours[chrom % StrumSphere.colours.length]);
        this.sphere.anchor.x = 0.5;this.sphere.anchor.y = 1;
        this.sphere.width = this.sphere.height = 10;
        var s:string = Configuration.instrument.mapOffsetToFret(chrom);
        this.isBent = false;
        if (s.charAt(s.length-1) == '^') {
            this.isBent = true;
            s = s.substr(0,s.length-1);
        }
        this.text = game.add.bitmapText(0,0,"dfont",s,10);
        this.text.anchor.x = 0.55;this.text.anchor.y = 0.5;
        if (this.isBent) {

            this.text.tint = 0xFF0000;
        }
    }

    destroy(): void {
        this.sphere.destroy();this.text.destroy();
        this.game = this.text = this.sphere = this.sphere = null;
    }

    private static colours:string[] = [
        "black",    // D/Open
        "grey",     // D#
        "red",      // E/1
        "darkgreen",// F
        "yellow",   // F#/2
        "green",    // G/3
        "grey",     // G#
        "blue",     // A/4
        "grey",     // A#
        "cyan",     // B/5
        "brown",    // C
        "orange",   // C#/6
        "magenta"   // D/7
    ];

    public setY(yPos:number):void {
        this.sphere.y = yPos;
        this.sphere.x = Background.x(this.stringID,this.sphere.y);
        var size:number = Background.size(this.sphere.y);
        //if (this.isBent) this.sphere.x += size/6;
        this.sphere.width = this.sphere.height = size * 0.7;
        this.text.x = this.sphere.x;
        this.text.y = this.sphere.y - this.sphere.height * 0.43;
        this.text.fontSize = size * (this.text.text.length > 1 ? 0.4:0.5);
    }

    public toTop():void {
        this.game.world.bringToTop(this.sphere);
        this.game.world.bringToTop(this.text);
    }

    public setVisible(isVisible:boolean):void {
        this.sphere.visible = isVisible;
        this.text.visible = isVisible;
    }
}
