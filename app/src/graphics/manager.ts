/// <reference path="../../lib/phaser.comments.d.ts"/>

class RenderManager {

    private renderers:Renderer[];
    private game:Phaser.Game;
    private music:IMusic;
    private lastOffset = -999;

    constructor(game:Phaser.Game,music:IMusic) {
        this.game = game;this.music = music;
        this.renderers = [];
        for (var n:number = 0;n < music.getBarCount();n++) {
            this.renderers[n] = new Renderer(this.game,this.music.getBar(n));
        }
        this.moveTo(0);
        this.sortAll();
    }

    destroy(): void {        
        for (var r of this.renderers) r.destroy();
        this.renderers = this.game = this.music = null;
    }

    moveTo(barOffset:number): void {
        var sortRequired:boolean = false;
        var offset = Math.round(barOffset * Configuration.barDepth);
        if (offset == this.lastOffset) return;
        this.lastOffset = offset;
        for (var n:number = 0;n < this.music.getBarCount();n++) {
            var oldDisplayed:boolean = this.renderers[n].isRendered();
            this.renderers[n].moveTo(offset+n * Configuration.barDepth);            
            if (this.renderers[n].isRendered() != oldDisplayed) {
                sortRequired = true;
            }
        }        
        if (sortRequired) this.sortAll();
    }

    sortAll(): void {
        for (var n:number = this.music.getBarCount()-1;n >= 0;n--) {
            this.renderers[n].sort();
        }
    }
}

/*        for (var b:number = 4;b >= 0;b--) {
            var rnd:Renderer = new Renderer(this.game,this.displayMusic.getBar(b));
            rnd.moveTo(b*Configuration.barDepth);
            rnd.sort();
        }
*/        
