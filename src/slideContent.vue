<template lang="pug">
.root
  .slide-content(:style="_style" v-html="_html")
</template>
<script>
import { horizontalAxisChart } from "./horizontalAxisChart.js";
import marked from "marked";

export default {
  props: {
    _html: String,
    _style: String,
    _id: String,
    current: Number
  },
  methods: {
    check: function() {
      //todo: all
      var root = this.$el.querySelector(".slide-content");
      var horizontalAxis = this.$el.querySelector(".horizontalAxis");
      if (horizontalAxis) {
        horizontalAxis.innerHTML = "";
        var tokens = marked.lexer(horizontalAxis.dataset.content);
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
        var w =
          horizontalAxis.clientWidth > 0
            ? horizontalAxis.clientWidth
            : root.clientWidth;
        var h =
          horizontalAxis.clientHeight > 0 ? horizontalAxis.clientHeight : 300;
        horizontalAxisChart(w, h, data, this._id);
      }
    }
  },
  watch: {
    _html() {
      this.check();
    },
    current() {
      this.check();
    }
  },
  mounted() {
    this.check();
  }
};
</script>

<style scope>
.root,
.slide-content {
  width: 100%;
}
img {
  max-width: 100%;
}
.root .slide-content {
  /* display: flex; */
  overflow: scroll;
}
</style>
