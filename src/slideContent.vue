<template lang="pug">
.root(:id="_id + '-content'")
  .white-bg
    .slide-content(:style="_style" v-html="_html")
</template>
<script>
import { horizontalAxisChart } from "./plugins/horizontalAxisChart.js";
import { circleInCircleChart } from "./plugins/circleInCircleChart.js";
import { graphChart } from "./plugins/graphChart.js";
import { networkChart } from "./plugins/networkChart.js";
import { networkSquare } from "./plugins/networkSquare.js";
import { renderChart } from "./plugins/renderChart.js";
import { barGraphChart } from "./plugins/barGraphChart.js";
import { stepChart } from "./plugins/stepChart.js";
import { setBackground } from "./plugins/setBackground.js";
import { setList } from "./plugins/setList.js";
import { imageTilesChart } from "./plugins/imageTilesChart.js";
import { setParams, otherRendering } from "./plugins/_otherRendering.js";

import marked from "marked";
import yaml from "yaml-js";
import * as d3 from "d3";
import CodePrettify from "code-prettify";
import "code-prettify/src/prettify.css";

var _d3 = {
  networkGraph: networkChart,
  networkSquare: networkSquare,
  circleInCircle: circleInCircleChart,
  render: renderChart,
  barGraph: barGraphChart,
  step: stepChart,
  imageTiles: imageTilesChart,
  graphChart: graphChart
};

export default {
  props: {
    _html: String,
    _style: String,
    _id: String,
    current: Number
  },
  methods: {
    check: function(parent) {
      var a = {
        horizontalAxis: this.setHorizontalAxis,
        icon: this.showIcon,
        list: setList,
        background: setBackground
      };
      //generation
      var c = this.current - 1;
      var k = `-${c}`;
      if (!this._id.endsWith(k)) {
        return;
      }
      var root = parent.querySelector(".slide-content");
      for (var cls in a) {
        var elements = this.$el.querySelectorAll("." + cls);
        if (!elements) {
          continue;
        }
        for (var e of elements) {
          a[cls](e, root);
        }
      }
      for (var cls in _d3) {
        var elements = this.$el.querySelectorAll("." + cls);
        if (!elements) {
          continue;
        }
        for (var e of elements) {
          this.renderD3(cls, e, root, _d3[cls]);
        }
      }
      CodePrettify.prettyPrint();
    },
    setHorizontalAxis: function(e, root) {
      e.innerHTML = "";
      data = this._getListItems(e.dataset.content);
      var w = e.clientWidth > 0 ? e.clientWidth : root.clientWidth;
      var h = e.clientHeight > 0 ? e.clientHeight : 300;
      horizontalAxisChart(w, h, data, this._id);
    },
    showIcon: function(e, root) {
      var data = yaml.load(e.dataset.content);
      e.innerHTML = `<i class='notranslate mdi mdi-${data.icon} theme--light'></i>`;
    },
    renderD3: function(cls, e, root, func) {
      e.innerHTML = "";
      var data = yaml.load(e.dataset.content);
      var params = setParams(e, root, data.info);
      params._id = this._id;
      params.current = this.current;
      params.element = e;
      var svg = d3
        .select("#" + this._id)
        .select("." + cls)
        .append("svg")
        .attr("width", params.width)
        .attr("height", params.height)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr(":xmlns:xlink", "http://www.w3.org/1999/xlink")
        .attr("viewBox", "0 0 " + params.width + " " + params.height);
      func(params, svg, data, this._id, this.current);
      otherRendering(data.others, svg, params);
      console.log(svg);
    },
    _getListItems: function(text) {
      var tokens = marked.lexer(text);
      var data = [];
      var isInsert = false;
      for (var token of tokens) {
        switch (token.type) {
          case "list_item_start":
            isInsert = true;
            break;
          case "text":
            if (isInsert) {
              data.push(token.text);
            }
            break;
          case "list_item_end":
            isInsert = false;
            break;
          default:
            break;
        }
      }
      return data;
    }
    // _setID: function(){
    //   return Math.random()
    //     .toString(36)
    //     .replace(/[^a-z]+/g, "")
    //     .substr(0, 8)
    // }
    // setDefault: function(e){
    //   var tokens = marked.lexer(e.dataset.content);
    //   var html = marked.parser(tokens);
    //   e.innerHTML = html
    // },
  },
  watch: {
    _html() {
      this.check(this.$el);
    },
    current() {
      this.check(this.$el);
    }
  },
  mounted() {
    this.check(this.$el);
  }
};
</script>

<style scope>
.root {
}
.root,
.slide-content {
  width: 100%;
  position: absolute;
}
img {
  max-width: 100%;
}
.root .slide-content {
  /* display: flex; */
  overflow: scroll;
  padding: 5vh;
}
.white-bg {
  background: rgba(255, 255, 255, 0.5);
  min-width: 100%;
  min-height: 100%;
}

.width100 {
  width: 100%;
}
.prettyprint {
  text-align: left;
}
</style>
