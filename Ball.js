class Ball {
    constructor(x, y, radius, velocity, gravity, type) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity; 
        this.gravity = gravity;  
        this.type = type;         
        this.color = "#ff9a9e";   
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}
