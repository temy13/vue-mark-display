<template lang="pug">
.root
  .slide-content(:style="_style" v-html="_html")
</template>
<script>
import { horizontalAxisChart } from "./horizontalAxisChart.js";

export default {
  props: {
    _html: String,
    _style: String
  },
  methods: {
    check: function() {
      //todo: all
      var e = this.$el.querySelector(".horizontalAxis");
      if (e) {
        console.log(e);
        horizontalAxisChart(400, 300, ["a", "b", "c", "d"]);
      }
      // e.innerHTML = "<div> aaaaa </div>"
    }
  },
  watch: {
    _html() {
      this.check();
    }
  },
  mounted() {
    this.check();
  }
};
</script>
