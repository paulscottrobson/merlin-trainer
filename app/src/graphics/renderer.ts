/// <reference path="../../lib/phaser.comments.d.ts"/>

class StrumSphere {
    private stringID:number;
    private sphere:Phaser.Image;
    private text:Phaser.BitmapText;
    private game:Phaser.Game;

    constructor(game:Phaser.Game,stringID:number,fretID:number) {
        this.game = game;
        this.stringID = stringID;
        this.sphere = game.add.image(0,0,"sprites","sp"+StrumSphere.colours[fretID]);
        this.sphere.anchor.x = 0.5;this.sphere.anchor.y = 1;
        this.sphere.width = this.sphere.height = 10;
        this.text = game.add.bitmapText(0,0,"dfont",fretID.toString(),40);
        this.text.anchor.x = 0.6;this.text.anchor.y = 0.5;
    }

    destroy(): void {
        this.sphere.destroy();this.text.destroy();
        this.game = this.text = this.sphere = this.sphere = null;
    }

    private static colours:string[] = [
        "grey","red","yellow","green","blue","cyan","orange","magenta"
    ];

    public setY(yPos:number):void {
        this.sphere.y = yPos;
        this.sphere.x = Background.x(this.stringID,this.sphere.y);
        var size:number = Background.size(this.sphere.y);
        this.sphere.width = this.sphere.height = size * 0.7;
        this.text.x = this.sphere.x;
        this.text.y = this.sphere.y - this.sphere.height * 0.43;
        this.text.fontSize = size * 0.5;
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

class Renderer extends Phaser.Group {

    private isCreated:boolean;
    private barLines:Phaser.Image[];
    private strumMarkers:StrumSphere[];
    private beats:number;
    private bar:IBar;
    private pos:number;

    constructor(game:Phaser.Game,bar:IBar) {
        super(game);
        this.isCreated = false;    
        this.bar = bar;
        this.beats = bar.getMusic().getBeats();
    }

    destroy(): void {
        this.deleteRender();
        super.destroy();
        this.bar = null;
    }

    private createRender() : void {
        if (this.isCreated) return;
        this.isCreated = true;
        // Bar lines
        this.barLines = [];
        for (var beat:number=0;beat < this.beats;beat++) {
            var img:Phaser.Image = this.game.add.image(this.game.width/2,0,
                                                "sprites","rectangle",this);
            this.barLines[beat] = img;
            img.anchor.x = 0.5;img.anchor.y = 0.5;            
            img.height = (beat == 0) ? 4 : 1;
            img.tint = (beat == 0) ? 0xFFFF00:0x000000;         
        }
        // Strum Markers
        this.strumMarkers = [];
        for (var strum = 0;strum < this.bar.getStrumCount();strum++) {
            var sInfo:IStrum = this.bar.getStrum(strum);
            var frets:number[] = sInfo.getStrum();
            console.log(frets);
            for (var stringID:number = 0;stringID < Configuration.strings;stringID++) {
                if (frets[stringID] != Strum.NOSTRUM) {
                    var sm:StrumSphere = new StrumSphere(this.game,stringID,frets[stringID]);
                    this.strumMarkers.push(sm);                    
                }
            }
        }
    }

    private deleteRender(): void {
        if (!this.isCreated) return;
        for (var mark of this.strumMarkers) mark.destroy();
        this.removeAll(true);        
        this.isCreated = false;
        this.barLines = null;
        this.strumMarkers = null;
    }

    moveTo(barPos:number):void {
        if (!this.isCreated) this.createRender();
        this.pos = barPos;
        // Beat lines
        for (var beat:number = 0;beat < this.beats;beat++) {
            this.barLines[beat].y = this.getY(beat*4);
            this.barLines[beat].width = Background.size(this.barLines[beat].y)
                        *((beat == 0) ? 3.6 : 3.4);
            this.barLines[beat].visible = this.isVisible(this.barLines[beat].y);
        }
        // Strum Markers        
        var ixs:number = 0;
        for (var strum = 0;strum < this.bar.getStrumCount();strum++) {
            var sInfo:IStrum = this.bar.getStrum(strum);
            var frets:number[] = sInfo.getStrum();
            for (var stringID:number = 0;stringID < Configuration.strings;stringID++) {
                if (frets[stringID] != Strum.NOSTRUM) {
                    var y = this.getY(sInfo.getStartTime());
                    this.strumMarkers[ixs].setY(y);
                    this.strumMarkers[ixs].setVisible(this.isVisible(y));
                    ixs++;
                }
            }
        }
    }


    sort(): void {
        if (!this.isCreated) return;
        // Sort strum markers.
        for (var n = this.strumMarkers.length-1;n >= 0;n--) {
            if (this.strumMarkers[n] != null) {
                this.strumMarkers[n].toTop();
            }
        }
    }

    private getY(quarterBeat:number):number {
        return Math.round(Background.y(this.pos+quarterBeat/(this.beats*4)*Configuration.barDepth));
    }

    private isVisible(yPixel:number):boolean {
        return yPixel <= 700 && yPixel > 65;
    }
}