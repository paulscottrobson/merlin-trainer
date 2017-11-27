/// <reference path="../../lib/phaser.comments.d.ts"/>

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

    public isRendered():boolean {
        return this.isCreated;
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
        // Strum Markers + Chord Text.
        this.strumMarkers = [];
        for (var strum = 0;strum < this.bar.getStrumCount();strum++) {
            var sInfo:IStrum = this.bar.getStrum(strum);
            var frets:number[] = sInfo.getStrum();
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
        if (barPos < -Configuration.barDepth || barPos > 1000+Configuration.barDepth) {
            this.deleteRender();
            return;
        }
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
            var y = this.getY(sInfo.getStartTime());
            for (var stringID:number = 0;stringID < Configuration.strings;stringID++) {
                if (frets[stringID] != Strum.NOSTRUM) {
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