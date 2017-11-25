var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MainState = (function (_super) {
    __extends(MainState, _super);
    function MainState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainState.prototype.init = function (music) {
        console.log(music);
        this.music = new Music(music);
    };
    MainState.prototype.create = function () {
    };
    MainState.prototype.destroy = function () {
    };
    MainState.prototype.update = function () {
        var elapsed = this.game.time.elapsedMS;
    };
    MainState.VERSION = "0.93 16-Nov-17 Phaser-CE 2.8.7 (c) PSR 2017";
    return MainState;
}(Phaser.State));
var Bar = (function () {
    function Bar(def, music, barNumber) {
        this.music = music;
        this.barNumber = barNumber;
        this.strums = [];
        var qbTime = 0;
        for (var _i = 0, _a = def.split(":"); _i < _a.length; _i++) {
            var s = _a[_i];
            var strum = new Strum(s, qbTime, this);
            qbTime = qbTime + strum.getLength();
            this.strums.push(strum);
        }
    }
    Bar.prototype.getMusic = function () {
        return this.music;
    };
    Bar.prototype.getBarNumber = function () {
        return this.barNumber;
    };
    Bar.prototype.getStrumCount = function () {
        return this.strums.length;
    };
    Bar.prototype.getStrum = function (strumID) {
        return this.strums[strumID];
    };
    Bar.prototype.toString = function () {
        var s = "";
        for (var _i = 0, _a = this.strums; _i < _a.length; _i++) {
            var s1 = _a[_i];
            s = s + " " + s1.toString();
        }
        return "{" + s + "}";
    };
    return Bar;
}());
var Music = (function () {
    function Music(music) {
        this.beats = parseInt(music.beats, 10);
        this.tempo = parseInt(music.tempo, 10);
        this.name = music.title;
        this.bars = [];
        for (var _i = 0, _a = music.bars; _i < _a.length; _i++) {
            var b = _a[_i];
            this.bars.push(new Bar(b, this, this.bars.length));
        }
        console.log(this.toString());
    }
    Music.prototype.getDefaultTempo = function () {
        return this.tempo;
    };
    Music.prototype.getBeats = function () {
        return this.beats;
    };
    Music.prototype.getBarCount = function () {
        return this.bars.length;
    };
    Music.prototype.getTitle = function () {
        return this.name;
    };
    Music.prototype.getBar = function (barNumber) {
        return this.bars[barNumber];
    };
    Music.prototype.toString = function () {
        var s = "{" + this.getTitle() + " " + this.getDefaultTempo() + " " + this.getBeats() + " " + this.getBarCount();
        for (var _i = 0, _a = this.bars; _i < _a.length; _i++) {
            var b = _a[_i];
            s = s + " " + b.toString();
        }
        return s + "}";
    };
    return Music;
}());
var Strum = (function () {
    function Strum(def, startTime, bar) {
        this.startTime = startTime;
        this.bar = bar;
        this.strum = [];
        this.length = def.charCodeAt(3) - 96;
        for (var i = 0; i < 3; i++) {
            var fret = def.charAt(i) == "-" ? Strum.NOSTRUM : def.charCodeAt(i) - 48;
            this.strum.push(fret);
        }
    }
    Strum.prototype.getStrum = function () {
        return this.strum;
    };
    Strum.prototype.getStartTime = function () {
        return this.startTime;
    };
    Strum.prototype.getEndTime = function () {
        return this.startTime + this.length;
    };
    Strum.prototype.getLength = function () {
        return this.length;
    };
    Strum.prototype.getBar = function () {
        return this.bar;
    };
    Strum.prototype.toString = function () {
        var s = "";
        for (var _i = 0, _a = this.strum; _i < _a.length; _i++) {
            var x = _a[_i];
            s = s + ((x < 0) ? "-" : x.toString());
        }
        s = s + "," + this.length.toString();
        return "{" + s + "}";
    };
    Strum.NOSTRUM = -1;
    return Strum;
}());
window.onload = function () {
    var game = new MerlinTrainerApplication();
};
var MerlinTrainerApplication = (function (_super) {
    __extends(MerlinTrainerApplication, _super);
    function MerlinTrainerApplication() {
        var _this = _super.call(this, {
            enableDebug: false,
            width: 600,
            height: 800,
            renderer: Phaser.AUTO,
            parent: null,
            transparent: false, antialias: true
        }) || this;
        _this.state.add("Boot", new BootState());
        _this.state.add("Preload", new PreloadState());
        _this.state.add("Main", new MainState());
        _this.state.start("Boot");
        return _this;
    }
    MerlinTrainerApplication.getURLName = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = ""; }
        var name = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key.toLowerCase()).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        return (name == "") ? defaultValue : name;
    };
    return MerlinTrainerApplication;
}(Phaser.Game));
var BootState = (function (_super) {
    __extends(BootState, _super);
    function BootState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BootState.prototype.preload = function () {
        var _this = this;
        this.game.load.image("loader", "assets/sprites/loader.png");
        var src = MerlinTrainerApplication.getURLName("music", "music.json");
        this.game.load.json("music", MerlinTrainerApplication.getURLName("music", src));
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Preload", true, false, 1); }, this);
    };
    BootState.prototype.create = function () {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    };
    return BootState;
}(Phaser.State));
var PreloadState = (function (_super) {
    __extends(PreloadState, _super);
    function PreloadState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreloadState.prototype.preload = function () {
        var _this = this;
        this.game.stage.backgroundColor = "#000040";
        var loader = this.add.sprite(this.game.width / 2, this.game.height / 2, "loader");
        loader.width = this.game.width * 9 / 10;
        loader.height = this.game.height / 8;
        loader.anchor.setTo(0.5);
        this.game.load.setPreloadSprite(loader);
        this.game.load.json("sprites", "assets/sprites/sprites.json");
        this.game.load.atlas("sprites", "assets/sprites/sprites.png", "assets/sprites/sprites.json");
        for (var _i = 0, _a = ["font"]; _i < _a.length; _i++) {
            var fontName = _a[_i];
            this.game.load.bitmapFont(fontName, "assets/fonts/" + fontName + ".png", "assets/fonts/" + fontName + ".fnt");
        }
        var music = this.game.cache.getJSON("music");
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Main", true, false, music); }, this);
    };
    return PreloadState;
}(Phaser.State));
