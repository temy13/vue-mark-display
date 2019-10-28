import Vue from "vue";
import * as d3 from "d3";
import { colorSet } from "./_otherRendering";

var simulation = null;

export const networkSquare = (params, svg, data, _id, current) => {
  var info = data.info ? data.info : {};
  var default_radius = info.radius ? info.radius * params.unit : 30;
  var x_pos = [0, 0.5, 0.5, -0.5, -0.5, 1, 1, -1, -1];
  var y_pos = [0, -0.5, 0.5, 0.5, -0.5, -1, 1, 1, -1];

  //definition
  var nodes = data.sources.map(function(item, index, _) {
    var pos = item.position
      ? item.position.split(",")
      : [x_pos[index], y_pos[index]];
    var r = item.radius ? item.radius : default_radius;
    var textHidden = item.textHidden ? item.textHidden : false;
    var id = item.id ? item.id : item.text;
    var fontColor = item.fontColor ? item.fontColor : colorSet("grey.darken3");
    return {
      id: id,
      text: item.text,
      color: colorSet(item.color),
      r: r,
      x: params.x_center + params.x_unit * parseFloat(pos[0]),
      y: params.y_center + params.y_unit * parseFloat(pos[1]),
      textHidden: textHidden,
      fontColor: fontColor,
      image: item.image
    };
  });
  var tmpNodeHash = {};
  for (var node of nodes) {
    tmpNodeHash[node.id] = node;
  }
  var links = data.links.map(function(item, index) {
    var c = item.connect.split(" - ");
    var src = c[0];
    var dst = c[1];
    var srcNode = tmpNodeHash[src];
    var dstNode = tmpNodeHash[dst];
    return {
      id: index,
      source: src,
      target: dst,
      x1: srcNode.x,
      y1: srcNode.y,
      x2: dstNode.x,
      y2: dstNode.y,
      r: dstNode.r,
      color: item.color ? colorSet(item.color) : colorSet("black")
    };
  });

  var markerID = "arrow" + current;
  var defs = svg.append("defs");
  var arrowY = 5;
  var _radiuses = nodes.map(item => item.r);
  for (var link of links) {
    defs
      .append("marker")
      .attr("id", markerID + link.id)
      .attr("markerWidth", link.r)
      .attr("markerHeight", 35)
      .attr("refX", link.r + arrowY * 3)
      .attr("refY", arrowY)
      .attr("orient", "auto")
      .attr("markerUnits", "strokeWidth")
      .append("path")
      .attr(
        "d",
        "M0,0 L0," + arrowY * 2 + " L" + arrowY * 3 + "," + arrowY + " z"
      )
      .attr("fill", link.color);
  }

  var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", function(d) {
      return d.color;
    })
    .attr("x1", function(d) {
      return d.x1;
    })
    .attr("y1", function(d) {
      return d.y1;
    })
    .attr("x2", function(d) {
      return d.x2;
    })
    .attr("y2", function(d) {
      return d.y2;
    })
    .attr("marker-end", function(d) {
      return `url(#${markerID}${d.id})`;
    });

  var circles = svg
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .style("stroke", function(d, i) {
      return d.color;
    })
    .style("fill", function(d, i) {
      return d.color;
    })
    .attr("r", function(d, i) {
      return d.r;
    })
    .attr("cx", function(d, i) {
      return d.x;
    })
    .attr("cy", function(d, i) {
      return d.y;
    });

  var text = svg
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("fill", function(d, i) {
      return d.fontColor;
    })
    .attr("text-anchor", "middle")
    .attr("dx", function(d, i) {
      return d.x;
    })
    .attr("dy", function(d, i) {
      return d.y + d.r / 2;
    })
    .attr("font-size", function(d, i) {
      return d.r / 2 + "px";
    })
    .text(function(d, i) {
      return d.textHidden ? "" : d.text;
    });

  svg
    .selectAll("img")
    .data(nodes.filter(item => item.image))
    .enter()
    .append("image")
    .attr("xlink:href", function(d) {
      return d.image;
    })
    .attr("width", function(d) {
      return d.r * 2;
    })
    .attr("height", function(d) {
      return d.r * 2;
    })
    // .attr('clip-path', 'url(#clip)')
    .attr("x", function(d) {
      return d.x - d.r;
    })
    .attr("y", function(d) {
      return d.y - d.r;
    });

  return svg;
};
