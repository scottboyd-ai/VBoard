function KeyboardScene() {
    let _self = inherit(this, new Scene());
    let _parent = _self._parent;

    const y_offset = 250;
    const x_offset = 300;

    this.load = function (app) {
        _parent.load.call(this, app);
        // Key scale (1 == 31px x 31px)
        let scale = app.getCanvas().width / 650;

        // Outer ring of characters
        let characters = ["y", "f", "j", "x", "o", "c", "_", "b", "z", "k", "q", "p"];
        for (let i = 0; i < characters.length; i++) {
            this.mapKey(app, characters[i], characters.length, i, scale, "", "", 3);
        }
        // // Middle circle of characters
        characters = ["g", "h", "v", "d", "w", "m", "u", "l", "r"];
        scale = app.getCanvas().width / 700;
        for (let i = 0; i < characters.length; i++) {
            this.mapKey(app, characters[i], characters.length, i, scale, "", "", 2);
        }
        // Bottom row of characters
        characters = ["t", "i", "n", "a", "s", "e"];
        scale = app.getCanvas().width / 800;
        for (let i = 0; i < characters.length; i++) {
            this.mapKey(app, characters[i], characters.length, i, scale, "", "", 1);
        }
        drawlayer = new Layer(app, app.getFloorLayer());
        field = new DragField();
        field.setWidth(app.getWidth());
        field.setHeight(app.getHeight());
        field.listen("onTrackEnd", function (e) {
            document.getElementById("log").innerHTML = e.track.join("");
        });
        drawlayer.add(field);
    }

    this.createKey = function (character, scale, superscript, subscript) {
        key = new Key(character, superscript, subscript);
        key.scale(scale);
        return key;
    }

    this.export = function () {
        var ex = _parent.export.call(this);
        ex.scene = "characterset";
        return ex;
    }

    this.loadDefault = function () {
    }

    this.mapKey = function(app, character, characterLength, index, scale, superscript, subscript, factor) {
        let key = this.createKey(character, scale, superscript, subscript);
        app.getFloorLayer().add(key);
        const radians = (((360 / characterLength) * index) * Math.PI) / 180;
        let sin = Math.sin(radians);
        let cos = Math.cos(radians);
        key.move(x_offset + sin * key.getCalculatedWidth() * factor, y_offset - cos * key.getCalculatedHeight() * factor);
    }
}
