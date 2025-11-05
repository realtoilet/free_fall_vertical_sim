class FreeFallLogic {
    constructor(ball, canvas, updateStatsCallback) {
        this.ball = ball;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.updateStats = updateStatsCallback;

        this.g = ball.gravity;
        this.time = 0;
        this.bounces = 0;
        this.running = false;

        this.highestPeakY = ball.y;   // record highest Y reached
        this.peakTime = null;

        this.lastVelocity = ball.velocity;
        this.resting = false;
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.lastFrameTime = performance.now();
        requestAnimationFrame(this.loop.bind(this));
    }

    reset() {
        this.running = false;
        this.time = 0;
        this.bounces = 0;
        this.highestPeakY = this.ball.y;
        this.peakTime = null;
        this.resting = false;
    }

    loop(timestamp) {
        if (!this.running) return;

        let delta = (timestamp - this.lastFrameTime) / 1000;
        this.lastFrameTime = timestamp;

        // Cap delta to prevent physics explosion when tab is unfocused
        if (delta > 0.05) delta = 0.05;

        this.time += delta;

        if (!this.resting) {
            // Apply gravity
            this.ball.velocity += this.g * delta;
            this.ball.y += this.ball.velocity;
        }

        // --- Collision with bottom ---
        if (this.ball.y + this.ball.radius >= this.canvas.height) {
            this.ball.y = this.canvas.height - this.ball.radius;

            // Only bounce if the impact is significant
            if (Math.abs(this.ball.velocity) > 0.5) {
                this.ball.velocity *= -0.8; // bounce with energy loss
                this.bounces++;
            } else {
                this.ball.velocity = 0;
                this.resting = true;
            }
        }

        // --- Collision with top ---
        if (this.ball.y - this.ball.radius <= 0) {
            this.ball.y = this.ball.radius;
            this.ball.velocity *= -0.8;
            this.bounces++;
        }

        // --- Peak detection ---
        if (this.lastVelocity < 0 && this.ball.velocity >= 0) {
            // Velocity just changed direction — peak moment
            if (this.ball.y < this.highestPeakY) {
                this.highestPeakY = this.ball.y;
                this.peakTime = this.time.toFixed(2) + " s";
            }
        }

        this.lastVelocity = this.ball.velocity;

        // --- Draw ---
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ball.draw(this.ctx);

        // --- Update stats ---
        this.updateStats({
            time: this.time.toFixed(2),
            velocity: this.ball.velocity.toFixed(2),
            bounces: this.bounces,
            peakTime: this.peakTime || "—"
        });

        requestAnimationFrame(this.loop.bind(this));
    }
}
