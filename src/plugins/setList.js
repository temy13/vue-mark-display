import yaml from "yaml-js";
import { colorSet } from "./_otherRendering";

var defaultStyle = {
  "list-style-type": "none",
  "text-align": "left"
};

export const setList = (e, parent) => {
  console.log("set+ist");
  var data = yaml.load(e.dataset.content);
  var items = data.items;
  var _style = data.style ? data.style : {};
  var style = Object.assign(defaultStyle, _style);
  e.classList.add("width100");
  e.innerHTML = setItems(items, style);
};

function setItems(items, style) {
  var html = "";
  for (var item of items) {
    var _style = JSON.parse(JSON.stringify(style));
    if (item.style) {
      _style = Object.assign(_style, item.style);
    }
    var s = Object.keys(_style)
      .map(function(key) {
        return `${key}: ${_style[key]}`;
      })
      .join("; ");
    if (!item.children) {
      html += `<li style='${s}'>${item.text}</li>`;
      continue;
    }
    if (item.childStyle) {
      _style = Object.assign(_style, item.childStyle);
    }
    html += `<li style='${s}'><div>${item.text}</div>${setItems(
      item.children,
      _style
    )}</li>`;
  }
  return "<ul>" + html + "</ul>";
}
