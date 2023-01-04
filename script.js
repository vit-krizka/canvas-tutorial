const canvas = document.getElementById("tutorial");

if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(50, 50, 50, 50);
    ctx.strokeRect(50, 150, 50, 50);
} else {
    // canvas-unsupported code here
}