const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1000, 1000],
  animate: true
};

// User defined function to convert degrees to radians

// const degToRad = (degrees) => {
//   return (degrees / 180) * Math.PI;
// };

// User defined function for Math.random() with min and max values as range

// const randomRange = (min, max) => {
//   return Math.random() * (max - min) + min;
// }

// User defined animate function to use without canvas-sketch





const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "#222";
    context.fillRect(0, 0, width, height);

    context.fillStyle = "black";

    const cx = width * 0.5;
    const cy = height * 0.5;
    const w = width * 0.01;
    const h = height * 0.1;

    let x, y;

    const num = 100;
    const radius = width * 0.1;

    for (let i = 0; i < num; i++) {
      // Using user defined function
      // const slice = math.degToRad(360 / num);

      // Using canvas-sketch-util method
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = radius * Math.sin(angle);
      y = radius * Math.cos(angle);

      context.save();

      // x and y values if translate is not done using cx and cy:
      // x = cx + radius * Math.sin(angle);
      // y = cy - radius * Math.cos(angle);

      // Comment below line if translate is not done using cx and cy:
      context.translate(cx, cy);
      //context.translate(0, height);

      context.translate(x, y);
      context.rotate(-angle);

      // Using user defined function
      // context.scale(randomRange(1, 3), 1);

      // Using canvas-sketch-util method
      context.scale(random.range(0.1, 1), random.range(0.2, 0.5));

      // Rotation angle if translate is not done using cx and cy:
      // context.rotate(angle);

      context.beginPath();
      context.fillStyle = "white";
      context.shadowBlur = 50;
      context.shadowColor = "white";
      context.rect(-w * 0.5, random.range(h, h*8), random.range(1,3), random.range(h, h*2));
      context.fill();

      context.restore();

      context.save();

      context.translate(cx, cy);
      // context.translate(0, height);
      context.rotate(-angle);

      context.lineWidth = random.range(2, 4);

      context.beginPath();
      context.strokeStyle = "blue";
      context.shadowBlur = 50;
      context.shadowColor = "blue";
      context.arc(
        20,
        10,
        radius * random.range(0.75, 1.5),
        slice * random.range(1, 5),
        slice * random.range(1, 8)
      );
      context.stroke();
      

      context.restore();

    }

    // Circle with a different translation point from the first translation

    // context.translate(100, 400);

    // context.beginPath();
    // context.arc(0, 0, 50, 0, Math.PI * 2);
    // context.fill();
  };
  
};

canvasSketch(sketch, settings);
