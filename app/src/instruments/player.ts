/// <reference path="../../lib/phaser.comments.d.ts"/>

class Player {

    private static NOTE_COUNT:number = 27
    private notes:Phaser.Sound[];
    private current:Phaser.Sound[];


    constructor(game:Phaser.Game) {
        this.notes = [];
        this.current = [];
        for (var i:number = 1;i <= Player.NOTE_COUNT;i++) {
            this.notes[i] = game.add.audio(i.toString());   
        }
        for (var i = 0;i < Configuration.strings;i++) {
            this.current[i] = null;
        }
    }

    /**
     * Strum a note on a string.
     * 
     * @param {number} stringID 
     * @param {number} noteID 
     * @memberof Player
     */
    play(stringID:number,noteID:number) {
        if (this.current[stringID] != null) {
            this.current[stringID].stop();
        }
        this.current[stringID] = this.notes[noteID].play();
    }

    /**
     * Preloader.
     * 
     * @static
     * @param {Phaser.Game} game 
     * @memberof Player
     */
    public static preload(game:Phaser.Game): void {
        for(var n = 1;n <= Player.NOTE_COUNT;n++) {
            var s:string = n.toString();
            game.load.audio(s,["assets/sounds/"+s+".mp3",
                               "assets/sounds/"+s+".ogg"]);        
            }
    }

}