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
var Configuration = (function () {
    function Configuration() {
    }
    Configuration.barDepth = 400;
    Configuration.strings = 3;
    return Configuration;
}());
var MainState = (function (_super) {
    __extends(MainState, _super);
    function MainState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainState.prototype.init = function (music) {
        this.music = new Music(music);
        var bgr = new Background(this.game, this.music.getTitle());
        for (var b = 4; b >= 0; b--) {
            var rnd = new Renderer(this.game, this.music.getBar(b));
            rnd.moveTo(b * Configuration.barDepth);
            rnd.sort();
        }
    };
    MainState.prototype.create = function () {
    };
    MainState.prototype.destroy = function () {
    };
    MainState.prototype.update = function () {
        var elapsed = this.game.time.elapsedMS;
    };
    MainState.VERSION = "0.01 26-Nov-17 Phaser-CE 2.8.7 (c) PSR 2017";
    return MainState;
}(Phaser.State));
var Background = (function (_super) {
    __extends(Background, _super);
    function Background(game, title) {
        var _this = _super.call(this, game) || this;
        Background.width = game.width;
        Background.height = game.height;
        var bgr = _this.game.add.image(0, 0, "sprites", "frame", _this);
        bgr.width = _this.game.width;
        bgr.height = _this.game.height;
        var name = _this.game.add.bitmapText(_this.game.width / 4, 9, "font", title, 32, _this);
        name.anchor.x = 0.5;
        name.tint = 0x063B6c;
        var subBar = _this.game.add.image(_this.game.width / 2, 25, "sprites", "rectangle", _this);
        subBar.height = 40;
        subBar.width = _this.game.width / 2 - 10;
        subBar.anchor.y = 0.5;
        subBar.tint = 0x063B6c;
        _this.progress = _this.game.add.image(_this.game.width / 2 + 2, 25, "sprites", "rectangle", _this);
        _this.progress.height = 36;
        _this.maxWidth = subBar.width - 4;
        _this.progress.width = _this.maxWidth / 2;
        _this.progress.anchor.y = 0.5;
        _this.progress.tint = 0x0D76D9;
        _this.currNote = [];
        _this.currNoteText = [];
        for (var s = 0; s < Configuration.strings; s++) {
            var img = _this.game.add.sprite(0, 0, "sprites", "roundrect", _this);
            img.y = 700;
            img.x = Background.x(s, img.y);
            img.width = 1.04 * Background.size(img.y);
            img.height = 70;
            img.alpha = 0.5;
            img.anchor.x = 0.5;
            img.anchor.y = 1.0;
            img.tint = 0x00FFFF;
            _this.currNote[s] = img;
            var txt = _this.game.add.bitmapText(0, 0, "font", "0", img.height * 0.7, _this);
            txt.y = img.y - img.height * 0.45;
            txt.x = Background.x(s, txt.y);
            txt.anchor.x = txt.anchor.y = 0.5;
            txt.tint = 0xFFFFFF;
            txt.rotation = (1 - s) * 0.1;
            txt.alpha = img.alpha;
            _this.currNoteText[s] = txt;
        }
        return _this;
    }
    Background.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.progress = null;
        this.currNote = this.currNoteText = null;
    };
    Background.prototype.setStringBoxText = function (str, txt) {
        this.currNoteText[str].text = txt;
    };
    Background.prototype.setProgress = function (percent) {
        percent = Math.min(100, percent);
        percent = Math.max(0, percent);
        this.progress.width = this.maxWidth * percent / 100;
    };
    Background.prototype.test = function () {
        for (var s = 0; s < Configuration.strings; s++) {
            for (var y = 0; y <= 1000; y = y + 100) {
                var img = this.game.add.image(0, 0, "sprites", (y == 0) ? "spyellow" : "spred", this);
                img.y = Background.y(y);
                img.x = Background.x(s, img.y);
                img.anchor.x = 0.5;
                img.anchor.y = 1;
                img.width = img.height = Background.size(img.y) * 0.6;
            }
        }
    };
    Background.prototype.test2 = function () {
        for (var s = 0; s <= 10; s++) {
            var y = Background.y(s * 100);
            var img = this.game.add.image(this.game.width / 2, y, "sprites", "rectangle", this);
            img.width = Background.size(y) * 3.5;
            img.height = 4;
            img.anchor.x = 0.5;
            img.anchor.y = 0.5;
            img.tint = (s == 0) ? 0xFFFF00 : 0xFF8000;
            if (s == 10)
                img.tint = 0x00FF00;
        }
    };
    Background.y = function (y) {
        var camera = 500;
        y = Background.height - 100 -
            (1 - camera / (y + camera)) * (Background.height - 200) * 1.5;
        return y;
    };
    Background.x = function (str, yPixel) {
        yPixel = Background.height - 100 - yPixel;
        var x = (str + 1) / (Configuration.strings + 1)
            * Background.width - Background.width / 2;
        x = x * (1 - yPixel * 0.0012);
        return Background.width / 2 + x;
    };
    Background.size = function (yPixel) {
        return Background.x(2, yPixel) - Background.x(1, yPixel);
    };
    return Background;
}(Phaser.Group));
var StrumSphere = (function () {
    function StrumSphere(game, stringID, fretID) {
        this.game = game;
        this.stringID = stringID;
        this.sphere = game.add.image(0, 0, "sprites", "sp" + StrumSphere.colours[fretID]);
        this.sphere.anchor.x = 0.5;
        this.sphere.anchor.y = 1;
        this.sphere.width = this.sphere.height = 10;
        this.text = game.add.bitmapText(0, 0, "dfont", fretID.toString(), 40);
        this.text.anchor.x = 0.6;
        this.text.anchor.y = 0.5;
    }
    StrumSphere.prototype.destroy = function () {
        this.sphere.destroy();
        this.text.destroy();
        this.game = this.text = this.sphere = this.sphere = null;
    };
    StrumSphere.prototype.setY = function (yPos) {
        this.sphere.y = yPos;
        this.sphere.x = Background.x(this.stringID, this.sphere.y);
        var size = Background.size(this.sphere.y);
        this.sphere.width = this.sphere.height = size * 0.7;
        this.text.x = this.sphere.x;
        this.text.y = this.sphere.y - this.sphere.height * 0.43;
        this.text.fontSize = size * 0.5;
    };
    StrumSphere.prototype.toTop = function () {
        this.game.world.bringToTop(this.sphere);
        this.game.world.bringToTop(this.text);
    };
    StrumSphere.prototype.setVisible = function (isVisible) {
        this.sphere.visible = isVisible;
        this.text.visible = isVisible;
    };
    StrumSphere.colours = [
        "grey", "red", "yellow", "green", "blue", "cyan", "orange", "magenta"
    ];
    return StrumSphere;
}());
var Renderer = (function (_super) {
    __extends(Renderer, _super);
    function Renderer(game, bar) {
        var _this = _super.call(this, game) || this;
        _this.isCreated = false;
        _this.bar = bar;
        _this.beats = bar.getMusic().getBeats();
        return _this;
    }
    Renderer.prototype.destroy = function () {
        this.deleteRender();
        _super.prototype.destroy.call(this);
        this.bar = null;
    };
    Renderer.prototype.createRender = function () {
        if (this.isCreated)
            return;
        this.isCreated = true;
        this.barLines = [];
        for (var beat = 0; beat < this.beats; beat++) {
            var img = this.game.add.image(this.game.width / 2, 0, "sprites", "rectangle", this);
            this.barLines[beat] = img;
            img.anchor.x = 0.5;
            img.anchor.y = 0.5;
            img.height = (beat == 0) ? 4 : 1;
            img.tint = (beat == 0) ? 0xFFFF00 : 0x000000;
        }
        this.strumMarkers = [];
        for (var strum = 0; strum < this.bar.getStrumCount(); strum++) {
            var sInfo = this.bar.getStrum(strum);
            var frets = sInfo.getStrum();
            console.log(frets);
            for (var stringID = 0; stringID < Configuration.strings; stringID++) {
                if (frets[stringID] != Strum.NOSTRUM) {
                    var sm = new StrumSphere(this.game, stringID, frets[stringID]);
                    this.strumMarkers.push(sm);
                }
            }
        }
    };
    Renderer.prototype.deleteRender = function () {
        if (!this.isCreated)
            return;
        for (var _i = 0, _a = this.strumMarkers; _i < _a.length; _i++) {
            var mark = _a[_i];
            mark.destroy();
        }
        this.removeAll(true);
        this.isCreated = false;
        this.barLines = null;
        this.strumMarkers = null;
    };
    Renderer.prototype.moveTo = function (barPos) {
        if (!this.isCreated)
            this.createRender();
        this.pos = barPos;
        for (var beat = 0; beat < this.beats; beat++) {
            this.barLines[beat].y = this.getY(beat * 4);
            this.barLines[beat].width = Background.size(this.barLines[beat].y)
                * ((beat == 0) ? 3.6 : 3.4);
            this.barLines[beat].visible = this.isVisible(this.barLines[beat].y);
        }
        var ixs = 0;
        for (var strum = 0; strum < this.bar.getStrumCount(); strum++) {
            var sInfo = this.bar.getStrum(strum);
            var frets = sInfo.getStrum();
            for (var stringID = 0; stringID < Configuration.strings; stringID++) {
                if (frets[stringID] != Strum.NOSTRUM) {
                    var y = this.getY(sInfo.getStartTime());
                    this.strumMarkers[ixs].setY(y);
                    this.strumMarkers[ixs].setVisible(this.isVisible(y));
                    ixs++;
                }
            }
        }
    };
    Renderer.prototype.sort = function () {
        if (!this.isCreated)
            return;
        for (var n = this.strumMarkers.length - 1; n >= 0; n--) {
            if (this.strumMarkers[n] != null) {
                this.strumMarkers[n].toTop();
            }
        }
    };
    Renderer.prototype.getY = function (quarterBeat) {
        return Math.round(Background.y(this.pos + quarterBeat / (this.beats * 4) * Configuration.barDepth));
    };
    Renderer.prototype.isVisible = function (yPixel) {
        return yPixel <= 700 && yPixel > 65;
    };
    return Renderer;
}(Phaser.Group));
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
        this.length = def.charCodeAt(Configuration.strings) - 96;
        for (var i = 0; i < Configuration.strings; i++) {
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
        for (var _i = 0, _a = ["dfont", "font"]; _i < _a.length; _i++) {
            var fontName = _a[_i];
            this.game.load.bitmapFont(fontName, "assets/fonts/" + fontName + ".png", "assets/fonts/" + fontName + ".fnt");
        }
        var music = this.game.cache.getJSON("music");
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Main", true, false, music); }, this);
    };
    return PreloadState;
}(Phaser.State));
