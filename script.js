const canvas = document.getElementById('glitchCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const noise = new SimplexNoise();

const numLines = 5000;
const stepSize = 1;
const maxSteps = 50;

class FlowLine {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.steps = 0;
  }

  update() {
    const angle = noise.noise2D(this.x * 0.005, this.y * 0.005) * Math.PI * 4;
    const dx = Math.cos(angle) * stepSize;
    const dy = Math.sin(angle) * stepSize;

    this.x += dx;
    this.y += dy;

    this.steps++;
  }

  draw() {
    ctx.strokeStyle = `rgba(0, 0, 0, ${Math.min(1, this.steps / maxSteps)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + 1, this.y + 1);
    ctx.stroke();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.steps = 0;
  }
}

const lines = Array.from({ length: numLines }, () => {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  return new FlowLine(x, y);
});

function animate() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  lines.forEach((line) => {
    line.update();
    line.draw();

    if (line.steps > maxSteps) {
      line.reset();
    }
  });

  requestAnimationFrame(animate);
}

animate();
