"use-strict";

const RECURSION_DEPTH = 12;

const canvas = document.querySelector("#pt");
const c = canvas.getContext("2d");

let width  = canvas.width  = window.innerWidth;
let height = canvas.height = window.innerHeight;

let max   = 7;
let angle = 0.2 * Math.PI;

const root_color = [ 71, 242, 232];
const leaf_color = [247, 131, 254];

let colors = linspace(root_color, leaf_color, max);

function getAngle(y) {
    return 0.5 * Math.PI * y / height;
}

function linspace(start, stop, num = max) {
    const colors = [];

    num = Math.max(num, 2);

    const r_step = (stop[0] - start[0]) / (num - 1);
    const g_step = (stop[1] - start[1]) / (num - 1);
    const b_step = (stop[2] - start[2]) / (num - 1);

    for (let i = 0; i < num; i++) {
        const r = (start[0] + r_step * i) | 0;
        const g = (start[1] + g_step * i) | 0;
        const b = (start[2] + b_step * i) | 0;

        colors[i] = `rgb(${r}, ${g}, ${b})`;
    }

    return colors;
}

function draw(len, level) {
    if (level < max) {
        c.fillStyle = colors[level];
        c.fillRect(-len / 2, 0, len, len);
        c.save();
        c.translate(0, len);
        c.rotate(angle);
        c.save();
        c.translate(0, Math.sin(angle) * len / 2);
        draw(Math.cos(angle) * len, level + 1);
        c.restore();
        c.rotate(-Math.PI / 2);
        c.save();
        c.translate(0, Math.cos(angle) * len / 2);
        draw(Math.sin(angle) * len, level + 1);
        c.restore();
        c.restore();
    }
}

function tree() {
    c.save();
    c.clearRect(0, 0, width, height);
    c.translate(width / 2, height);
    c.scale(1, -1);
    draw(height / 5, 0);
    c.restore();
}

["touchmove", "touchstart"].forEach(name => {
    canvas.addEventListener(name, (event) => {
        event.preventDefault();
        angle = getAngle(event.changedTouches[0].pageY - canvas.getBoundingClientRect().top);

        tree();
    });
});

canvas.addEventListener("mousemove", (event) => {
    event.preventDefault();
    angle = getAngle(event.clientY - canvas.getBoundingClientRect().top);
    tree();
});

window.addEventListener("keydown", (event) => {
    const c = event.keyCode;

    if (c == 38 || c == 39) {
        max = Math.min(max + 1, RECURSION_DEPTH);
    } else if (c == 37 || c == 40) {
        max = Math.max(max - 1, 1);
    }

    colors = linspace(root_color, leaf_color, max);

    tree();
});

window.addEventListener("resize", () => {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;

    tree();
});

tree();
