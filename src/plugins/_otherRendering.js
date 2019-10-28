import * as d3 from "d3";
import colors from "vuetify/lib/util/colors";
import * as canvg from "canvg";

export const otherRendering = (others, svg, params) => {
  if (!others) {
    return;
  }

  for (var obj of others) {
    if (obj.text) {
      var pos = obj.position.split(",");
      var fontSize = obj.fontSize ? obj.fontSize : params.fontSize;
      var color = obj.color ? colorSet(obj.color) : colorSet("red");
      svg
        .append("text")
        .attr("font-size", fontSize)
        .attr("fill", color)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text(obj.text)
        .attr("dx", params.x_center + params.x_unit * parseFloat(pos[0]))
        .attr("dy", params.y_center + params.y_unit * parseFloat(pos[1]));
    } else if (obj.texts) {
      var pos = obj.position.split(",");
      var x = params.x_center + params.x_unit * parseFloat(pos[0]);
      var y = params.y_center + params.y_unit * parseFloat(pos[1]);
      var fontSize = obj.fontSize ? obj.fontSize : params.fontSize;
      var color = obj.color ? colorSet(obj.color) : colorSet("red");
      svg
        .append("text")
        .attr("font-size", fontSize)
        .attr("fill", color)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .selectAll("tspan")
        .data(obj.texts)
        .enter()
        .append("tspan")
        .attr("y", (d, i) => `${(i + i * 0.2) * 16 + y}`)
        .attr("x", x)
        .text(d => d);
    }
    if (obj.src) {
      generateLine(svg, obj, params);
    }
    if (obj.type && obj.type === "rectangle") {
      obj.src = obj.point1;
      obj.dst = obj.point2;
      generateLine(svg, obj, params);
      obj.src = obj.point2;
      obj.dst = obj.point3;
      generateLine(svg, obj, params);
      obj.src = obj.point3;
      obj.dst = obj.point4;
      generateLine(svg, obj, params);
      obj.src = obj.point4;
      obj.dst = obj.point1;
      generateLine(svg, obj, params);
    }
    if (obj.object === "arrowDown") {
      var pos = obj.position.split(",");
      var fontSize = obj.fontSize ? obj.fontSize : "90px";
      var len = (parseFloat(fontSize.replace(/[^0-9]/g, "")) * 10) / 9;
      var color = obj.color ? colorSet(obj.color) : colorSet("red");
      svg
        .append("svg:foreignObject")
        .attr("width", len)
        .attr("height", len)
        .attr("font-size", fontSize)
        .attr("x", setX(params, pos[0]) - len / 2)
        .attr("y", setY(params, pos[1]) - len / 2)
        .append("xhtml:body")
        .html(`<i class="mdi mdi-arrow-down" style="color: ${color};"></i>`);
    }
  }
};

export const colorSet = s => {
  var a = s.split(".");
  if (!colors[a[0]]) {
    //TODO: 正規表現fff -> #fff
    return s;
  }
  var length = a.length;
  if (length === 1) {
    return colors[a[0]].base;
  }
  return colors[a[0]][a[1]];
};

export const setParams = (e, root, info) => {
  info = info ? info : {};
  var width = e.clientWidth > 0 ? e.clientWidth : root.clientWidth;
  var height = e.clientHeight > 0 ? e.clientHeight : 400;
  if (info.width) {
    width = info.width === "full" ? root.clientWidth : info.width;
  }
  if (info.height) {
    height = info.height === "full" ? root.clientHeight : info.height;
  }
  var unit = width > height ? height / 4 : width / 4;
  var fontSize = info.fontSize ? info.fontSize : unit / 5;
  console.log(unit);
  return {
    width: width,
    height: height,
    x_center: width / 2,
    y_center: height / 2,
    x_unit: width / 4,
    y_unit: height / 4,
    padding: 70,
    unit: unit,
    fontSize: fontSize
  };
};

export const setX = (params, s) => {
  return params.x_center + params.x_unit * parseFloat(s);
};

export const setY = (params, s) => {
  return params.y_center + params.y_unit * parseFloat(s);
};

function generateLine(svg, obj, params) {
  var src = obj.src.split(",");
  var dst = obj.dst.split(",");
  var color = obj.color ? colorSet(obj.color) : colors.grey.lighten3;
  var strokeWidth = obj.strokeWidth ? obj.strokeWidth : 2;
  svg
    .append("line")
    .attr("stroke", color)
    .attr("stroke-width", strokeWidth)
    .attr("x1", params.x_center + params.x_unit * parseFloat(src[0]))
    .attr("y1", params.y_center + params.y_unit * parseFloat(src[1]))
    .attr("x2", params.x_center + params.x_unit * parseFloat(dst[0]))
    .attr("y2", params.y_center + params.y_unit * parseFloat(dst[1]));
}
