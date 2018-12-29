function Mouse(area){
  let _self = inherit(this, new Observable());
  let _parent = _self._parent;
  this.className = "Mouse";

  let _area = area;

  this.getArea = function(){ return _area; };

  // Previous mouse position
  let _pMouse = { x: null, y: null };
  // Current mouse position
  let _cMouse = { x: null, y: null };

  this.getPreviousPosition = function(){ return _pMouse; };
  this.setPreviousPosition = function(mouse){ _pMouse = mouse; };
  this.getCurrentPosition = function(){ return _cMouse; };
  this.setCurrentPosition = function(mouse){ _cMouse = mouse; };
  this.getRelativePosition = function(){
    let p = this.getPreviousPosition();
    let c = this.getCurrentPosition();
    return { x: c.x - p.x, y: c.y - p.y };
  };

  this.updatePosition = function(x, y){
    this.setPreviousPosition(this.getCurrentPosition());
    this.setCurrentPosition({ x: x, y: y });
  };

  this.addAreaPosition = function(e){
    let x;
    let y;
    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= this.getArea().offsetLeft;
    y -= this.getArea().offsetTop;
    e.areaX = x;
    e.areaY = y;
  };

  this.addTouchAreaPosition = function(e){
    let x;
    let y;
    if (e.touches && e.touches[0] && (e.touches[0].pageX || e.touches[0].pageY)) {
      x = e.touches[0].pageX;
      y = e.touches[0].pageY;
    } else {
      x = e.changedTouches[0].clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.changedTouches[0].clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= this.getArea().offsetLeft;
    y -= this.getArea().offsetTop;
    e.areaX = x;
    e.areaY = y;
  };

  // Event handlers
  this.onMouseUp = function(e){
    this.addAreaPosition(e);
    e.mouse = this;
    this.tell("onMouseUp", e);
  };
  this.onMouseDown = function(e){
    this.addAreaPosition(e);
    e.mouse = this;
    this.tell("onMouseDown", e);
  };
  this.onMouseMove = function(e){
    this.addAreaPosition(e);
    this.updatePositionAndMove(e);
  };
  this.onMouseOut = function(e){
    this.addAreaPosition(e);
    e.mouse = this;
    this.tell("onMouseOut", e);
  };

  this.onTouchStart = function(e){
    this.addTouchAreaPosition(e);
    e.mouse = this;
    this.tell('onMouseDown', e);
  };
  this.onTouchMove = function(e){
    this.addTouchAreaPosition(e);
    this.updatePositionAndMove(e);
  };
  this.onTouchEnd = function(e){
    this.addTouchAreaPosition(e);
    e.mouse = this;
    this.tell('onMouseUp', e);
  };

  this.updatePositionAndMove = function(e){
    this.updatePosition(e.areaX, e.areaY);
    e.relPos = this.getRelativePosition();
    e.mouse = this;
    this.tell("onMouseMove", e);
  };

  EventHelper.registerListener({
    element: _area,
    on: "mouseup",
    callback: function(e){
      document.getElementById("mobilelog").innerHTML += 'mouseup\n';
      _self.onMouseUp(e)
    }
  });

  EventHelper.registerListener({
    element: _area,
    on: "touchend",
    callback: function(e){
      document.getElementById("mobilelog").innerHTML += 'touchend\n';
      _self.onTouchEnd(e)
    }
  });

  EventHelper.registerListener({
    element: _area,
    on: "mousedown",
    callback: function(e){
      document.getElementById("mobilelog").innerHTML += 'mousedown\n';
      _self.onMouseDown(e)
    }
  });

  EventHelper.registerListener({
    element: _area,
    on: "touchstart",
    callback: function(e){
      document.getElementById("mobilelog").innerHTML += 'touchstart\n';
      _self.onTouchStart(e)
    }
  });

  EventHelper.registerListener({
    element: _area,
    on: "mousemove",
    callback: function(e){
      _self.onMouseMove(e)
    }
  });

  EventHelper.registerListener({
    element: _area,
    on: "touchmove",
    callback: function(e){
      _self.onTouchMove(e)
    }
  });

  EventHelper.registerListener({
    element: _area,
    on: "mouseout",
    callback: function(e){
      document.getElementById("mobilelog").innerHTML += 'mouseout\n';
      _self.onMouseOut(e)
    }
  });
}
