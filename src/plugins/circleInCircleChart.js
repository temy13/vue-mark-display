import Vue from "vue";
import * as d3 from "d3";
import { colorSet } from "./_otherRendering";

export const circleInCircleChart = (params, svg, data, _id, current) => {
  //parent
  var fontSize = 30;
  var parent_radius =
    params.width >= params.height ? params.height / 2 : params.width / 2;
  var p = data.parent;
  var opacity = p.opacity ? p.opacity : 1;
  console.log(opacity);
  var parent = svg
    .append("circle")
    .style("stroke", "transparent")
    .style("fill", colorSet(p.color))
    .style("opacity", opacity)
    .attr("r", parent_radius)
    .attr("cx", params.x_center)
    .attr("cy", params.y_center);

  //chilrend
  var r = 0;
  var xs = [];
  var ys = [];
  var children = p.children;
  var l = children.length;
  switch (l) {
    case 4:
      var b = parent_radius / 2.5;
      xs = [
        params.x_center + b,
        params.x_center - b,
        params.x_center + b,
        params.x_center - b
      ];
      ys = [
        params.y_center + b,
        params.y_center - b,
        params.y_center - b,
        params.y_center + b
      ];
      r = parent_radius / 2.414;
      break;
    default:
      return;
  }

  for (var i in children) {
    svg
      .append("circle")
      .style("stroke", "transparent")
      .style("fill", colorSet(children[i].color))
      .style("opacity", opacity)
      .attr("r", r)
      .attr("cx", xs[i])
      .attr("cy", ys[i]);
    svg
      .append("text")
      .style("fill", colorSet("grey.darken3"))
      .style("opacity", opacity)
      .attr("text-anchor", "middle")
      .attr("dx", xs[i])
      .attr("dy", ys[i] + r / 2)
      .attr("font-size", r / 5 + "px")
      .text(children[i].text);
  }

  //parent
  svg
    .append("text")
    .style("opacity", opacity)
    .attr("fill", colorSet("grey.darken3"))
    .attr("text-anchor", "middle")
    .attr("dx", params.x_center)
    .attr("dy", params.height - parent_radius / 7)
    .attr("font-size", parent_radius / 5 + "px")
    .text(p.text);
};
