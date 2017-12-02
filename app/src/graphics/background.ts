 /// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Handle the background graphics
 * 
 * @class Background
 * @extends {Phaser.Group}
 */
class Background extends Phaser.Group {

    private progress:Phaser.Image;
    private currNote:Phaser.Image[];
    private currNoteText:Phaser.BitmapText[];
    private currNoteParticles:Phaser.Particles.Arcade.Emitter[];
    private maxWidth:number;
    private static width:number;
    private static height:number;
    private state:MainState;
    private barCount:number;

    /**
     * Create background.
     * 
     * @param {Phaser.Game} game 
     * @param {string} title 
     * @memberof Background
     */
    constructor(game:Phaser.Game,state:MainState,title:string,barCount:number) {
        super(game);
        this.state = state;this.barCount = barCount;
        // Background image
        Background.width = game.width;Background.height = game.height;
        var bgr:Phaser.Image = this.game.add.image(0,0,"sprites","frame",this);
        bgr.width = this.game.width;
        bgr.height= this.game.height;
        bgr.inputEnabled = true;
        bgr.events.onInputDown.add(function() { 
            if (game.input.position.y < 700) 
            { this.goLoopPosition(); } else { this.nextPlayStyle(); }
                         },this.state);
        
        // Top area
        var ttl:Phaser.Image = this.game.add.image(0,0,"sprites","rectangle",this);
        ttl.width = this.game.width;ttl.height = 50;
        ttl.tint = 0x0D76D9;
        ttl.inputEnabled = true;
        ttl.events.onInputDown.add(function() { this.restart(); },this.state);
        // Title
        var name:Phaser.BitmapText = this.game.add.bitmapText(this.game.width/4,9,"font",title,32,this);
        name.anchor.x = 0.5;name.tint = 0x063B6c*0;
        // Progress bar
        var subBar:Phaser.Image = this.game.add.image(this.game.width/2,25,"sprites","rectangle",this);
        subBar.height = 40;subBar.width = this.game.width/2 - 10;
        subBar.anchor.y = 0.5;subBar.tint = 0x063B6c;
        subBar.inputEnabled = true;
        subBar.events.onInputDown.add(function(p,q) { 
            this.setLoopPosition((q.position.x-p.position.x)/p.width*barCount); },
        this.state);
        this.progress = this.game.add.image(this.game.width/2+2,25,"sprites","rectangle",this);
        this.progress.height = 36;this.maxWidth = subBar.width-4;
        this.progress.width = this.maxWidth / 2;
        this.progress.anchor.y = 0.5;this.progress.tint = 0x0D76D9;
        // Current note boxes.
        this.currNote = [];
        this.currNoteText = [];
        this.currNoteParticles = [];
        for (var s:number = 0;s < Configuration.strings;s++) {
            var img:Phaser.Image = this.game.add.sprite(0,0,"sprites","roundrect",this);
            img.y = 700;img.x = Background.x(s,img.y);
            img.width = 1.04*Background.size(img.y);img.height = 70;
            img.alpha = 0.5;
            img.anchor.x = 0.5;img.anchor.y = 1.0;img.tint = 0x00FFFF;
            this.currNote[s] = img;
            var txt:Phaser.BitmapText = this.game.add.bitmapText(0,0,"font","",img.height*0.7,this);
            txt.y = img.y - img.height * 0.45;txt.x = Background.x(s,txt.y);
            txt.anchor.x = txt.anchor.y = 0.5;txt.tint = 0xFFFFFF;
            txt.rotation = (1-s)*0.1;txt.alpha = img.alpha;
            this.currNoteText[s] = txt;
            this.currNoteParticles[s] = this.game.add.emitter(txt.x,txt.y,60);
            this.currNoteParticles[s].makeParticles("sprites","circle");
            this.currNoteParticles[s].setScale(0.5,1.0,0.5,1.0);
            this.currNoteParticles[s].gravity.x = 0;
            this.currNoteParticles[s].gravity.y = 0;
            this.currNoteParticles[s].forEach(function(particle){
                particle.tint = Math.floor(Math.random()*0x1000000);
            },this);
            this.currNoteParticles[s].setXSpeed(-200,200);
            this.currNoteParticles[s].setYSpeed(-200,200);
        }
        // Test 2 draws lines at intervals, test 1 shows spheres.
        //this.test2();
        //this.test();
    }

    /**
     * Destroy background
     * 
     * @memberof Background
     */
    destroy(): void {
        super.destroy();
        this.state = this.progress = null;this.currNote = this.currNoteText = null;
    }

    public setStringBoxText(str:number,txt:string) {
        this.currNoteText[str].text = txt;
        if (txt != "") {
            this.currNoteParticles[str].start(true,400,null,250);            
        }
    }
    /**
     * Set percentage completed.
     * 
     * @param {number} percent 
     * @memberof Background
     */
    public setProgress(percent:number) {
        percent = Math.min(100,percent);
        percent = Math.max(0,percent);
        this.progress.width = this.maxWidth * percent / 100;
    }

    /**
     * Ball drawing projection test
     * 
     * @private
     * @memberof Background
     */
    private test(): void {
        for (var s = 0;s < Configuration.strings;s++) {
            for (var y = 0;y <= 1000;y = y + 100) {
                var img:Phaser.Image = this.game.add.image(0,0,"sprites",(y == 0) ? "spyellow":"spred",this);
                img.y = Background.y(y);
                img.x = Background.x(s,img.y);
                img.anchor.x = 0.5;
                img.anchor.y = 1;
                img.width = img.height = Background.size(img.y)*0.6;
            }
        }
    }

    /**
     * Line drawing test.
     * 
     * @private
     * @memberof Background
     */
    private test2(): void {
        for (var s:number = 0;s <= 10;s++) {
                     var y:number = Background.y(s * 100);
            var img:Phaser.Image = this.game.add.image(this.game.width/2,y,"sprites","rectangle",this);
            img.width = Background.size(y)*3.5;img.height = 4;img.anchor.x = 0.5;img.anchor.y = 0.5;
            img.tint = (s == 0) ? 0xFFFF00:0xFF8000;
            if (s == 10) img.tint = 0x00FF00;
        }
    }

    /**
     * Convert a y up the fretboard to a pixel Y
     * 
     * @static
     * @param {number} y up the fretboard, 0-100.
     * @returns {number} 
     * @memberof Background
     */
    public static y(y:number):number {
        var camera:number = 500;
        y = Background.height-100-
            (1-camera/(y+camera))*(Background.height-200)*1.5;
        return y;
    }

    /**
     * Get the string centre position for a given pixel position
     * 
     * @static
     * @param {number} str string number 0-2
     * @param {number} yPixel pixel position vertically
     * @returns {number} x pixel position.
     * @memberof Background
     */
    public static x(str:number,yPixel:number):number {
        yPixel = Background.height-100-yPixel;
        var x:number = (str + 1) / (Configuration.strings+1)
                                *Background.width - Background.width/2;
        x = x * (1 - yPixel * 0.0012);
        return Background.width / 2 + x;
    }

    /**
     * Get the size scalar - distance between strings
     * 
     * @static
     * @param {number} yPixel pixel position vertically.
     * @returns {number} 
     * @memberof Background
     */
    public static size(yPixel:number):number {
        return Background.x(2,yPixel)-Background.x(1,yPixel);
    }
}