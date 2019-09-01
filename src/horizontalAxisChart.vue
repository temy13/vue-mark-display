<template lang="pug">
.root
  #horizontalAxis
</template>

<script>
import Vue from "vue";
import * as d3 from "d3";

export default Vue.extend({
  data() {
    return {
      width: 400,
      height: 300,
      fontSize: 10,
      data: [
        "アカデミック",
        "蒸留",
        "AI/ML(text clf)",
        "開発(ML APIの組み込み)",
        "インタビューからの企画",
        "ビジネス"
      ]
    };
  },
  mounted() {
    var margin = { top: 30, bottom: 60, right: 30, left: 60 };

    // 2. SVG領域の設定
    var svg = d3
      .select("#horizontalAxis")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

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
      .attr("d", line([[0, this.width / 2], [this.width, this.width / 2]])) // 配列の座標を渡してpath要素のd属性に設定
      .attr("stroke", "black") // 線の色を黒にする
      .attr("fill", "none");

    // first
    var p = this.width / 2 + this.fontSize * 2;
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", p)
      .attr("font-weight", "bold")
      .attr("font-size", this.fontSize + "pt")
      .text(this.data[0]);

    // end
    var tw = "";
    var _this = this;
    svg
      .append("text")
      .attr("id", "tmp")
      .text(this.data[this.data.length - 1])
      .attr("font-weight", "bold")
      .attr("font-size", this.fontSize + "pt")
      .each(function(d) {
        var bbox = this.getBBox();
        tw = _this.width - bbox.width;
      });
    svg.select("#tmp").remove();
    svg
      .append("text")
      .attr("x", tw)
      .attr("y", p)
      .attr("font-weight", "bold")
      .attr("font-size", this.fontSize + "pt")
      .text(this.data[this.data.length - 1]);

    var w = this.width / (this.data.length - 2);
    p = this.width / 2 - this.fontSize * 2;
    var bboxwidth = 0;
    var ty = 0;
    var tx = 0;
    for (var i = 0; i < this.data.length - 2; i++) {
      var t = svg
        .append("text")
        .attr("x", w * i)
        .attr("y", p)
        .attr("font-size", this.fontSize + "pt")
        .attr("width", w)
        .attr("height", this.fontSize * 2)
        .text(this.data[i + 1])
        .each(function(d) {
          var bbox = this.getBBox();
          bboxwidth = bbox.width;
        });
      if (ty === 0 && w < bboxwidth) {
        ty = this.fontSize * 1.5;
      } else if (w < bboxwidth) {
        ty = 0;
      }
      if (i === this.data.length - 3) {
        tx = this.width - bboxwidth - w * i;
      } else if (w > bboxwidth && w - bboxwidth > 50) {
        tx = bboxwidth / 2;
      } else if (w < bboxwidth && bboxwidth - w > 50) {
        tx = -1 * (bboxwidth / 2);
      }
      t.attr("transform", "translate(" + tx + ", -" + ty + ")");
    }
  }
});
</script>
<style scoped>
svg {
  background: white;
  cursor: normal;
}
polyline {
  fill: #e7ece7;
}
.grid {
  stroke: #d5ded5;
}
</style>
