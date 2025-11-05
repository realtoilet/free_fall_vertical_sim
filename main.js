const canvas = document.getElementById("canvas");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const iniVelocityInput = document.getElementById("iniVelocity");

const timeText = document.getElementById("time");
const velocityText = document.getElementById("velocity");
const peakTimeText = document.getElementById("peakTime");
const bouncesText = document.getElementById("bounces");

let logic = null;

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

function updateStats({ time, velocity, bounces, peakTime }) {
    timeText.textContent = time;
    velocityText.textContent = velocity;
    bouncesText.textContent = bounces;
    peakTimeText.textContent = peakTime;
}

startBtn.addEventListener("click", () => {
    const type = document.getElementById("throw").checked ? "throw" : "drop";
    const iniVelocity = parseFloat(iniVelocityInput.value) || 1;
    const gravity = 1;

    let startY;
    if (type === "throw") {
        startY = canvas.height - 20;
    } else {
        startY = 20; 
    }

    const ball = new Ball(canvas.width / 2, startY, 15, 
        type === "throw" ? -iniVelocity : iniVelocity, gravity, type);

    logic = new FreeFallLogic(ball, canvas, updateStats);
    logic.start();
});

resetBtn.addEventListener("click", () => {
    if (logic) logic.reset();
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateStats({ time: "0.00", velocity: "0.00", bounces: 0, peakTime: "—" });
});
