import { rotateX, rotateY, rotateZ, project } from "./math3d.js";
import { createCube, createTetrahedron, createOctahedron } from "./shapes.js";
import { Star } from "./stars.js";
// import { drawLightning } from "./lightning.js";

const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;

canvas.width = width;
canvas.height = height;

window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const mouse = {
    x: width / 2,
    y: height / 2
};

window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

const camera = {
    x: 0,
    y: 0
};

const stars = [];

for (let i = 0; i < 12; i++) {
    stars.push(new Star(width, height));
}

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

class Shape {

constructor(mesh, position) {

    this.mesh = mesh;

    this.position = {
        x: position.x,
        y: position.y,
        z: position.z
    };

    this.baseY = this.position.y;

    this.rotation = {
        x: Math.random() * Math.PI,
        y: Math.random() * Math.PI,
        z: Math.random() * Math.PI
    };

    this.speed = {
        x: rand(-0.002, 0.002),
        y: rand(-0.002, 0.002),
        z: rand(-0.002, 0.002)
    };

    this.floatSeed = Math.random() * 100;
    this.floatAmount = rand(3, 8);
}

    update(time) {

        this.rotation.x += this.speed.x;
        this.rotation.y += this.speed.y;
        this.rotation.z += this.speed.z;

        // Tiny floating motion only
        this.position.y =
            this.baseY +
            Math.sin(time * 0.0005 + this.floatSeed) *
            this.floatAmount;
    }

    draw() {

        const projected = [];

        for (const vertex of this.mesh.vertices) {

            let p = vertex;

            p = rotateX(p, this.rotation.x);
            p = rotateY(p, this.rotation.y);
            p = rotateZ(p, this.rotation.z);

            const depth = 1 - (this.position.z / 700);

            p.x += this.position.x - camera.x * depth;
            p.y += this.position.y - camera.y * depth;
            p.z += this.position.z;

            projected.push(project(p, width, height));
        }

        ctx.shadowBlur = 12;
        ctx.shadowColor = "white";

        // Glow pass
        ctx.strokeStyle = "rgba(255,255,255,.08)";
        ctx.lineWidth = 4;

        ctx.beginPath();

        for (const edge of this.mesh.edges) {

            const a = projected[edge[0]];
            const b = projected[edge[1]];

            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
        }

        ctx.stroke();

        // Sharp pass
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,.75)";
        ctx.lineWidth = 1;

        ctx.beginPath();

        for (const edge of this.mesh.edges) {

            const a = projected[edge[0]];
            const b = projected[edge[1]];

            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
        }

        ctx.stroke();

        // Vertices
        for (const point of projected) {

            ctx.beginPath();
            ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        }

        return projected;
    }

}

const scene = [

    // Top left
    new Shape(createCube(45), {
        x: -750,
        y: -330,
        z: 220
    }),

    // Top right
    new Shape(createCube(35), {
        x: 750,
        y: -280,
        z: 320
    }),

    // Bottom left
    new Shape(createTetrahedron(45), {
        x: -720,
        y: 300,
        z: 180
    }),

    // Bottom right
    new Shape(createTetrahedron(35), {
        x: 720,
        y: 260,
        z: 380
    }),

    // Right side middle
    new Shape(createOctahedron(40), {
        x: 880,
        y: 0,
        z: 250
    })

];

let last = performance.now();
let frameCount = 0;

function animate(now) {

    requestAnimationFrame(animate);

    frameCount += 1;
    if (frameCount % 2 !== 0) {
        return;
    }

    const dt = now - last;
    last = now;

    ctx.clearRect(0, 0, width, height);

    // camera sway

    const targetX = (mouse.x - width / 2) * 0.04;
    const targetY = (mouse.y - height / 2) * 0.04;

    camera.x += (targetX - camera.x) * 0.04;
    camera.y += (targetY - camera.y) * 0.04;

    // stars

    for (const star of stars) {

        star.update(now);
        star.draw(ctx);

    }

    // shapes

    window.__vertices = [];

    for (const shape of scene) {

        shape.update(now);

        const verts = shape.draw();

        window.__vertices.push(...verts);

    }

//        drawLightning(ctx,mouse,window.__vertices,now);
}

animate(performance.now());