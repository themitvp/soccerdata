app.directive('networkGraph', function (){
   function link($scope, element) {
      var color = d3.scale.category20();

      var el = element[0],
      el_rect = el.getBoundingClientRect(),
      width = el.clientWidth,
      height = window.innerHeight - el_rect.bottom,
      circle_dia = 7;
console.log("test",el_rect.bottom);
      tooltip = Tooltip("vis-tooltip", 230);

      var zoom = d3.behavior.zoom()
      .scaleExtent([-10, 10])
      .on("zoom", zoomed);

      var svg = d3.select(el).append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(zoom);

      var g = svg.append("g");

      var force = d3.layout.force()
      .gravity(0.05)
      .distance(100)
      .charge(-150)
      .size([width, height]);

      resize();
      d3.select(window).on("resize", resize);

      var nodes = $scope.nodes,
      nodelinks = $scope.nodelinks;

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

      var edge = g.selectAll(".link")
      .data(edges)
      .enter().append("line")
      .attr("class", "link");

      var node = g.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .on("dblclick", dblclick)
      .call(force.drag().on("dragstart", dragstart));

      node.append('circle')
      .attr('r', circle_dia)
      .style('fill', function(d) { return color(d.age); });

      var linkedByIndex = {};
      edges.forEach(function(d) {
         linkedByIndex[d.source.index + "," + d.target.index] = 1;
      });

      function isConnected(a, b) {
         return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index];
      }

      node.on("mouseover", function(d) {
         content = '<p class="main">Name: ' + d.name + '</span></p>';
         content += '<hr class="tooltip-hr">';
         content += '<p class="main">Age: ' + d.age + '</span></p>';
         tooltip.showTooltip(content,d3.event);

         d3.select(this).select('text')
         .attr("dx", "22")
         .style("font-size", "15px");

         node.classed("node-active", function(o) {
            thisOpacity = isConnected(d, o) ? true : false;
            this.setAttribute('fill-opacity', thisOpacity);
            return thisOpacity;
         });

         edge.classed("link-active", function(o) {
            return o.source.id === d.id || o.target.id === d.id ? true : false;
         });

         d3.select(this).classed("node-active", true);
         d3.select(this).select("circle").transition()
         .duration(750)
         .attr("r", circle_dia*2);

      })
      .on("mousedown", function(d) {
         d3.event.stopPropagation();
      })
      .on("mouseout", function(d) {
         tooltip.hideTooltip();
         d3.select(this).select('text')
         .attr("dx", "12")
         .style("font-size", "10px");

         node.classed("node-active", false);
         edge.classed("link-active", false);

         d3.select(this).select("circle").transition()
         .duration(750)
         .attr("r", circle_dia);
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
         g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }

      function resize() {
         width = el.clientWidth;
         height = window.innerHeight - el_rect.bottom;
         svg.attr("width", width).attr("height", height);
         force.size([width, height]).resume();
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
