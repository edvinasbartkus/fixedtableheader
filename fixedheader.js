function FixedHeader(table, options) {
  this.element = table;
  this.clone = null
  this.options = options || {}
  this.specificContainer = options && options.container
  this.container = this.specificContainer ? $(options.container) : $(document.body)
  this.relativeContainer = this.container.style.position == "relative";
  this.doTheSyncCells = options && options.syncCells;

  this.cloneHeader = function() {
    this.clone = document.createElement("table");
    this.clone.style.border = "1px"; // TODO: WHY???????????
    this.clone.className = $w(this.element.className).join(" ") + " fixedheader";
    this.clone.cellSpacing = this.element.cellSpacing;
    this.clone.width = this.element.width;

    this.clone.appendChild(this.element.tHead.cloneNode(true));
    $(this.clone).setStyle({'position':'absolute'});
    this.container.appendChild(this.clone);
    this.onResize({ 'type' : "resize" });

    $(this.clone).setStyle({ 'width' : $(this.element).getWidth().toString() + "px" });
    if(this.doTheSyncCells) this.syncCells();
  }

  this.onResize = function(e) {
    var event = e || window.event;
    var resize = e.type == "resize";

    var scrollTop = document.viewport.getScrollOffsets().top;
    var tableTop = $(this.element).cumulativeOffset().top;
    var tableLeft = $(this.element).cumulativeOffset().left;
    var tableHeight = $(this.element).offsetHeight;
    var cloneHeight = $(this.clone).offsetHeight;
    
    var t;
    if(this.relativeContainer)
      t = (scrollTop - tableTop).toString() + "px";
    else
      t = (scrollTop - 125).toString() + "px";
      
    var l;
    if(this.relativeContainer)
      l = "1px" //(((this.specificContainer) ? $(this.container).cumulativeScrollOffset().left : 0) + 1).toString() + "px";
    else
      l = (tableLeft - ((this.specificContainer) ? $(this.container).cumulativeScrollOffset().left : 0) + 1) + "px";
    
    this.clone.setStyle({'top': t });
    this.clone.setStyle({'left': l });
    
    var thy = tableTop + this.element.rows[0].offsetTop;

    vis = (scrollTop <= thy || scrollTop > tableTop + tableHeight - cloneHeight) ? 'hidden': 'visible';
    this.clone.style.visibility = vis;
  }

  this.syncCells = function() {
    var tableCells = this.element.tBodies[0].rows[0].cells;
    var cloneCells = this.clone.tHead.rows[0].cells;

    for(var i=0; i<tableCells.length; i++) {
      $(cloneCells[i]).setStyle({'width':($(tableCells[i]).getWidth()-6).toString() + "px"});
    }
  }
  
  this.unload = function() {
    // $(window).stobObserving("resize", this.onResize.bind);
    // $(window).stopObserving("scroll", this.onResize.bind);
    // $(window).stopObserving("unload", this.unload);
  }
  this.onContainerResize = function(e) {
    var tableLeft = $(this.element).cumulativeOffset().left;
    var l;
    if(this.relativeContainer)
      l = "1px" // (-((this.specificContainer) ? $(this.container).cumulativeScrollOffset().left : 0)/10).toString() + "px";
    else
      l = (tableLeft - ((this.specificContainer) ? $(this.container).cumulativeScrollOffset().left : 0) + 1) + "px";
    this.clone.setStyle({'left': l });
    

  }
  Event.observe(window,"scroll", this.onResize.bind(this));
  Event.observe(window,"resize", this.onResize.bind(this));
  Event.observe(window,"unload", this.unload.bind(this));
  // $(window).observe("scroll", this.onResize.bind(this));
  // $(window).observe("resize", this.onResize.bind(this));
  // $(window).observe("unload", this.unload.bind(this));

  if(this.specificContainer) {
    $(this.container).observe("scroll", this.onContainerResize.bind(this));
    $(this.container).observe("resize", this.onContainerResize.bind(this));
  }
  
  this.cloneHeader()
}
