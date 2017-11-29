/// <reference path="../../lib/phaser.comments.d.ts"/>

class SpeedArrow extends Phaser.Group {
    private arrow:Phaser.Image;

    constructor(game:Phaser.Game) {
        super(game);
        this.arrow = this.game.add.image(0,0,"sprites","arrow",this);
        this.arrow.width = this.arrow.height = this.game.width/4;
        this.arrow.anchor.x = this.arrow.anchor.y = 0.5;
        this.arrow.x = this.game.width - 10 - this.arrow.width / 2;
        this.arrow.y = 50 + 10 + this.arrow.height / 2;
        this.arrow.inputEnabled = true;
        this.arrow.tint = 0xFF8000;
    }

    destroy(): void {
        super.destroy();
        this.arrow = null;        
    }

    updateRotate(elapsedMS:number): void {
        var ptr:Phaser.Pointer = this.game.input.activePointer;
        if (ptr.leftButton.isDown && 
            Math.abs(ptr.x-this.arrow.x) < this.arrow.width/2 && 
            Math.abs(ptr.y-this.arrow.y) < this.arrow.height/2) {
                this.arrow.rotation = this.arrow.rotation + elapsedMS / 1000;
                if (this.arrow.rotation >= 2*Math.PI) this.arrow.rotation -= 2 * Math.PI;
                //console.log(this.arrow.rotation,Math.floor(this.scalar()*100));
                this.arrow.tint = (this.scalar() < 1 ? 0x0080F0:0x00FF00);
                if (this.scalar() > 0.98 && this.scalar() < 1.02) this.arrow.tint = 0xFF8000;
        }
    }

    scalar(): number {
        var n:number = (this.arrow.rotation - Math.PI) / Math.PI;
        if (n < 0) {
            n = 2 + n;
        } else {
            n = n * 3 / 4 + 0.25;
        }
        return n;
    }
}