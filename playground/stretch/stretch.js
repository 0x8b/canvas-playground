const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const lines = [];

for (let x = -3; x <= 3; x++) {
  lines.push([x, -3, x, 3]);
  lines.push([-3, x, 3, x]);
}

const delta_alpha = Math.PI / 30;

for (let a = 0; a < 2 * Math.PI; a += delta_alpha) {
  lines.push([
    Math.cos(a),
    Math.sin(a),
    Math.cos(a + delta_alpha),
    Math.sin(a + delta_alpha)
  ]);
}

window.addEventListener('resize', resizeCanvas, false);

window.addEventListener('mousemove', (event) => {
  const x = event.clientX - canvas.width / 2;
  const y = -event.clientY + canvas.height / 2;

  drawStuff(x, y);
}, false);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  drawStuff(1, 1);
}

resizeCanvas();

function drawStuff(x, y) {
  const width = canvas.width;
  const height = canvas.height;
  const scale = 60;

  c.save();
  c.fillStyle = "#005147";
  c.fillRect(0, 0, width, height);
  c.translate(width / 2, height / 2);
  c.scale(1, -1);

  c.beginPath();
  c.arc(0, 0, scale, 0, 2 * Math.PI);
  c.closePath();
  c.lineWidth = 10;
  c.strokeStyle = "#ea553b";
  c.stroke();

  const scalar = Math.hypot(x, y) / scale;
  const alpha = Math.atan2(y, x);

  const A = scalar;
  const B = Math.cos(alpha);
  const C = Math.sin(alpha);
  const tmp = (A - 1) * B * C;

  c.lineWidth = 2;
  c.strokeStyle = "white";

  lines.forEach(([fx, fy, tx, ty]) => {
    const sfx = scale * (fx * (A * B * B + C * C) + fy * tmp);
    const sfy = scale * (fx * tmp + fy * (A * C * C + B * B));
    const stx = scale * (tx * (A * B * B + C * C) + ty * tmp);
    const sty = scale * (tx * tmp + ty * (A * C * C + B * B));

    c.beginPath();
    c.moveTo(sfx, sfy);
    c.lineTo(stx, sty);
    c.closePath();
    c.stroke();
  });

  drawArrow(0, 0, x, y);
  c.restore();
}

function drawArrow(from_x, from_y, to_x, to_y, color = "white") {
  c.lineWidth = 1;
  c.strokeStyle = color;

  c.beginPath();
  c.moveTo(from_x, from_y);
  c.lineTo(to_x, to_y);
  c.closePath();
  c.stroke();

  const angle = Math.atan2(to_x - from_x, to_y - from_y);
  const half = Math.PI;
  const delta = Math.PI / 10;

  c.beginPath();
  c.moveTo(to_x, to_y);
  c.lineTo(Math.sin(angle + half + delta) * 20 + to_x, Math.cos(angle + half + delta) * 20 + to_y);
  c.closePath();
  c.stroke();

  c.beginPath();
  c.moveTo(to_x, to_y);
  c.lineTo(Math.sin(angle + half - delta) * 20 + to_x, Math.cos(angle + half - delta) * 20 + to_y);
  c.closePath();
  c.stroke();
}