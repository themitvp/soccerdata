app.directive('networkGraph', function (){
   function link($scope, element) {

      var dr = 4,  /* default point radius*/
      off = 15,  /* cluster hull offset*/
      expand = {},  /* expanded clusters*/
      data, net, force, hullg, hull, linkg, innerlink, nodeg, node;

      var curve = d3.svg.line()
      .interpolate("cardinal-closed")
      .tension(.85);

      var fill = d3.scale.category20();

      var el = element[0],
      el_rect = el.getBoundingClientRect(),
      width = el.clientWidth,
      height = window.innerHeight - el_rect.bottom;

      var zoom = d3.behavior.zoom()
      .scaleExtent([0.5, 10])
      .on("zoom", zoomed);

      var vis = d3.select(el)
      .append("div")
      .classed("svg-container", true)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + height)
      .classed("svg-content-responsive", true)
      .call(zoom);

      tooltip = Tooltip("vis-tooltip", 230);

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

      hullg = vis.append("g");
      linkg = vis.append("g");
      nodeg = vis.append("g");

      data = {
         nodes: nodes,
         links: edges
      };

      init();

      vis.attr("opacity", 1e-6)
      .transition()
      .duration(100)
      .attr("opacity", 1);

      function noop() { return false; }

      function nodeid(n) {
         return n.size ? "_g_"+n.current_team_id : n.name;
      }

      function linkid(l) {
         var u = nodeid(l.source),
         v = nodeid(l.target);
         return u<v ? u+"|"+v : v+"|"+u;
      }

      function getGroup(n) { return n.current_team_id; }

      // constructs the network to visualize
      function network(data, prev, index, expand) {
         expand = expand || {};
         var gm = {},    /* group map */
         nm = {},    /* node map */
         lm = {},    /* link map */
         gn = {},    /* previous group nodes */
         gc = {},    /* previous group centroids */
         nodes = [], /* output nodes */
         links = []; /* output links */

         // process previous nodes for reuse or centroid calculation
         if (prev) {
            prev.nodes.forEach(function(n) {
               var i = index(n), o;
               if (n.size > 0) {
                  gn[i] = n;
                  n.size = 0;
               } else {
                  o = gc[i] || (gc[i] = {x:0,y:0,count:0});
                  o.x += n.x;
                  o.y += n.y;
                  o.count += 1;
               }
            });
         }
         
         // determine nodes
         for (var k=0; k<data.nodes.length; ++k) {
            var n = data.nodes[k],
            i = index(n),
            l = gm[i] || (gm[i]=gn[i]) || (gm[i]={current_team_id:i, size:0, nodes:[]});

            if (expand[i]) {
               // the node should be directly visible
               nm[n.name] = nodes.length;
               nodes.push(n);
               if (gn[i]) {
                  // place new nodes at cluster location (plus jitter)
                  n.x = gn[i].x + Math.random();
                  n.y = gn[i].y + Math.random();
               }
            } else {
               // the node is part of a collapsed cluster
               if (l.size == 0) {
                  // if new cluster, add to set and position at centroid of leaf nodes
                  nm[i] = nodes.length;
                  nodes.push(l);
                  if (gc[i]) {
                     l.x = gc[i].x / gc[i].count;
                     l.y = gc[i].y / gc[i].count;
                  }
               }
               l.nodes.push(n);
            }
            // always count group size as we also use it to tweak the force graph strengths/distances
            l.size += 1;
            n.group_data = l;
         }

         for (i in gm) {
            gm[i].link_count = 0;
         }

         // determine links
         for (k=0; k<data.links.length; ++k) {
            var e = data.links[k],
            u = index(e.source),
            v = index(e.target);
            if (u != v) {
               gm[u].link_count++;
               gm[v].link_count++;
            }
            u = expand[u] ? nm[e.source.name] : nm[u];
            v = expand[v] ? nm[e.target.name] : nm[v];
            var i = (u<v ? u+"|"+v : v+"|"+u),
            l = lm[i] || (lm[i] = {source:u, target:v, size:0});
            l.size += 1;
         }
         for (i in lm) { 
            links.push(lm[i]);
         }

         return {nodes: nodes, links: links};
      }

      function convexHulls(nodes, index, offset) {
         var hulls = {};

         // create point sets
         for (var k=0; k<nodes.length; ++k) {
            var n = nodes[k];
            if (n.size) continue;
            var i = index(n),
            l = hulls[i] || (hulls[i] = []);
            l.push([n.x-offset, n.y-offset]);
            l.push([n.x-offset, n.y+offset]);
            l.push([n.x+offset, n.y-offset]);
            l.push([n.x+offset, n.y+offset]);
         }

         // create convex hulls
         var hullset = [];
         for (i in hulls) {
            hullset.push({current_team_id: i, path: d3.geom.hull(hulls[i])});
         }

         return hullset;
      }

      function drawCluster(d) {
         // 0.8
         return curve(d.path);
      }

      function init() {
         if (force) force.stop();

         net = network(data, net, getGroup, expand);

         force = d3.layout.force()
         .nodes(net.nodes)
         .links(net.links)
         .size([width, height])
         .linkDistance(function(l, i) {
            var n1 = l.source, n2 = l.target;

            return 30 +
            Math.min(20 * Math.min((n1.size || (n1.current_team_id != n2.current_team_id ? n1.group_data.size : 0)),
               (n2.size || (n1.current_team_id != n2.current_team_id ? n2.group_data.size : 0))),
            -30 +
            30 * Math.min((n1.link_count || (n1.current_team_id != n2.current_team_id ? n1.group_data.link_count : 0)),
               (n2.link_count || (n1.current_team_id != n2.current_team_id ? n2.group_data.link_count : 0))),
            100);
         })
         .linkStrength(function(l, i) {
            return 1;
         })
         .gravity(0.7)
         .charge(-10000)
         .friction(0.5)
         .start();

         hullg.selectAll("path.hull").remove();
         hull = hullg.selectAll("path.hull")
         .data(convexHulls(net.nodes, getGroup, off))
         .enter().append("path")
         .attr("class", "hull")
         .attr("d", drawCluster)
         .style("fill", function(d) { return fill(d.current_team_id); })
         .on("click", function(d) {
            console.log("hull click", d, arguments, this, expand[d.current_team_id]);
            expand[d.current_team_id] = false;
            init();
         });

         innerlink = linkg.selectAll("line.link").data(net.links, linkid);
         innerlink.exit().remove();
         innerlink.enter().append("line")
         .attr("class", "link")
         .attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; })
         .style("stroke-width", function(d) { return d.size || 1; });

         node = nodeg.selectAll("circle.node").data(net.nodes, nodeid);
         node.exit().remove();
         node.enter().append("circle")
         .attr("class", function(d) { return "node" + (d.size?"":" leaf"); })
         .attr("r", function(d) { return d.size ? d.size + dr : dr+1; })
         .attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; })
         .style("fill", function(d) { return fill(d.current_team_id); })
         .on("click", function(d) {
            if (d3.event.defaultPrevented) return;
            console.log("node click", d, arguments, this, expand[d.current_team_id]);
            expand[d.current_team_id] = !expand[d.current_team_id];
            init();
         });

         node.call(force.drag);

         node.on("mouseover", function(d) {
            if (! d.name) {
               content = '<p class="main"><strong>Team:</strong> ' + d.nodes[0].current_team + '</p>';
               content += '<hr class="tooltip-hr">';
               content += '<p class="main">';
               content += '<strong>Connections:</strong> ' + d.weight + '<br>';
               content += '</p>';
            } else {
               content = '<p class="main"><strong>Name:</strong> ' + d.name + '</p>';
               content += '<hr class="tooltip-hr">';
               content += '<p class="main">';
               content += '<strong>Team:</strong> ' + d.current_team + '<br>';
               content += '<strong>Position:</strong> ' + d.position + '<br>';
               content += '<strong>Age:</strong> ' + d.age + '<br>';
               content += '<strong>Market Value:</strong> ' + d.marketvalue + '<br>';
               content += '<strong>Connections:</strong> ' + d.weight + '<br>';
               content += '</p>';
            }
            tooltip.showTooltip(content,d3.event);

            d3.select(this).classed("node-active", true);
         })
         .on("mousedown", function(d) {
            d3.event.stopPropagation();
         })
         .on("mouseout", function(d) {
            tooltip.hideTooltip();

            node.classed("node-active", false);
         });

         force.on("tick", function() {
            if (!hull.empty()) {
               hull.data(convexHulls(net.nodes, getGroup, off))
               .attr("d", drawCluster);
            }

            innerlink.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
         });
      }

      function zoomed() {
         //console.log("scale", d3.event.scale*100, "%");
         hullg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
         linkg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
         nodeg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
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
