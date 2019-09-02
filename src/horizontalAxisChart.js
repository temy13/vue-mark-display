import Vue from "vue";
import * as d3 from "d3";

export const horizontalAxisChart = (width, height, data, fontSize = 10) => {
  var margin = { top: 30, bottom: 60, right: 30, left: 60 };
  // 2. SVG領域の設定
  var svg = d3
    .select(".horizontalAxis")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var line = d3
    .line()
    .x(function(d) {
      return d[0];
    })
    .y(function(d) {
      return d[1];
    });
  svg
    .append("path") // パスを追加
    .attr("d", line([[0, width / 2], [width, width / 2]])) // 配列の座標を渡してpath要素のd属性に設定
    .attr("stroke", "black") // 線の色を黒にする
    .attr("fill", "none");

  // first
  var p = width / 2 + fontSize * 2;
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", p)
    .attr("font-weight", "bold")
    .attr("font-size", fontSize + "pt")
    .text(data[0]);

  // end
  var tw = "";
  svg
    .append("text")
    .attr("id", "tmp")
    .text(data[data.length - 1])
    .attr("font-weight", "bold")
    .attr("font-size", fontSize + "pt")
    .each(function(d) {
      var bbox = this.getBBox();
      tw = width - bbox.width;
    });
  svg.select("#tmp").remove();
  svg
    .append("text")
    .attr("x", tw)
    .attr("y", p)
    .attr("font-weight", "bold")
    .attr("font-size", fontSize + "pt")
    .text(data[data.length - 1]);

  var w = width / (data.length - 2);
  p = width / 2 - fontSize * 2;
  var bboxwidth = 0;
  var ty = 0;
  var tx = 0;
  for (var i = 0; i < data.length - 2; i++) {
    var t = svg
      .append("text")
      .attr("x", w * i)
      .attr("y", p)
      .attr("font-size", fontSize + "pt")
      .attr("width", w)
      .attr("height", fontSize * 2)
      .text(data[i + 1])
      .each(function(d) {
        var bbox = this.getBBox();
        bboxwidth = bbox.width;
      });
    if (ty === 0 && w < bboxwidth) {
      ty = fontSize * 1.5;
    } else if (w < bboxwidth) {
      ty = 0;
    }
    if (i === data.length - 3) {
      tx = width - bboxwidth - w * i;
    } else if (w > bboxwidth && w - bboxwidth > 50) {
      tx = bboxwidth / 2;
    } else if (w < bboxwidth && bboxwidth - w > 50) {
      tx = -1 * (bboxwidth / 2);
    }
    t.attr("transform", "translate(" + tx + ", -" + ty + ")");
  }
};
