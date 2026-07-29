export class Star{

    constructor(width,height){

        this.x=Math.random()*width;
        this.y=Math.random()*height;

        this.phase=Math.random()*10;
    }

    update() {

        this.phase += 0.01;

        this.x += Math.sin(this.phase) * 0.05;
        this.y += Math.cos(this.phase * 0.8) * 0.05;
    
}

    draw(ctx){

        const alpha =
            0.5 +
            Math.sin(this.phase)*0.5;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            2,
            0,
            Math.PI*2
        );

        ctx.fillStyle =
            `rgba(255,255,255,${alpha})`;

        ctx.fill();
    }
}