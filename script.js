/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("tutorial");

if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

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
} else {
    // canvas-unsupported code here
}