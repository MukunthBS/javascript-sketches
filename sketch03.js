const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const sketch = ({ context, width, height }) => {
  const agents = [];

  for (let i = 0; i < 40; i++) {
    const x = random.range(width * 0.1, width * 0.9);
    const y = random.range(height * 0.1, height * 0.9);

    agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = "#111";

    context.fillRect(0, 0, width, height);
    
    for (let i = 0.8; i < 1.6; i += 0.015) {
      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = 'white';
      context.rect(width * (1-i)/2, height * (1-i)/2, width * i, height * i);
      context.stroke();
    }
    

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        const dist = agent.pos.getDistance(other.pos);

        if (dist > 300) {
          continue;
        }

        context.strokeStyle = rgbToHex(
          100,
          random.rangeFloor(160, 240),
          random.rangeFloor(100, 140)
        );
        context.lineWidth = math.mapRange(dist, 0, 300, 10, 1);
        context.shadowBlur = 10;
        context.shadowColor = "orange";
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
      }
    }

    agents.forEach((agent) => {
      agent.update();
      agent.draw(context);
      agent.bounce(width * 0.1, width * 0.9, height * 0.1, height * 0.9);
      // agent.wrap(width, height);
    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radius = random.range(4, 12);
  }

  bounce(widthMin, widthMax, heightMin, heightMax) {
    if (this.pos.x <= widthMin || this.pos.x >= widthMax) {
      this.vel.x *= -1;
    }
    if (this.pos.y <= heightMin || this.pos.y >= heightMax) {
      this.vel.y *= -1;
    }
  }

  wrap(width, height) {
    if (this.pos.x <= 0) {
      this.pos.x += width;
    }
    if (this.pos.x >= width) {
      this.pos.x -= width;
    }
    if (this.pos.y <= 0) {
      this.pos.y += height;
    }
    if (this.pos.y >= height) {
      this.pos.y -= height;
    }
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save();

    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 4;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore();
  }
}


// User defined animate function to use without canvas-sketch

// const animate = () => {
//   console.log('animation is going on ...');
//   requestAnimationFrame(animate);
// }

// animate();