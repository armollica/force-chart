d3.forceChart = function() {
  var width = 400, 
      height = 300, 
      padding = 3,
      x = function(d) { return d[0]; },
      y = function(d) { return d[1]; },
      r = function(d) { return d[2]; },
      xStart = function(d) { return x(d) + 50*Math.random() - 25},
      yStart = function(d) { return y(d) + 50*Math.random() - 25},
      rStart = function(d) { return r(d); },
      draggable = true,
      xGravity = function(d) { return 1; },
      yGravity = function(d) { return 1; },
      rGravity = function(d) { return 1; },
      shape = "circle",
      tickUpdate = function() {};
  
  var force = d3.layout.force()
    .charge(0)
    .gravity(0);
  
  function chart(selection, nodes) {
    
    if (shape === "circle") { collide = collideCircle; }
    else if (shape === "square") { collide = collideSquare; }
    else { console.error("forceChart.shape must be 'circle' or 'square'"); }
    
    nodes = nodes
      .map(function(d) {
        d.x = xStart(d);
        d.y = yStart(d);
        d.r = rStart(d);
        d.x0 = x(d);
        d.y0 = y(d);
        d.r0 = r(d);
        return d;    
      });
      
    var gNodes = selection.selectAll(".node").data(nodes)
      .enter().append("g")
        .attr("class", "node")
        .call(draggable ? force.drag : null);
        
    force
      .size([width, height])
      .nodes(nodes)
      .on("tick", tick)
      .start();
      
    function tick(e) {
      gNodes
        .each(gravity(e.alpha * .1))
        .each(collide(.5))
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
        .call(tickUpdate);
    }

    function gravity(k) {
      return function(d) {
        var dx = d.x0 - d.x,
            dy = d.y0 - d.y,
            dr = d.r0 - d.r;
            
        d.x += dx * k * xGravity(d);
        d.y += dy * k * yGravity(d);
        d.r += dr * k * rGravity(d);
      };
    }

    function collideCircle(k) {
      var q = d3.geom.quadtree(nodes);
      return function(node) {
        var nr = node.r + padding,
            nx1 = node.x - nr,
            nx2 = node.x + nr,
            ny1 = node.y - nr,
            ny2 = node.y + nr;
        q.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== node)) {
            var x = node.x - quad.point.x,
                y = node.y - quad.point.y,
                l = x * x + y * y,
                r = nr + quad.point.r;
            if (l < r * r) {
              l = ((l = Math.sqrt(l)) - r) / l * k;
              node.x -= x *= l;
              node.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }
    
    function collideSquare(k) {
    var q = d3.geom.quadtree(nodes);
    return function(node) {
      var nr = node.r + padding,
          nx1 = node.x - nr,
          nx2 = node.x + nr,
          ny1 = node.y - nr,
          ny2 = node.y + nr;
      q.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
          var x = node.x - quad.point.x,
              y = node.y - quad.point.y,
              lx = Math.abs(x),
              ly = Math.abs(y),
              r = nr + quad.point.r;
          if (lx < r && ly < r) {
            if (lx > ly) {
              lx = (lx - r) * (x < 0 ? -k : k);
              node.x -= lx;
              quad.point.x += lx;
            } else {
              ly = (ly - r) * (y < 0 ? -k : k);
              node.y -= ly;
              quad.point.y += ly;
            }
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }
  }
  
  chart.size = function(_) {
    if (!arguments.length) return [width, height];
    width = _[0];
    height = _[1];
    return chart;
  };
  
  chart.x = function(_) {
    if (!arguments.length) return x;
    if (typeof _ === "number") {
      x = function() { return _; };
    }
    else if (typeof _ === "function") {
      x = _;
    }
    return chart;
  };
  
  chart.y = function(_) {
    if (!arguments.length) return y;
    if (typeof _ === "number") {
      y = function() { return _; };
    }
    else if (typeof _ === "function") {
      y = _;
    }
    return chart;
  };
  
  chart.r = function(_) {
    if (!arguments.length) return r;
    if (typeof _ === "number") {
      r = function() { return _; };
    }
    else if (typeof _ === "function") {
      r = _;
    }
    return chart;
  };
  
  chart.draggable = function(_) {
    if (!arguments.length) return draggable;
    draggable = _;
    return chart;
  };
  
  chart.padding = function(_) {
    if (!arguments.length) return padding;
    padding = _;
    return chart;
  };
  
  chart.xGravity = function(_) {
    if (!arguments.length) return xGravity;
    if (typeof _ === "number") {
      xGravity = function() { return _; };
    }
    else if (typeof _ === "function") {
      xGravity = _;
    }
    return chart;
  };
  
  chart.yGravity = function(_) {
    if (!arguments.length) return yGravity;
    if (typeof _ === "number") {
      yGravity = function() { return _; };
    }
    else if (typeof _ === "function") {
      yGravity = _;
    }
    return chart;
  };
  
  chart.rGravity = function(_) {
    if (!arguments.length) return rGravity;
    if (typeof _ === "number") {
      rGravity = function() { return _; };
    }
    else if (typeof _ === "function") {
      rGravity = _;
    }
    return chart;
  };
  
  chart.xStart = function(_) {
    if (!arguments.length) return xStart;
    if (typeof _ === "number") {
      xStart = function() { return _; };
    }
    else if (typeof _ === "function") {
      xStart = _;
    }
    return chart;
  };
  
  chart.yStart = function(_) {
    if (!arguments.length) return yStart;
    if (typeof _ === "number") {
      yStart = function() { return _; };
    }
    else if (typeof _ === "function") {
      yStart = _;
    }
    return chart;
  };
  
  chart.rStart = function(_) {
    if (!arguments.length) return rStart;
    if (typeof _ === "number") {
      rStart = function() { return _; };
    }
    else if (typeof _ === "function") {
      rStart = _;
    }
    return chart;
  };
  
  chart.shape = function(_) {
    if (!arguments.length) return shape;
    shape = _;
    return chart;
  };
  
  chart.tickUpdate = function(_) {
    if (!arguments.length) return tickUpdate;
    tickUpdate = _;
    return chart;
  };
  
  return chart;
};