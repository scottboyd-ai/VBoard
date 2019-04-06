function KeyboardScene(){
  let _self = inherit(this, new Scene());
  let _parent = _self._parent;

  const y_offset = 250;
  const x_offset = 300;

  function displayResults(data){
    let element = document.getElementById("mobilelog");
    element.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
      element.innerHTML += (data[i].t.word + ' (' + (data[i].t.count/data[i].d) + ')\n');
    }
  }

  this.load = async function(app){
    _parent.load.call(this, app);
    // Key scale (1 == 31px x 31px)
    let scale = app.getCanvas().width / 650;

    const test = window.location.search.includes('test');
    let path = '/characters';
    if(test){
      path += '?test';
    }

    let characters = await fetch(path, {
      method: 'GET'
    }).then(response => {
      return response.json();
    }).then(data => {return data});


      // Outer ring of characters
    // characters = ["y", "f", "j", "x", "o", "c", "_", "b", "z", "k", "q", "p"];
    const outerRing = characters[0];
    for (let i = 0; i < outerRing.length; i++) {
      this.mapKey(app, outerRing[i], outerRing.length, i, scale, "", "", 3);
    }
    // // Middle circle of characters
    // characters = ["g", "h", "v", "d", "w", "m", "u", "l", "r"];
    const middleRing = characters[1];
    scale = app.getCanvas().width / 700;
    for (let i = 0; i < middleRing.length; i++) {
      this.mapKey(app, middleRing[i], middleRing.length, i, scale, "", "", 2);
    }
    // Bottom row of characters
    // characters = ["t", "i", "n", "a", "s", "e"];
    const innerRing = characters[2];
    scale = app.getCanvas().width / 800;
    for (let i = 0; i < innerRing.length; i++) {
      this.mapKey(app, innerRing[i], innerRing.length, i, scale, "", "", 1);
    }
    drawlayer = new Layer(app, app.getFloorLayer());
    field = new DragField();
    field.setWidth(app.getWidth());
    field.setHeight(app.getHeight());
    field.listen("onTrackEnd", function(e){
      document.getElementById("log").innerHTML = e.track.join("");
      /*
      * This is where word prediction needs to occur
      * */
      var letters = document.getElementById("log").innerHTML.trim();
      fetch('/analyze', {
        method: 'POST',
        body: JSON.stringify({ 'letters': letters })
      }).then(response =>{
        return response.json();
      }).then(data =>{
        displayResults(data);
      });
    });
    drawlayer.add(field);
  };

  this.createKey = function(character, scale, superscript, subscript){
    key = new Key(character, superscript, subscript);
    key.scale(scale);
    return key;
  };

  this.export = function(){
    var ex = _parent.export.call(this);
    ex.scene = "characterset";
    return ex;
  };

  this.loadDefault = function(){
  };

  this.mapKey = function(app, character, characterLength, index, scale, superscript, subscript, factor){
    let key = this.createKey(character, scale, superscript, subscript);
    app.getFloorLayer().add(key);
    const radians = (((360 / characterLength) * index) * Math.PI) / 180;
    let sin = Math.sin(radians);
    let cos = Math.cos(radians);
    key.move(x_offset + sin * key.getCalculatedWidth() * factor, y_offset - cos * key.getCalculatedHeight() * factor);
  }
}
