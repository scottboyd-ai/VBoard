function DragField(){
  let _self = inherit(this, new Graphical());
  let _parent = _self._parent;
  this.className = "DragField";

  _dragpoint = null;
  _draglayer = null;
  _dragtrack = [];
  _dragcoords = [];

  this.setLayer = function(layer){
    _parent.setLayer(layer);
    _draglayer = new Layer(this.getLayer().getApplication(), this.getLayer());
  };

  this.onDragStart = function(e){
    _dragpoint = new GraphicalCoordinate(e.canvasX, e.canvasY);
    _dragpoint.listen("onDragEnd", function(e){
      _draglayer.remove(_dragpoint);
      _dragpoint = null;
    });
    let lastChar;
    let currentChar;
    _dragpoint.listen("onDrag", function(e){
      if (_dragpoint.getDraggedOver() != null && _dragpoint.getDraggedOver().className === "Key") {
        //Old track log for diagnostics
        // _dragtrack.push(+_dragtrack.length + "," + e.canvasX + "," + e.canvasY + "," + _dragpoint.getDraggedOver().getCharacter());
        currentChar = _dragpoint.getDraggedOver().getCharacter();
        if (currentChar !== lastChar) {
          lastChar = currentChar;
        } else {
          currentChar = '';
        }
        _dragtrack.push(currentChar);
        _dragcoords.push([e.canvasX, e.canvasY]);
      }
    });
    _draglayer.add(_dragpoint);
    _dragpoint.onDragStart(e);
    _dragpoint.onDrag(e);
  };

  this.onDrag = function(e){
    _dragpoint.onDrag(e);
  };

  this.onDragEnd = function(e){
    _dragpoint.onDragEnd(e);
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
