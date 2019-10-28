import Vue from "vue";
import * as d3 from "d3";
import { colorSet } from "./_otherRendering";

var simulation = null;

export const networkChart = (params, svg, data, _id, current) => {
  var sources = data[0].sources.map(item => {
    var group = item.group ? item.group : 0;
    return {
      id: item.text,
      text: item.text,
      color: "#" + item.color,
      group: group
    };
  });
  var links = data[1].links.map(item => {
    var c = item.connect.split(" - ");
    return { source: c[0], target: c[1], value: 1 };
  });

  var r = 45;

  simulation = d3
    .forceSimulation()
    .force(
      "link",
      d3.forceLink().id(function(d) {
        return d.id;
      })
    )
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(params.x_center, params.y_center))
    .force("colllision", d3.forceCollide(r))
    .force("positioningX", d3.forceX())
    .force("positioningY", d3.forceY());

  simulation.force("link").distance(200);
  simulation.force("charge").strength(function(d) {
    return -150;
  }); //node間の力
  simulation
    .force("positioningX") //X方向の中心に向けた引力
    .strength(0.04);
  simulation
    .force("positioningY") //Y方向の中心に向けた引力
    .strength(0.04);

  var al = "abcseisaksaidsfkaskialslxlis";
  var markerID = "arrow" + al[current];
  var defs = svg.append("defs");
  var arrowY = 5;
  defs
    .append("marker")
    .attr("id", markerID)
    .attr("markerWidth", r)
    .attr("markerHeight", 35)
    .attr("refX", r + arrowY * 3)
    .attr("refY", arrowY)
    .attr("orient", "auto")
    .attr("markerUnits", "strokeWidth")
    .append("path")
    .attr(
      "d",
      "M0,0 L0," + arrowY * 2 + " L" + arrowY * 3 + "," + arrowY + " z"
    )
    .attr("fill", "#000");

  var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "black")
    .attr("marker-end", "url(#" + markerID + ")")
    .attr("stroke-width", function(d) {
      return Math.sqrt(d.value);
    });

  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(sources)
    .enter()
    .append("g");

  var circles = node
    .append("circle")
    .attr("r", r)
    .attr("fill", function(d) {
      return d.color;
    })
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  var lables = node
    .append("text")
    .attr("font-size", "20px")
    .text(function(d) {
      return d.text;
    })
    .attr("x", 6)
    .attr("y", 3);

  node.append("title").text(function(d) {
    return d.text;
  });

  simulation.nodes(sources).on("tick", ticked);

  simulation.force("link").links(links);

  // group

  var groups = svg.append("g").attr("class", "groups");
  var groupIds = d3
    .set(
      sources.map(function(n) {
        return +n.group;
      })
    )
    .values()
    .map(function(groupId) {
      return {
        groupId: groupId,
        count: sources.filter(function(n) {
          return +n.group == groupId;
        }).length
      };
    })
    .filter(function(group) {
      return group.count > 2;
    })
    .map(function(group) {
      return group.groupId;
    });

  var paths = groups
    .selectAll(".path_placeholder")
    .data(groupIds, function(d) {
      return +d;
    })
    .enter()
    .append("g")
    .attr("class", "path_placeholder")
    .append("path")
    .attr("stroke", function(d) {
      return "#ff0000";
    })
    .attr("fill", function(d) {
      return "transparent";
    })
    .attr("opacity", 0);
  paths
    .transition()
    .duration(2000)
    .attr("opacity", 1);

  function ticked() {
    link
      .attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });

    node.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
    updateGroups(groupIds, paths, node);
  }
};

var polygonGenerator = function(groupId, node) {
  var node_coords = node
    .filter(function(d) {
      return d.group == groupId;
    })
    .data()
    .map(function(d) {
      return [d.x, d.y];
    });

  return d3.polygonHull(node_coords);
};

function updateGroups(groupIds, paths, node) {
  var polygon, centroid;
  var scaleFactor = 1.5;
  var valueline = d3
    .line()
    .x(function(d) {
      return d[0];
    })
    .y(function(d) {
      return d[1];
    })
    .curve(d3.curveCatmullRomClosed);

  for (var groupId of groupIds) {
    var path = paths
      .filter(function(d) {
        return d == groupId;
      })
      .attr("transform", "scale(1) translate(0,0)")
      .attr("d", function(d) {
        polygon = polygonGenerator(d, node);
        centroid = d3.polygonCentroid(polygon);
        return valueline(
          polygon.map(function(point) {
            return [point[0] - centroid[0], point[1] - centroid[1]];
          })
        );
      });
    d3.select(path.node().parentNode).attr(
      "transform",
      "translate(" +
        centroid[0] +
        "," +
        centroid[1] +
        ") scale(" +
        scaleFactor +
        ")"
    );
  }
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
