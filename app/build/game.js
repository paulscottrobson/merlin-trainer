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
    Configuration.initialise = function () {
        Configuration.instrument = new Merlin();
        Configuration.strings = Configuration.instrument.getStringCount();
    };
    Configuration.barDepth = 400;
    Configuration.strings = 3;
    Configuration.instrument = null;
    Configuration.speedScalar = 1;
    return Configuration;
}());
var MainState = (function (_super) {
    __extends(MainState, _super);
    function MainState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.barPosition = 0;
        _this.lastBar = -1;
        _this.lastQBeat = -1;
        return _this;
    }
    MainState.prototype.init = function (music) {
        Configuration.initialise();
        var json1 = this.game.cache.getJSON("music");
        this.displayMusic = new Music(json1);
        this.playMusic = this.displayMusic;
    };
    MainState.prototype.create = function () {
        this.background = new Background(this.game, this, this.displayMusic.getTitle(), this.displayMusic.getBarCount());
        this.renderManager = new RenderManager(this.game, this.displayMusic);
        this.metronome = this.game.add.audio("metronome");
        this.player = new Player(this.game);
        this.chordBox = new ChordBox(this.game);
    };
    MainState.prototype.destroy = function () {
        this.displayMusic = this.playMusic = null;
        this.renderManager.destroy();
        this.background.destroy();
        this.chordBox.destroy();
        this.chordBox = this.background = this.renderManager = null;
    };
    MainState.prototype.update = function () {
        var elapsedMS = this.game.time.elapsedMS;
        var adj = this.displayMusic.getDefaultTempo();
        adj = adj / 60;
        adj = adj / this.displayMusic.getBeats();
        this.barPosition = this.barPosition + elapsedMS * adj / 1000 * Configuration.speedScalar;
        this.renderManager.moveTo(-this.barPosition);
        this.background.setProgress(100 * this.barPosition / this.displayMusic.getBarCount());
        var bar = Math.floor(this.barPosition);
        var qBeat = Math.floor((this.barPosition - bar) * 4 * this.displayMusic.getBeats());
        if ((this.lastBar != bar || this.lastQBeat != qBeat) &&
            bar < this.displayMusic.getBarCount()) {
            this.lastBar = bar;
            this.lastQBeat = qBeat;
            if (qBeat % 4 == 0) {
                this.metronome.play("", 0, qBeat == 0 ? 1 : 0.3);
            }
            var cBar = this.playMusic.getBar(bar);
            for (var n = 0; n < cBar.getStrumCount(); n++) {
                if (cBar.getStrum(n).getStartTime() == qBeat) {
                    this.actionStrum(cBar.getStrum(n));
                }
            }
        }
    };
    MainState.prototype.setPosition = function (barPos) {
        this.barPosition = barPos;
    };
    MainState.prototype.actionStrum = function (strum) {
        var chrom = strum.getStrum();
        var tuning = Configuration.instrument.getTuning();
        for (var n = 0; n < Configuration.strings; n++) {
            var s = "";
            if (chrom[n] != Strum.NOSTRUM) {
                s = Configuration.instrument.mapOffsetToFret(chrom[n]);
                var note = chrom[n] + tuning[n];
                this.player.play(n, note);
            }
            this.background.setStringBoxText(n, s);
        }
        var chordStrum = strum.getNextChordChange();
        if (chordStrum != null) {
            this.chordBox.setState(chordStrum.getChordName(), chordStrum.getStrum());
        }
        else {
            this.chordBox.setState(null, null);
        }
    };
    MainState.VERSION = "0.01 26-Nov-17 Phaser-CE 2.8.7 (c) PSR 2017";
    return MainState;
}(Phaser.State));
var Background = (function (_super) {
    __extends(Background, _super);
    function Background(game, state, title, barCount) {
        var _this = _super.call(this, game) || this;
        _this.state = state;
        _this.barCount = barCount;
        Background.width = game.width;
        Background.height = game.height;
        var bgr = _this.game.add.image(0, 0, "sprites", "frame", _this);
        bgr.width = _this.game.width;
        bgr.height = _this.game.height;
        var ttl = _this.game.add.image(0, 0, "sprites", "rectangle", _this);
        ttl.width = _this.game.width;
        ttl.height = 50;
        ttl.tint = 0x0D76D9;
        ttl.inputEnabled = true;
        ttl.events.onInputDown.add(function () { this.setPosition(0); }, _this.state);
        var name = _this.game.add.bitmapText(_this.game.width / 4, 9, "font", title, 32, _this);
        name.anchor.x = 0.5;
        name.tint = 0x063B6c * 0;
        var subBar = _this.game.add.image(_this.game.width / 2, 25, "sprites", "rectangle", _this);
        subBar.height = 40;
        subBar.width = _this.game.width / 2 - 10;
        subBar.anchor.y = 0.5;
        subBar.tint = 0x063B6c;
        subBar.inputEnabled = true;
        subBar.events.onInputDown.add(function (p, q) {
            this.setPosition((q.position.x - p.position.x) / p.width * barCount);
        }, _this.state);
        _this.progress = _this.game.add.image(_this.game.width / 2 + 2, 25, "sprites", "rectangle", _this);
        _this.progress.height = 36;
        _this.maxWidth = subBar.width - 4;
        _this.progress.width = _this.maxWidth / 2;
        _this.progress.anchor.y = 0.5;
        _this.progress.tint = 0x0D76D9;
        _this.currNote = [];
        _this.currNoteText = [];
        _this.currNoteParticles = [];
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
            var txt = _this.game.add.bitmapText(0, 0, "font", "", img.height * 0.7, _this);
            txt.y = img.y - img.height * 0.45;
            txt.x = Background.x(s, txt.y);
            txt.anchor.x = txt.anchor.y = 0.5;
            txt.tint = 0xFFFFFF;
            txt.rotation = (1 - s) * 0.1;
            txt.alpha = img.alpha;
            _this.currNoteText[s] = txt;
            _this.currNoteParticles[s] = _this.game.add.emitter(txt.x, txt.y, 60);
            _this.currNoteParticles[s].makeParticles("sprites", "circle");
            _this.currNoteParticles[s].setScale(0.5, 1.0, 0.5, 1.0);
            _this.currNoteParticles[s].gravity.x = 0;
            _this.currNoteParticles[s].gravity.y = 0;
            _this.currNoteParticles[s].forEach(function (particle) {
                particle.tint = Math.floor(Math.random() * 0x1000000);
            }, _this);
            _this.currNoteParticles[s].setXSpeed(-200, 200);
            _this.currNoteParticles[s].setYSpeed(-200, 200);
        }
        return _this;
    }
    Background.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.state = this.progress = null;
        this.currNote = this.currNoteText = null;
    };
    Background.prototype.setStringBoxText = function (str, txt) {
        this.currNoteText[str].text = txt;
        if (txt != "") {
            this.currNoteParticles[str].start(true, 400, null, 250);
        }
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
var ChordBox = (function (_super) {
    __extends(ChordBox, _super);
    function ChordBox(game) {
        var _this = _super.call(this, game) || this;
        _this.box = _this.game.add.image(10, 100, "sprites", "chordbox", _this);
        _this.box.width = 90;
        _this.box.height = _this.box.width * 2.5;
        _this.label = _this.game.add.bitmapText(_this.box.x + _this.box.width / 2, _this.box.y, "dfont", "??", 40, _this);
        _this.label.anchor.y = 1;
        _this.label.anchor.x = 0.5;
        _this.buttons = [];
        for (var n = 0; n < Configuration.strings; n++) {
            _this.buttons[n] = _this.game.add.image(0, 0, "sprites", "chordfinger", _this);
            _this.buttons[n].anchor.x = _this.buttons[n].anchor.y = 0.5;
            _this.buttons[n].width = _this.buttons[n].height = _this.box.height / 8;
        }
        _this.setState(null, null);
        return _this;
    }
    ChordBox.prototype.setState = function (label, chromatic) {
        this.visible = (label != null);
        var stc = Configuration.strings;
        if (this.visible) {
            this.label.text = label;
            for (var s = 0; s < stc; s++) {
                this.buttons[s].x = this.box.x + s * this.box.width / (stc - 1);
                this.buttons[s].y = this.box.y + chromatic[s] * this.box.height / 12;
            }
        }
    };
    ChordBox.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.buttons = null;
        this.box = this.label = null;
    };
    return ChordBox;
}(Phaser.Group));
var RenderManager = (function () {
    function RenderManager(game, music) {
        this.lastOffset = -999;
        this.game = game;
        this.music = music;
        this.renderers = [];
        for (var n = 0; n < music.getBarCount(); n++) {
            this.renderers[n] = new Renderer(this.game, this.music.getBar(n));
        }
        this.moveTo(0);
        this.sortAll();
    }
    RenderManager.prototype.destroy = function () {
        for (var _i = 0, _a = this.renderers; _i < _a.length; _i++) {
            var r = _a[_i];
            r.destroy();
        }
        this.renderers = this.game = this.music = null;
    };
    RenderManager.prototype.moveTo = function (barOffset) {
        var sortRequired = false;
        var offset = Math.round(barOffset * Configuration.barDepth);
        if (offset == this.lastOffset)
            return;
        this.lastOffset = offset;
        for (var n = 0; n < this.music.getBarCount(); n++) {
            var oldDisplayed = this.renderers[n].isRendered();
            this.renderers[n].moveTo(offset + n * Configuration.barDepth);
            if (this.renderers[n].isRendered() != oldDisplayed) {
                sortRequired = true;
            }
        }
        if (sortRequired)
            this.sortAll();
    };
    RenderManager.prototype.sortAll = function () {
        for (var n = this.music.getBarCount() - 1; n >= 0; n--) {
            this.renderers[n].sort();
        }
    };
    return RenderManager;
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
    Renderer.prototype.isRendered = function () {
        return this.isCreated;
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
        if (barPos < -Configuration.barDepth || barPos > 1000 + Configuration.barDepth) {
            this.deleteRender();
            return;
        }
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
            var y = this.getY(sInfo.getStartTime());
            for (var stringID = 0; stringID < Configuration.strings; stringID++) {
                if (frets[stringID] != Strum.NOSTRUM) {
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
var StrumSphere = (function () {
    function StrumSphere(game, stringID, chrom) {
        this.game = game;
        this.stringID = stringID;
        this.sphere = game.add.image(0, 0, "sprites", "sp" + StrumSphere.colours[chrom % StrumSphere.colours.length]);
        this.sphere.anchor.x = 0.5;
        this.sphere.anchor.y = 1;
        this.sphere.width = this.sphere.height = 10;
        var s = Configuration.instrument.mapOffsetToFret(chrom);
        this.isBent = false;
        if (s.charAt(s.length - 1) == '^') {
            this.isBent = true;
            s = s.substr(0, s.length - 1);
        }
        this.text = game.add.bitmapText(0, 0, "dfont", s, 10);
        this.text.anchor.x = 0.5;
        this.text.anchor.y = 0.5;
        if (this.isBent) {
            this.text.tint = 0xFF0000;
        }
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
        this.text.fontSize = size * (this.text.text.length > 1 ? 0.4 : 0.5);
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
        "black",
        "grey",
        "red",
        "darkgreen",
        "yellow",
        "green",
        "grey",
        "blue",
        "grey",
        "cyan",
        "brown",
        "orange",
        "magenta"
    ];
    return StrumSphere;
}());
var Merlin = (function () {
    function Merlin() {
        this.chords = {};
        var cList = Merlin.chordInfo.split(" ");
        for (var _i = 0, cList_1 = cList; _i < cList_1.length; _i++) {
            var c = cList_1[_i];
            var name = c.split(":")[0].toLowerCase();
            var finger = c.split(":")[1];
            var reverse = finger.charAt(2) + finger.charAt(1) + finger.charAt(0);
            this.chords[finger] = name;
            this.chords[reverse] = name;
        }
    }
    Merlin.prototype.getStringCount = function () {
        return 3;
    };
    Merlin.prototype.getTuning = function () {
        return [1, 8, 13];
    };
    Merlin.prototype.mapOffsetToFret = function (fret) {
        return Merlin.fretMap[fret];
    };
    Merlin.prototype.isDoubleString = function (stringID) {
        return (stringID == 2);
    };
    Merlin.prototype.getChordName = function (chromOffset) {
        var s = null;
        var byName = "";
        for (var _i = 0, chromOffset_1 = chromOffset; _i < chromOffset_1.length; _i++) {
            var c = chromOffset_1[_i];
            if (c == Strum.NOSTRUM) {
                byName = byName + "-";
            }
            else {
                byName = byName + this.mapOffsetToFret(c);
            }
        }
        if (byName in this.chords) {
            s = this.chords[byName];
            s = s[0].toUpperCase() + s.substr(1).toLowerCase();
        }
        return s;
    };
    ;
    Merlin.fretMap = [
        "0", "0^", "1", "1^", "2", "3", "3^", "4", "4^", "5", "5^", "6", "7", "7^"
    ];
    Merlin.chordInfo = "D:002 E:113 F#m:224 G:013 A:124 Bm:210 " +
        "C#dim:123 D:234 Em:345 F#:456 G:335 A:446 Bm:550 C#dim:346 " +
        "D5:000 E5:111 F#5:222 G5:333 A5:101 B5:212 C#5:323 " +
        "Dmaj7:022 Em7:133 F#m7:244 Gmaj7:312 A7:423 Bm7:534 C#o:645";
    return Merlin;
}());
var Dulcimer = (function (_super) {
    __extends(Dulcimer, _super);
    function Dulcimer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Dulcimer.prototype.mapOffsetToFret = function (fret) {
        var s = _super.prototype.mapOffsetToFret.call(this, fret);
        if (s.charAt(0) == '6') {
            s = s.charAt(0) + "+" + s.substr(1);
        }
        return s;
    };
    return Dulcimer;
}(Merlin));
var Player = (function () {
    function Player(game) {
        this.notes = [];
        this.current = [];
        for (var i = 1; i <= Player.NOTE_COUNT; i++) {
            this.notes[i] = game.add.audio(i.toString());
        }
        for (var i = 0; i < Configuration.strings; i++) {
            this.current[i] = null;
        }
    }
    Player.prototype.play = function (stringID, noteID) {
        if (this.current[stringID] != null) {
            this.current[stringID].stop();
        }
        this.current[stringID] = this.notes[noteID].play();
    };
    Player.preload = function (game) {
        for (var n = 1; n <= Player.NOTE_COUNT; n++) {
            var s = n.toString();
            game.load.audio(s, ["assets/sounds/" + s + ".mp3",
                "assets/sounds/" + s + ".ogg"]);
        }
    };
    Player.NOTE_COUNT = 27;
    return Player;
}());
var Strumstick = (function (_super) {
    __extends(Strumstick, _super);
    function Strumstick() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Strumstick.prototype.mapOffsetToFret = function (fret) {
        var s = _super.prototype.mapOffsetToFret.call(this, fret);
        if (s.charAt(0) >= '6') {
            s = (parseInt(s.charAt(0), 10) + 1) + s.substr(1);
        }
        return s;
    };
    return Strumstick;
}(Merlin));
var Bar = (function () {
    function Bar(def, music, barNumber) {
        this.music = music;
        this.barNumber = barNumber;
        this.strums = [];
        var qbTime = 0;
        for (var _i = 0, _a = def.split(":"); _i < _a.length; _i++) {
            var s = _a[_i];
            if (s != "") {
                var strum = new Strum(s, qbTime, this);
                qbTime = qbTime + strum.getLength();
                this.strums.push(strum);
            }
        }
    }
    Bar.prototype.scanNextStrum = function (currentStrum) {
        for (var n = this.strums.length - 1; n >= 0; n--) {
            this.strums[n].setNextChordChange(currentStrum);
            if (this.strums[n].getChordName() != null) {
                currentStrum = this.strums[n];
            }
        }
        return currentStrum;
    };
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
        var cLastStrum = null;
        for (var n = this.bars.length - 1; n >= 0; n--) {
            cLastStrum = this.bars[n].scanNextStrum(cLastStrum);
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
        def = def.toLowerCase();
        this.length = def.charCodeAt(Configuration.strings) - 96;
        for (var i = 0; i < Configuration.strings; i++) {
            var fret = def.charAt(i) == "-" ? Strum.NOSTRUM : def.charCodeAt(i) - 97;
            this.strum.push(fret);
        }
        this.chordName = Configuration.instrument.getChordName(this.strum);
        this.nextChordChange = null;
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
    Strum.prototype.getChordName = function () {
        return this.chordName;
    };
    Strum.prototype.setNextChordChange = function (s) {
        this.nextChordChange = s;
    };
    Strum.prototype.getNextChordChange = function () {
        return this.nextChordChange;
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
        var src = MerlinTrainerApplication.getURLName("music", "music.json");
        this.game.load.json("music", MerlinTrainerApplication.getURLName("music", src));
        this.game.load.json("sprites", "assets/sprites/sprites.json");
        this.game.load.atlas("sprites", "assets/sprites/sprites.png", "assets/sprites/sprites.json");
        for (var _i = 0, _a = ["dfont", "font"]; _i < _a.length; _i++) {
            var fontName = _a[_i];
            this.game.load.bitmapFont(fontName, "assets/fonts/" + fontName + ".png", "assets/fonts/" + fontName + ".fnt");
        }
        Player.preload(this.game);
        this.game.load.audio("metronome", ["assets/sounds/metronome.mp3",
            "assets/sounds/metronome.ogg"]);
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Main", true, false); }, this);
    };
    return PreloadState;
}(Phaser.State));
