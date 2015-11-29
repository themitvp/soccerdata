app.directive('networkGraph', function (){
   function link(scope, element) {
      var el = element[0],
      margin = {top: -5, right: -5, bottom: -5, left: -5},
      width = el.clientWidth - margin.left - margin.right,
      height = el.clientHeight - margin.top - margin.bottom;

      tooltip = Tooltip("vis-tooltip", 230);

      var zoom = d3.behavior.zoom()
      .scaleExtent([1, 10])
      .on("zoom", zoomed);

      var svg = d3.select(el).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
      .call(zoom);

      var rect = svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all");

      var container = svg.append("g");

      var force = d3.layout.force()
      .gravity(0.05)
      .distance(100)
      .charge(-30)
      .size([width, height]);



      var nodes = scope.nodes,
      nodelinks = scope.nodelinks;

      var edges = [];
      nodelinks.forEach(function(e) {
         var sourceNode = nodes.filter(function(n) { return n.id === e.source; })[0],
         targetNode = nodes.filter(function(n) { return n.id === e.target; })[0];
         
         if (typeof sourceNode !== "undefined" && typeof targetNode !== "undefined") {
            edges.push({source: sourceNode, target: targetNode, value: e.value, current_team: e.current_team});
         }
      });
      console.log(nodes.length, edges.length);

      force
      .nodes(nodes)
      .links(edges)
      .start();

      var edge = svg.selectAll(".link")
      .data(edges)
      .enter().append("line")
      .attr("class", "link");

      var node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .on("dblclick", dblclick)
      .call(force.drag().on("dragstart", dragstart));

      node.append("image")
      .attr("xlink:href", "https://github.com/favicon.ico")
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 16)
      .attr("height", 16);

      node.on("mouseover", function(d) {
         content = '<p class="main">Name: ' + d.name + '</span></p>';
         content += '<hr class="tooltip-hr">';
         content += '<p class="main">Age: ' + d.age + '</span></p>';
         tooltip.showTooltip(content,d3.event);

         d3.select(this).select('text')
         .style("font-size", "15px");
      })
      .on("mouseout", function() {
         tooltip.hideTooltip();
         d3.select(this).select('text')
         .style("font-size", "10px");
      });

      node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });

      force.on("tick", function() {
         edge.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });

         node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      });

      function dblclick(d) {
         d3.select(this).classed("fixed", d.fixed = false);
      }

      function dragstart(d) {
         d3.select(this).classed("fixed", d.fixed = true);
      }
      function zoomed() {
         container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }
   }
   return {
      link: link,
      restrict: 'E',
      scope: {
         nodes: '=',
         nodelinks: '='
      }
   };
});

/*
Resize:

resize()
d3.select(window).on("resize", resize);

function resize() {
    width = window.innerWidth, height = window.innerHeight;
    svg.attr("width", width).attr("height", height);
    force.size([width, height]).resume();
  }

*/