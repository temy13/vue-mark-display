import Vue from "vue";
import * as d3 from "d3";
import { colorSet } from "./_otherRendering";

// - image: https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2019/03/8c265d84bdd2e44dec08ed386366a3fa.png
// - image: https://cdn.pixabay.com/photo/2017/09/26/16/08/savings-2789112_1280.jpg

export const imageTilesChart = (params, svg, data) => {
  var info = data.info ? data.info : {};

  var n = info.tileNumber ? info.tileNumber : data.images.length;
  var w = 1,
    h = 1,
    item;
  switch (n) {
    case 3:
      w = 3;
      break;
    case 4:
      w = 2;
      h = 2;
      break;
    case 6:
      w = 3;
      h = 2;
      break;
    default:
      break;
  }

  console.log(params);

  var tileWidth = params.width / w;
  var tileHeight = params.height / h;

  var defaultOpacity = info.opacity ? info.opacity : 0.5;

  var x_pos = [0, 1, 1, 0];
  var y_pos = [0, 0, 1, 1];

  var defs = svg.append("defs");

  var items = data.images.map(function(item, index, _) {
    console.log(item);
    var pos = item.position
      ? item.position.split(",")
      : [x_pos[index], y_pos[index]];
    var _item = {
      id: index,
      src: item.image,
      x: tileWidth * parseFloat(pos[0]),
      y: tileHeight * parseFloat(pos[1]),
      width: tileWidth,
      height: tileHeight,
      opacity: item.opacity ? item.opacity : defaultOpacity,
      imgX: 0,
      imgY: 0
    };
    var img = new Image();
    img.onload = function() {
      _item.imgWidth = this.width;
      _item.imgHeight = this.height;
      var b = _item.width / _item.height / (this.width / this.height);
      if (b > 1.0) {
        _item.width *= b;
        _item.height *= b;
        _item.imgX = (tileWidth - _item.width) / 2;
        _item.imgY = (tileHeight - _item.height) / 2;
      }
      defs
        .append("pattern")
        .attr("id", `img_${_item.id}_${params.current}`)
        .attr("width", 1)
        .attr("height", 1)
        .attr("patternUnits", "objectBoundingBox")
        .append("image")
        .attr("x", _item.imgX)
        .attr("y", _item.imgY)
        .attr("width", _item.width)
        .attr("height", _item.height)
        .attr("xlink:href", _item.src);
    };
    img.src = item.image;
    return _item;
  });

  svg
    .selectAll("rectImage")
    .data(items)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return d.x;
    })
    .attr("y", function(d, i) {
      return d.y;
    })
    .attr("width", tileWidth)
    .attr("height", tileHeight)
    .style("fill", function(d) {
      return `url(#img_${d.id}_${params.current})`;
    })
    .style("opacity", function(d, i) {
      return d.opacity;
    });
  //
  // svg.selectAll("rect").data(items)
  //   .enter().append("rect")
  //     .attr("x", function(d, i){ return d.x })
  //   	.attr("y", function(d, i){ return d.y })
  //     .attr("width", tileWidth)
  //     .attr("height", tileHeight)
  //     .style("fill", "rgba(255,255,255,0.5)")

  // create an svg element
  // var imgPattern = defs.selectAll("pattern").data(items)
  // 	.enter()
  // .append("pattern")
  //     .attr("id", img_id)
  //     .attr("width", 1)
  //     .attr("height", 1)
  //     .attr("patternUnits", "objectBoundingBox")
  // 	.append("image")
  // 		.attr("x", 0)
  // 		.attr("y", 0)
  //     .attr("width", function(d, i){ console.log(d.width); return d.width })
  //     .attr("height", function(d, i){ return d.height })
  //     .attr("xlink:href", function(d) {
  //       return d.src
  //     })

  // svg.selectAll("circle").data(circles)
  //   .enter().append("circle")
  // 		.attr("cx", function(d, i){ return i * size * 1.5 + size; })
  //   	.attr("cy", function(d, i){ return i % 2 ? 175 : 400; })
  // 		.attr("r", size / 2)
  //     .style("fill", img_url)
  // 		.style("stroke", color)

  //
  // var defs = svg.append('defs');
  // for(var i in items){
  //   item = items[i]
  //   defs.append('rect')
  //       .attr('id', `rect-${i}`)
  //       .attr('width', tileWidth)
  //       .attr('height', tileHeight)
  //       .attr('x', item.x)
  //       .attr('y', item.y);
  //   defs.append('clipPath')
  //       .attr('id', `clip-${i}`)
  //       .append('use')
  //       .attr('xlink:href', `#rect-${i}`);
  // }
  //
  //
  // svg.selectAll("img")
  //   .data(items)
  //   .enter()
  //   .append('image')
  //   .attr('xlink:href', function(d){return d.image})
  //   .attr('width',function(d){return tileWidth})
  //   .attr('height', function(d){return tileHeight})
  //   // .attr('clip-path', 'url(#clip)')
  //   .attr('x', function(d, i){return d.x})
  //   .attr('y', function(d, i){return d.y})
  //   .attr('clip-path', function(d, i){return `url(#clip-${i})`})
  //
  //
  //
  //
  //
  //
  //
  //
  // params.element.style.width = "100%"
  // params.element.style.height = "100%"
  //
  // var style = {
  //   "display": "inline-block",
  //   "overflow": "hidden",
  //   "float": "left"
  // }
  // var imgStyle = {
  //   "max-width": "initial",
  //   "max-height": "initial",
  //   "width": "auto",
  //   "height": "auto",
  // }
  //
  // style.width = `${parseInt(100/w, 10)}%`
  // style.height = `${parseInt(100/h, 10)}%`
  //
  // var width = params.width / w
  // var height = params.height / h
  // if(width < height) {
  //   imgStyle["max-width"] = "100%"
  // }else{
  //   imgStyle["max-height"] = "100%"
  // }
  //
  // var s = Object.keys(style).map(function(key){
  //   return `${key}: ${style[key]}`
  // }).join("; ")
  //
  // var imgs = Object.keys(imgStyle).map(function(key){
  //   return `${key}: ${imgStyle[key]}`
  // }).join("; ")
  //
  // var html = ""
  // for(var obj of data.images){
  //   html += `<div style='${s}'><img style='${imgs}' src="${obj.image}" /></div>`
  // }
  //params.element.innerHTML += html
};
