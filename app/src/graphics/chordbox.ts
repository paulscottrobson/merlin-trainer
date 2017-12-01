/// <reference path="../../lib/phaser.comments.d.ts"/>

class ChordBox extends Phaser.Group {
    private box:Phaser.Image;
    private label:Phaser.BitmapText;
    private buttons:Phaser.Image[];

    constructor(game:Phaser.Game) {
        super(game);
        this.box = this.game.add.image(20,110,"sprites","chordbox",this);
        this.box.width = 90;this.box.height = this.box.width * 2.5;
        this.label = this.game.add.bitmapText(this.box.x+this.box.width/2,this.box.y-10,"dfont","??",40,this);
        this.label.anchor.y = 1;this.label.anchor.x = 0.5;
        this.buttons = [];
        for (var n = 0;n < Configuration.strings;n++) {
            this.buttons[n] = this.game.add.image(0,0,"sprites","chordfinger",this);
            this.buttons[n].anchor.x = this.buttons[n].anchor.y = 0.5;            
            this.buttons[n].width = this.buttons[n].height = this.box.height / 8;
        }
        this.setState(null,null);
    }

    setState(label:string,chromatic:number[]): void {
        this.visible = (label != null);
        var stc:number = Configuration.strings;
        if (this.visible) {
            this.label.text = label;
            for (var s = 0;s < stc;s++) {
                this.buttons[s].x = this.box.x + s * this.box.width / (stc-1);
                this.buttons[s].y = this.box.y + chromatic[s] * this.box.height / 12;
            }
        }
    }

    destroy(): void {
        super.destroy();
        this.buttons = null;this.box = this.label = null;
    }
}