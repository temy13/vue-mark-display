import Vue from "vue";
import * as d3 from "d3";
import { colorSet } from "./_otherRendering";

// - image: https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2019/03/8c265d84bdd2e44dec08ed386366a3fa.png
// - image: https://cdn.pixabay.com/photo/2017/09/26/16/08/savings-2789112_1280.jpg

export const graphChart = (params, svg, data) => {
  var info = data.info ? data.info : {};
  // var default_radius = info.radius ? info.radius * params.unit : 30
  var defaultFontSize = info.fontSize ? info.fontSize * params.unit : 45;

  var line = d3
    .line()
    .x(function(d) {
      return d[0];
    })
    .y(function(d) {
      return d[1];
    });

  svg
    .append("path")
    .attr(
      "d",
      line([[0, params.height / 2], [params.width, params.height / 2]])
    )
    .attr("stroke", "black")
    .attr("fill", "none");

  svg
    .append("path")
    .attr("d", line([[params.width / 2, 0], [params.width / 2, params.height]]))
    .attr("stroke", "black")
    .attr("fill", "none");

  var x_pos = [0, 0.5, 0.5, -0.5, -0.5, 1, 1, -1, -1];
  var y_pos = [0, -0.5, 0.5, 0.5, -0.5, -1, 1, 1, -1];

  var nodes = data.nodes.map(function(item, index, _) {
    var pos = item.position
      ? item.position.split(",")
      : [x_pos[index], y_pos[index]];
    var id = item.id ? item.id : item.text;
    var fontColor = item.fontColor
      ? colorSet(item.fontColor)
      : colorSet("grey.darken3");
    // var r = item.radius ? item.radius : default_radius
    var fontSize = item.fontSize ? item.fontSize : defaultFontSize;
    return {
      id: id,
      text: item.text,
      color: fontColor,
      x: params.x_center + params.x_unit * parseFloat(pos[0]),
      y: params.y_center + params.y_unit * parseFloat(pos[1]),
      fontSize: fontSize,
      fontColor: fontColor,
      textHidden: false
    };
  });

  console.log(nodes);

  var text = svg
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("fill", function(d, i) {
      return d.fontColor;
    })
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("dx", function(d, i) {
      return d.x;
    })
    .attr("dy", function(d, i) {
      return d.y;
    }) //  + d.r / 2
    .attr("font-size", function(d, i) {
      return d.fontSize + "px";
    })
    .text(function(d, i) {
      return d.textHidden ? "" : d.text;
    });
};
