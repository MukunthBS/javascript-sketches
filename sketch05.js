const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const Color = require("canvas-sketch-util/color");
const Tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  // animate: true
};

const params = {
  message: "_-|-_",
  fontScale1: 2,
  fontScale2: 0.5,
  file: "sujit.jpg",
};

let manager, image, gui, oldImg, newImg;

let text = "A";
let fontSize = 1200;
let fontFamily = "Didot";
let word = "design";

const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const sketch = ({ context, width, height }) => {
  const cell = 15;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  let glyphs = params.message.split("");

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = "black";
    typeContext.fillRect(0, 0, cols, rows);

    typeContext.save();
    typeContext.drawImage(image, 0, 0, cols, rows);
    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.textBaseline = "middle";
    context.textAlign = "center";

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const hexC = Color.parse([r, g, b, a]).hex;

      const glyph = getGlyph(r);

      context.font = `${cell * params.fontScale2}px ${fontFamily}`;
      if (Math.random() < 0.1)
        context.font = `${cell * params.fontScale1}px ${fontFamily}`;

      context.fillStyle = hexC;

      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);

      // context.fillRect(0, 0, cell, cell);

      context.fillText(glyph, 0, 0);

      context.restore();
    }

    // context.drawImage(typeCanvas, 0, 0);
  };
};

const getGlyph = (v) => {
  let glyphs = params.message.split("");

  if (v < 50) return "^";
  if (v < 100) return "\\";
  if (v < 150) return "/";
  if (v < 200) return "-";

  return random.pick(glyphs);
};

const onKeyUp = (e) => {
  // text = e.key.toUpperCase();
  // manager.render();
};

// document.addEventListener('keyup', onKeyUp);

const loadMeSomeImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
    img.setAttribute("crossOrigin", "");
  });
};

const rerender = () => {
  manager.render();
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: "Type" });
  // folder.addInput(params, 'message');
  folder.addInput(params, "message").on("change", (ev) => {
    rerender();
  });
  folder
    .addInput(params, "fontScale1", { min: 0.05, max: 5 })
    .on("change", (ev) => {
      rerender();
    });
  folder
    .addInput(params, "fontScale2", { min: 0.05, max: 2 })
    .on("change", (ev) => {
      rerender();
    });

  folder = pane.addFolder({ title: "Image" });
  folder.addInput(params, "file").on("change", (ev) => {
    reload();
  });
};

const start = async () => {
  const url = params.file;
  // canvasSketch().unload();

  image = await loadMeSomeImage(url);
  manager = await canvasSketch(sketch, settings);
  gui = await createPane();
};

const reload = async () => {
  manager = await canvasSketch();
  manager.unload();
  newImg = await start();
};

start();
