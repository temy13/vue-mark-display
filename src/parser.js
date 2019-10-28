import marked from "marked";
import { highlight } from "./highlight";

var specificCodes = [
  "horizontalAxis",
  "icon",
  "circleInCircle",
  "networkGraph",
  "networkSquare",
  "list",
  "render",
  "barGraph",
  "step",
  "background",
  "imageTiles",
  "graphChart"
];

marked.setOptions({
  highlight,
  specificCodes
});

var thema = `

<!-- style: font-weight: bold -->

\`\`\`background
opacity: 0
color: lightBlue.lighten5
zIndex: -1000
\`\`\`

`;

export const parse = code => {
  const tokens = marked.lexer(code);
  const themaToken = marked.lexer(thema);
  const slides = splitTokens(tokens, themaToken);
  return slides;
};

function splitTokens(tokens, themaTokens) {
  const slides = [];
  let current = createSlide(themaTokens);
  tokens.forEach(token => {
    // console.log(token.type)
    if (token.type === "hr") {
      resolveSlide(current);
      slides.push(current);
      current = createSlide(themaTokens);
    } else {
      if (token.type === "html") {
        const kvPair = token.text.match(
          /\<\!\-\-\s*(\S+)\s*\:\s*([\S\s]+?)\s*\-\-\>/
        );
        if (kvPair) {
          current.meta[kvPair[1]] = kvPair[2];
          return;
        } else {
          const flag = token.text.match(/\<\!\-\-\s*(\S+)\s*\-\-\>/);
          if (flag) {
            current.meta[flag[1]] = "";
            return;
          }
        }
      }
      current.tokens.push(token);
    }
  });
  if (current.tokens.length) {
    resolveSlide(current);
    slides.push(current);
  }
  return slides;
}

function resolveSlide(slide) {
  const { meta, tokens } = slide;
  // style
  const {
    background,
    backgroundColor,
    backgroundImage,
    color,
    style,
    stageBackground
  } = meta;
  meta.slideStyle = [
    background ? `background: ${background}` : "",
    backgroundColor ? `background-color: ${backgroundColor}` : "",
    backgroundImage ? `background-image: url(${backgroundImage})` : "",
    color ? `color: ${color}` : "",
    style
  ]
    .filter(Boolean)
    .join("; ");
  meta.bgStyle = stageBackground || "";

  // first token
  const firstToken = findFirstTextToken(tokens);
  if (firstToken.token) {
    // cover
    if (
      !meta.type &&
      firstToken.token.type === "heading" &&
      firstToken.token.depth === 1
    ) {
      meta.type = "cover";
    }

    // title
    if (!meta.title) meta.title = firstToken.text;
  }
  const html = marked.parser(tokens);
  slide.html = html;
}

function createSlide(themaTokens) {
  const slide = { meta: {}, tokens: [], html: "" };
  slide.tokens.links = {};
  themaTokens.forEach(token => {
    slide.tokens.push(token);
  });
  return slide;
}

function findFirstTextToken(tokens) {
  const result = {};
  tokens.some(token => {
    const text = parseText(token.text || "");
    if (text) {
      result.token = token;
      result.text = text;
      return true;
    }
  });
  return result;
}

function parseText(text) {
  return text
    .replace(/<\!\-\-(.|\s)*\-\-\>/g, "")
    .replace(/\!\[([^\]]*)\]\([^\)]*\)/g, "$1")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
