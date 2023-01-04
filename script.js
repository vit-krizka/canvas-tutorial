const canvas = document.getElementById("tutorial");


if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

    //ctx.fillRect(200, 200, 50, 50);
    //ctx.strokeRect(50, 150, 50, 50);

    //x, y je střed hexu
    function drawHexagon(x, y, color = "rgb(255, 0, 0)") {
        const a = 2 * Math.PI / 6;
        const r = 50;

        ctx.fillStyle = color;

        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
            ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    drawHexagon(200, 200);
    drawHexagon(200, 400, "rgb(255, 255, 0)");
    drawHexagon(200, 600, "blue");
} else {
    // canvas-unsupported code here
}