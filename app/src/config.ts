/// <reference path="../lib/phaser.comments.d.ts"/>

class Configuration {
    /**
     * This is the number of units (0-1000, not pixels) allocated
     * per bar.
     * 
     * @static
     * @type {number}
     * @memberof Configuration
     */
    public static barDepth:number = 800;
    /**
     * Number of strings
     * 
     * @static
     * @type {number}
     * @memberof Configuration
     */
    public static strings:number = 3;
    /**
     * Instrument information.
     * 
     * @static
     * @type {IInstrument}
     * @memberof Configuration
     */
    public static instrument:IInstrument = null;

    /**
     * Speed scalar for playing.
     * 
     * @static
     * @type {number}
     * @memberof Configuration
     */
    public static speedScalar:number = 1;

    public static initialise(): void {
        Configuration.instrument = new Merlin();
        Configuration.strings = Configuration.instrument.getStringCount();
    }
}