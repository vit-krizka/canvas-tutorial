/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("tutorial");

if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

    const a = 2 * Math.PI / 6;
    const r = 50;

    function drawHexagon(x, y, color = "rgb(255, 255, 255)") {
        x += offsetX;
        y += offsetY;

        ctx.fillStyle = color;
        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
            ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawGrid(width, height) {
        for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
            for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
                drawHexagon(x, y);
            }
        }
    }

    class Hexagon {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
        }
    }

    let redHexagon = new Hexagon(100, 100, "red");
    let blueHexagon = new Hexagon(300, 300, "blue");

    let offsetX = 0;
    let offsetY = 0;
    let lastX = null;
    let lastY = null;

    let isDragging = false;

    let cameraZoom = 1;
    let MAX_ZOOM = 5;
    let MIN_ZOOM = 0.1;
    const SCROLL_SENSITIVITY = 0.0005;

    const hexagons = [];
    hexagons.push(redHexagon);
    hexagons.push(blueHexagon);

    function drawGame(hexagons) {
        //smazat vše
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //vykreslí pozadí
        drawGrid(canvas.width, canvas.height);

        //vykreslí aktuální hexagony
        for (let i = 0; i < hexagons.length; i++) {
            drawHexagon(hexagons[i].x, hexagons[i].y, hexagons[i].color);
        }
    }

    drawGame(hexagons);

    canvas.addEventListener("mousedown", function (e) {
        let x = e.clientX - canvas.offsetLeft;
        let y = e.clientY - canvas.offsetTop;

        if (e.which === 1 || e.button === 0) {
            console.log('Left mouse button at ' + e.clientX + 'x' + e.clientY);
            hexagons.push(new Hexagon(x - offsetX, y - offsetY, "purple"));
            drawGame(hexagons);
        }

        if (e.which === 2 || e.button === 1) {
            console.log('Middle mouse button at ' + e.clientX + 'x' + e.clientY);
        }

        if (e.which === 3 || e.button === 2) {
            console.log('Right mouse button at ' + e.clientX + 'x' + e.clientY);
        }

        if (e.which === 4 || e.button === 3) {
            console.log('Backward mouse button at ' + e.clientX + 'x' + e.clientY);
        }

        if (e.which === 5 || e.button === 4) {
            console.log('Forward mouse button at ' + e.clientX + 'x' + e.clientY);
        }
    });

    canvas.addEventListener("mouseup", function (e) {
        if (e.which === 1 || e.button === 0) {
            console.log('Left mouse button at ' + e.clientX + 'x' + e.clientY);
        }

        if (e.which === 2 || e.button === 1) {
            console.log('Middle mouse button at ' + e.clientX + 'x' + e.clientY);
        }

        if (e.which === 3 || e.button === 2) {
            console.log('Right mouse button at ' + e.clientX + 'x' + e.clientY);
            lastX = null;
            lastY = null;
        }

        if (e.which === 4 || e.button === 3) {
            console.log('Backward mouse button at ' + e.clientX + 'x' + e.clientY);
        }

        if (e.which === 5 || e.button === 4) {
            console.log('Forward mouse button at ' + e.clientX + 'x' + e.clientY);
        }
    });

    canvas.addEventListener("mousemove", function (e) {
        let x = e.clientX - canvas.offsetLeft;
        let y = e.clientY - canvas.offsetTop;

        if (e.which === 1 || e.button === 0) {
            console.log('Left mouse button at ' + e.clientX + 'x' + e.clientY);
        }

        if (e.which === 2 || e.button === 1) {
            console.log('Middle mouse button at ' + e.clientX + 'x' + e.clientY);
        }

        if (e.which === 3 || e.button === 2) {
            console.log('Right mouse button at ' + e.clientX + 'x' + e.clientY);
            if (lastX === null) {
                lastX = x;
            } else {
                let diffX = x - lastX;
                lastX = x;
                offsetX += diffX;
            }

            if (lastY === null) {
                lastY = y;
            } else {
                let diffY = y - lastY;
                lastY = y;
                offsetY += diffY;
            }

            drawGame(hexagons);
        }

        if (e.which === 4 || e.button === 3) {
            console.log('Backward mouse button at ' + e.clientX + 'x' + e.clientY);
        }

        if (e.which === 5 || e.button === 4) {
            console.log('Forward mouse button at ' + e.clientX + 'x' + e.clientY);
        }
    });

    canvas.addEventListener("contextmenu", function (event) {
        event.preventDefault();
    }
    );

    // let isDragging = false;
    // let currentX;
    // let currentY;
    // let initialX;
    // let initialY;

    // element.addEventListener("mousedown", dragStart);
    // element.addEventListener("mouseup", dragEnd);
    // element.addEventListener("mousemove", drag);

    // function dragStart(e) {
    //     initialX = e.clientX - xOffset;
    //     initialY = e.clientY - yOffset;

    //     isDragging = true;
    // }

    // function dragEnd(e) {
    //     initialX = currentX;
    //     initialY = currentY;

    //     isDragging = false;
    // }

    // function drag(e) {
    //     if (isDragging) {
    //         e.preventDefault();
    //         currentX = e.clientX - initialX;
    //         currentY = e.clientY - initialY;

    //         xOffset = currentX;
    //         yOffset = currentY;

    //         setTranslate(currentX, currentY, element);
    //     }
    // }

    // function setTranslate(xPos, yPos, el) {
    //     el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    // }


} else {
    // canvas-unsupported code here
}