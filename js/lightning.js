let nextZap = 0;
let zap = null;

function nearestVertex(mouse, vertices) {

    let nearest = null;
    let dist = Infinity;

    for (const v of vertices) {

        const d = Math.hypot(mouse.x - v.x, mouse.y - v.y);

        if (d < dist) {
            dist = d;
            nearest = v;
        }

    }

    return {
        vertex: nearest,
        distance: dist
    };

}

function makeZap(vertex, mouse) {

    const dx = mouse.x - vertex.x;
    const dy = mouse.y - vertex.y;

    const distance = Math.hypot(dx, dy);

    const angle = Math.atan2(dy, dx);

    // Reach almost to the mouse
    const length = Math.max(20, distance - 6);

    const points = [{
        x: vertex.x,
        y: vertex.y
    }];

    const segments = Math.max(6, Math.floor(length / 18));

    for (let i = 1; i <= segments; i++) {

        const t = i / segments;

        points.push({

            x:
                vertex.x +
                Math.cos(angle) * length * t +
                (Math.random() - 0.5) * 6,

            y:
                vertex.y +
                Math.sin(angle) * length * t +
                (Math.random() - 0.5) * 6

        });

    }

    return {
        points,
        created: performance.now()
    };

}

export function drawLightning(ctx, mouse, vertices) {

    const now = performance.now();

    const result = nearestVertex(mouse, vertices);

    if (!result.vertex)
        return;

    // Too far away
    if (result.distance > 100) {

        zap = null;
        return;

    }

    // Create a new zap every 1.5-2.5 seconds
    if (now > nextZap && !zap) {

        zap = makeZap(result.vertex, mouse);

        nextZap =
            now +
            1000 +
            Math.random() * 250;

    }

    if (!zap)
        return;

    // Only show for 100ms
    if (now - zap.created > 100) {

        zap = null;
        return;

    }

    // Pulse the vertex
    ctx.beginPath();
    ctx.arc(result.vertex.x, result.vertex.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,.35)";
    ctx.fill();

    // Glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = "white";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1.5;

    ctx.beginPath();

    ctx.moveTo(
        zap.points[0].x,
        zap.points[0].y
    );

    for (const p of zap.points)
        ctx.lineTo(p.x, p.y);

    ctx.stroke();

    ctx.shadowBlur = 0;

}