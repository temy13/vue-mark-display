import Vue from "vue";
import * as d3 from "d3";

export const renderChart = (params, svg, data, _id, current) => {
  var radius = 30;
  var nodes = data.map(function(item) {
    var color = `#${item.color}`;
    if (!item.color || item.color === "transparent") {
      color = "transparent";
    }
    var pos = item.position.split(",");
    var r = item.radius ? item.radius : radius;
    var fontSize = item.fontSize ? item.fontSize : r / 2 + "px";
    var size = item.size ? item.size : 30;
    return {
      text: item.text,
      color: color,
      x: params.x_center + params.x_unit * parseFloat(pos[0]),
      y: params.y_center + params.y_unit * parseFloat(pos[1]),
      r: r,
      fontSize: fontSize,
      object: item.object,
      size: size
    };
  });

  for (var node of nodes) {
    if (node.object === "arrowDown") {
      var base = node.size;
      var ps = [
        params.x_center - base,
        params.y_center - base,
        params.x_center,
        params.y_center + base,
        params.x_center + base,
        params.y_center - base
      ];
      svg
        .append("path")
        .attr("x", node.x)
        .attr("y", node.y)
        .attr("d", `M${ps[0]},${ps[1]} L${ps[2]},${ps[3]} L${ps[4]},${ps[5]}`)
        .attr("fill", node.color);
    } else {
      svg
        .append("circle")
        .style("stroke", node.color)
        .style("fill", node.color)
        .attr("r", node.r)
        .attr("cx", node.x)
        .attr("cy", node.y);
    }

    if (node.text) {
      svg
        .append("text")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("dx", node.x)
        .attr("dy", node.y + radius / 2)
        .attr("font-size", node.fontSize)
        .text(node.text);
    }
  }

  return svg;
};
