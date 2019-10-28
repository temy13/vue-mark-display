import Vue from "vue";
import * as d3 from "d3";

var k = "barGraph";

export const barGraphChart = (params, svg, data, _id, current) => {
  var dataset = data.items.map(function(item) {
    return { text: item.text, name: item.text, value: item.value };
  });

  var info = data.info ? data.info : {};
  if (!info.ymax) {
    info.ymax = d3.max(dataset, function(d) {
      return d.value;
    });
  }
  if (!info.yunit) {
    info.yunit = "";
  }

  // 3. 軸スケールの設定
  var xScale = d3
    .scaleBand()
    .rangeRound([params.padding, params.width - params.padding])
    .padding(0.1)
    .domain(
      dataset.map(function(d) {
        return d.name;
      })
    );

  var yScale = d3
    .scaleLinear()
    .domain([0, info.ymax])
    .range([params.height - params.padding, params.padding]);

  // 4. 軸の表示
  svg
    .append("g")
    .attr(
      "transform",
      "translate(" + 0 + "," + (params.height - params.padding) + ")"
    )
    .style("font", "20px time")
    .call(d3.axisBottom(xScale));

  svg
    .append("g")
    .attr("transform", "translate(" + params.padding + "," + 0 + ")")
    .call(
      d3.axisLeft(yScale).tickFormat((d, i) => {
        if (i === 0) return `${d} (${info.yunit})`;
        return d;
      })
    );

  // 5. バーの表示
  svg
    .append("g")
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d) {
      return xScale(d.name);
    })
    .attr("y", function(d) {
      return yScale(d.value);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) {
      return params.height - params.padding - yScale(d.value);
    })
    .attr("fill", "steelblue");

  return svg;
};
