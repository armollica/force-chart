d3.bubbleChart = function() {
  var width = 400, 
      height = 300, 
      padding = 3;
  
  var x = function(d) { return d[0]; },
      y = function(d) { return d[1]; },
      r = function(d) { return d[2]; },
      xStart = function(d) { return x(d) + 50*Math.random() - 25},
      yStart = function(d) { return y(d) + 50*Math.random() - 25},
      rStart = function(d) { return r(d); },
      stroke = function(d) { return null; },
      fill = function(d) { return null; };
  
  var force = d3.layout.force()
    .charge(0)
    .gravity(0);
    
  var draggable = true,
      xGravity = function(dx, k, d) { return dx * k; },
      yGravity = function(dy, k, d) { return dy * k; },
      rGravity = function(dr, k, d) { return dr * k; };
  
  function chart(selection, nodes) {
    
    nodes = nodes
      .map(function(d) {
        var xTarget = x(d),
            yTarget = y(d),
            rTarget = r(d);
         
        d.x = xStart(d);
        d.y = yStart(d);
        d.r = rStart(d);
        d.x0 = x(d);
        d.y0 = y(d);
        d.r0 = r(d);
        
        return d;    
      });
      
    force
      .size([width, height])
      .nodes(nodes)
      .on("tick", tick)
      .start();
    
    var bubbles = selection.selectAll(".bubble").data(nodes)
      .enter().append("circle")
      .call(draggable ? force.drag : null);
    
    function tick(e) {
      bubbles
        .each(gravity(e.alpha * .1))
        .each(collide(.5))
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return fill(d); })
        .style("stroke", function(d) { return stroke(d); });
    }

    function gravity(k) {
      return function(d) {
        var dx = d.x0 - d.x,
            dy = d.y0 - d.y,
            dr = d.r0 - d.r;
            
        d.x += xGravity(dx, k, d);
        d.y += yGravity(dy, k, d);
        d.r += rGravity(dr, k, d);
      };
    }

    function collide(k) {
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
  }
  
  chart.size = function(_) {
    if (!arguments.length) return [width, height];
    width = _[0];
    height = _[1];
    return chart;
  };
  
  chart.x = function(_) {
    if (!arguments.length) return x;
    x = _;
    return chart;
  };
  
  chart.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };
  
  chart.r = function(_) {
    if (!arguments.length) return r;
    r = _;
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
  
  chart.fill = function(_) {
    if (!arguments.length) return fill;
    fill = _;
    return chart;
  };
  
  chart.stroke = function(_) {
    if (!arguments.length) return stroke;
    stroke = _;
    return chart;
  };
  
  chart.xGravity = function(_) {
    if (!arguments.length) return xGravity;
    xGravity = _;
    return chart;
  };
  
  chart.yGravity = function(_) {
    if (!arguments.length) return yGravity;
    yGravity = _;
    return chart;
  };
  
  chart.rGravity = function(_) {
    if (!arguments.length) return rGravity;
    rGravity = _;
    return chart;
  };
  
  return chart;
};