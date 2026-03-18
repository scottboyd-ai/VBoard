function DragField(){
  let _self = inherit(this, new Graphical());
  let _parent = _self._parent;
  this.className = "DragField";

  _dragpoint = null;
  _draglayer = null;
  _dragtrack = [];
  _dragcoords = [];
  _lastChar = null;

  this.setLayer = function(layer){
    _parent.setLayer(layer);
    _draglayer = new Layer(this.getLayer().getApplication(), this.getLayer());
  };

  this.onDragStart = function(e){
    _parent.onDragStart.call(this, e);
    _dragpoint = new GraphicalCoordinate(e.canvasX, e.canvasY);
    _dragpoint.setDraggable(false);
    _draglayer.add(_dragpoint);
    _lastChar = null;
  };

  this.onDrag = function(e){
    if (_dragpoint == null) {
      return;
    }

    _dragpoint.setX(e.canvasX);
    _dragpoint.setY(e.canvasY);
    this.getLayer().getApplication()
      .getCanvas().style.cursor = "move";
    e.bubble = true;
    this.getLayer().getApplication().onEvent(e, "onDragOver");
    this.getLayer().getBottomLayer().repaint();

    if (this.getDraggedOver() != null && this.getDraggedOver().className === "Key") {
      let currentChar = this.getDraggedOver().getCharacter();
      if (currentChar === _lastChar) {
        currentChar = '';
      } else {
        _lastChar = currentChar;
      }
      _dragtrack.push(currentChar);
      _dragcoords.push([e.canvasX, e.canvasY]);
    }
  };

  this.onDragEnd = function(e){
    if (_dragpoint != null) {
      _draglayer.remove(_dragpoint);
      _dragpoint = null;
    }
    _lastChar = null;
    _parent.onDragEnd.call(this, e);
    this.tell("onTrackEnd", { "track": _dragtrack });
    _dragtrack = [];
    _dragcoords = [];
  };

  this.paint = function(context){
    _parent.paint(context);
    if (_dragcoords.length > 0) {
      context.beginPath();
      context.fillStyle = 'blue';
      context.strokeStyle = 'blue';
      context.lineWidth = 3;
      context.moveTo(_dragcoords[0][0], _dragcoords[0][1]);
      for (let i = 1; i < _dragtrack.length; i++) {
        context.lineTo(_dragcoords[i][0], _dragcoords[i][1]);
        context.arc(_dragcoords[i][0], _dragcoords[i][1], 2, 0, 2 * Math.PI, false);
      }
      context.stroke();
      context.closePath();
    }
  }

}
