export function rotateX(point, angle){
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
        x: point.x,
        y: point.y * cos - point.z * sin,
        z: point.y * sin + point.z * cos
    };
}

export function rotateY(point, angle){
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
        x: point.x * cos + point.z * sin,
        y: point.y,
        z: -point.x * sin + point.z * cos
    };
}

export function rotateZ(point, angle){
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
        x: point.x * cos - point.y * sin,
        y: point.x * sin + point.y * cos,
        z: point.z
    };
}

export function project(point, width, height){

    const distance = 800;

    const scale =
        distance /
        (distance + point.z);

    return {
        x: point.x * scale + width / 2,
        y: point.y * scale + height / 2,
        scale
    };
}