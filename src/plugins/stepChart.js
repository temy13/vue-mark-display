import Vue from "vue";
import * as d3 from "d3";
import colors from "vuetify/lib/util/colors";
import { colorSet } from "./_otherRendering";

var k = "step";

export const stepChart = (params, svg, data) => {
  var steps = data.steps;
  var length = steps.length;
  var b = length * 2 - 1;
  var w = params.width / b;
  var h = w / 2;

  var x_max = (1.5 / 5) * b;
  var x_min = (-1.5 / 5) * b;
  var x_unit = (x_max - x_min) / (length - 1);

  var x_pos = [...Array(length)].map((_, i) => {
    return x_min + i * x_unit;
  });
  console.log(x_pos);

  var defs = svg.append("defs");
  var arrowY = length / 2;
  var _id = `${params._id}-arrow-${params.current}`;
  defs
    .append("marker")
    .attr("id", _id)
    .attr("markerWidth", arrowY * 3)
    .attr("markerHeight", arrowY * 2)
    .attr("refX", 9 / length)
    .attr("refY", arrowY)
    .attr("orient", "auto")
    .attr("markerUnits", "strokeWidth")
    .append("path")
    .attr(
      "d",
      "M0,0 L0," + arrowY * 2 + " L" + arrowY * 3 + "," + arrowY + " z"
    )
    .attr("fill", colorSet("grey.darken3"));

  for (var i in steps) {
    var item = steps[i];
    var x = params.x_center + w * parseFloat(x_pos[i]) - w / 2;
    var y = params.y_center - h / 2;
    var fontSize = item.fontSize ? item.fontSize : 20;
    var rect = svg
      .append("rect")
      .attr("x", x)
      .attr("y", y)
      .attr("width", w)
      .attr("height", h)
      .attr("fill", colors.blue.lighten3);
    svg
      .append("text")
      .attr("font-size", fontSize)
      .text(item.text)
      .attr("text-anchor", "middle")
      .attr("fill", colors.grey.lighten3)
      .attr("dx", x + w / 2)
      .attr("dy", y + (fontSize * 1) / 4 + h / 2);
    if (i < length - 1) {
      var x2 = params.x_center + w * parseFloat(x_pos[parseInt(i) + 1]) - w / 2;
      svg
        .append("line")
        .attr("stroke", colorSet("grey.darken3"))
        .attr("stroke-width", 45 / (length * length))
        .attr("x1", x + w + arrowY)
        .attr("y1", y + h / 2)
        .attr("x2", x2 - 10)
        .attr("y2", y + h / 2)
        .attr("marker-end", function(d) {
          return `url(#${_id})`;
        });
    }
  }

  return svg;
};
