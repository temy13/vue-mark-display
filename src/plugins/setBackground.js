import yaml from "yaml-js";
import { colorSet } from "./_otherRendering";

export const setBackground = (e, parent) => {
  var data = yaml.load(e.dataset.content);
  var root = parent.parentElement.parentElement;
  var bg = parent.parentElement;
  // var cls = "inner"
  //
  // e.style.width= "100%"
  // e.style.height = "100%"
  // e.style.position = "absolute"
  // // e.style.zIndex = data.zIndex ? data.zIndex : -1
  // e.innerHTML = `<div style="width: 100%; height: 100%;" class="${cls}" />`;
  //
  // var inner = e.querySelector(`.${cls}`)
  // inner.style.backgroundImage = data.image ? `url(${data.image})` : ""
  // inner.style.backgroundColor = data.color ? colorSet(data.color) : ""
  // inner.style.backgroundSize = data.size ? data.size : ""
  // inner.style.backgroundPosition = data.position ? data.position : "center"
  var opacity = data.opacity ? data.opacity : 0.5;
  bg.style.backgroundColor = `rgba(255, 255, 255, ${1 - opacity})`;

  root.style.backgroundImage = data.image ? `url(${data.image})` : "";
  root.style.backgroundColor = data.color ? colorSet(data.color) : "";
  root.style.backgroundSize = data.size ? data.size : "";
  root.style.backgroundPosition = data.position ? data.position : "center";
};
