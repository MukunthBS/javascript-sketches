const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [2048, 2048],
  // animate: true
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "#111";
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * 0.003;

    const w = width * 0.1;
    const h = height * 0.1;
    const gap = width * 0.03;
    const ix = width * 0.17;
    const iy = height * 0.17;

    // Initial constant offset
    // const off = width * 0.003;

    let x, y, off;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        x = ix + (w + gap) * i;
        y = iy + (h + gap) * j;

        context.beginPath();
        context.strokeStyle = "white";
        context.rect(x, y, w, h);
        context.stroke();

        if (Math.random() > 0.5) {
          off = (width * Math.random()) / 10;
          context.beginPath();
          context.strokeStyle = "#42f5a4";
          context.rect(x + off / 2, y + off / 2, w - off, h - off);
          context.stroke();
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
