/// <reference path="../../lib/phaser.comments.d.ts"/>

class Background extends Phaser.Group {

    private progress:Phaser.Image;
    private maxWidth:number;
    private static width:number;
    private static height:number;
    
    constructor(game:Phaser.Game,title:string) {
        super(game);
        Background.width = game.width;Background.height = game.height;
        var bgr:Phaser.Image = this.game.add.image(0,0,"sprites","frame",this);
        bgr.width = this.game.width;
        bgr.height= this.game.height;
        var name:Phaser.BitmapText = this.game.add.bitmapText(this.game.width/4,9,"font",title,32,this);
        name.anchor.x = 0.5;name.tint = 0x063B6c;
        var subBar:Phaser.Image = this.game.add.image(this.game.width/2,25,"sprites","rectangle",this);
        subBar.height = 40;subBar.width = this.game.width/2 - 10;
        subBar.anchor.y = 0.5;subBar.tint = 0x063B6c;
        this.progress = this.game.add.image(this.game.width/2+2,25,"sprites","rectangle",this);
        this.progress.height = 36;this.maxWidth = subBar.width-4;
        this.progress.width = this.maxWidth / 2;
        this.progress.anchor.y = 0.5;this.progress.tint = 0x0D76D9;
        this.test();
    }

    public setProgress(percent:number) {
        this.progress.width = this.maxWidth * percent / 100;
    }

    private test(): void {
        for (var s = 0;s < 3;s++) {
            for (var y = 0;y <= 1000;y = y + 100) {
                var img:Phaser.Image = this.game.add.image(0,0,"sprites",(y == 0) ? "spyellow":"spred",this);
                img.x = Background.x(s,y);
                img.y = Background.y(s,y);
                img.anchor.x = 0.5;
                img.anchor.y = 1;
                img.width = img.height = Background.size(y);
            }
        }
    }

    public static x(str:number,y:number):number {
        return (str - 1) * Background.width * (0.24-y*0.000175) + Background.width / 2;
    }

    public static y(str:number,y:number):number {
        return 700-620*y/1000;
    }

    public static size(y:number):number {
        return (Background.x(1,y)-Background.x(0,y)) * 0.7;
    }
}