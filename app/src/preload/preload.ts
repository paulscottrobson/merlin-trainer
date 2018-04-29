/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 *  Preloads all resources except those loaded in Boot for use in the preloader.
 * 
 * @class PreloadState
 * @extends {Phaser.State}
 */
class PreloadState extends Phaser.State {

    /**
     * Preloader. Loads sprite atlas, font, metrnome sound and the instrument notes.
     * 
     * @memberOf PreloadState
     */
    preload(): void {
        // Create the loading sprite
        this.game.stage.backgroundColor = "#000000";
        var loader:Phaser.Sprite = this.add.sprite(this.game.width/2,
                                                   this.game.height/2,
                                                   "loader");
        loader.width = this.game.width * 9 / 10;
        loader.height = this.game.height / 8;        
        loader.anchor.setTo(0.5);
        this.game.load.setPreloadSprite(loader);
        // Get the sprite info, which we may need to check later.
        this.game.load.json("sprite_info","assets/sprites/sprites.json")    
        // Load the sprite atlas.
        this.game.load.atlas("sprites","assets/sprites/sprites.png",
                                       "assets/sprites/sprites.json");
        // Load the fonts
        for (var fontName of ["dfont","font"]) {
            this.game.load.bitmapFont(fontName,"assets/fonts/"+fontName+".png",
                                               "assets/fonts/"+fontName+".fnt");
        }

        // Load metronome sounds
        this.game.load.audio("metronome",["assets/sounds/metronome.mp3",
                                          "assets/sounds/metronome.ogg"]);        

        // Switch to game state when load complete.        
        this.game.load.onLoadComplete.add(() => { this.game.state.start("Main",true,false); },this);
    }
}
