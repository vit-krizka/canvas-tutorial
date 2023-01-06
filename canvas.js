/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas")

if (canvas.getContext) {

    let ctx = canvas.getContext('2d')

    let cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let cameraZoom = 1
    const MAX_ZOOM = 5
    const MIN_ZOOM = 0.1
    const SCROLL_SENSITIVITY = 0.0005

    let offsetX = 0;
    let offsetY = 0;
    let lastX = null;
    let lastY = null;

    const a = 2 * Math.PI / 6;
    const r = 50;

    class Hexagon {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
        }
    }

    let redHexagon = new Hexagon(0, 0, "red");
    let blueHexagon = new Hexagon(r + 25, r * Math.sin(a), "blue");
    let greenHexagon = new Hexagon(3 * r, 2 * r * Math.sin(a), "green");

    const city = [];
    city.push(redHexagon);
    city.push(blueHexagon);
    city.push(greenHexagon);

    //drawHexagon se musí předělat tak, aby kreslila hexagony podle souřadnic gridu (střed je 0,0)
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

    function drawCity(city) {
        for (let i = 0; i < city.length; i++) {
            drawHexagon(city[i].x, city[i].y, city[i].color);
        }
    }

    //funkci drawGrid je třeba předělat tak, aby kreslila grid od středu a jediný paramter udával množství kružnic
    function drawGrid(width, height) {
        for (let y = 0; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
            for (let x = 0, j = 0; x + r * (1 + Math.cos(a)) < (width + r); x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
                drawHexagon(x, y);
            }
        }
    }

    //draw musí být parametr city
    function draw() {
        //veliksot canvasu (celé okno - časem změnit)
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
        ctx.translate(window.innerWidth / 2, window.innerHeight / 2)
        ctx.scale(cameraZoom, cameraZoom)
        ctx.translate(-window.innerWidth / 2 + cameraOffset.x, -window.innerHeight / 2 + cameraOffset.y)
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight) //vše smaže

        //samotné vykreslovní
        drawGrid(1000, 1000);
        drawCity(city);

        requestAnimationFrame(draw)
    }

    // Gets the relevant location from a mouse or single touch event
    function getEventLocation(e) {
        if (e.touches && e.touches.length == 1) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY }
        }
        else if (e.clientX && e.clientY) {
            return { x: e.clientX, y: e.clientY }
        }
    }

    function drawRect(x, y, width, height) {
        ctx.fillRect(x, y, width, height)
    }

    function drawText(text, x, y, size, font) {
        ctx.font = `${size}px ${font}`
        ctx.fillText(text, x, y)
    }

    let isDragging = false
    let dragStart = { x: 0, y: 0 }

    function onPointerDown(e) {
        isDragging = true
        dragStart.x = getEventLocation(e).x / cameraZoom - cameraOffset.x
        dragStart.y = getEventLocation(e).y / cameraZoom - cameraOffset.y
    }

    function onPointerUp(e) {
        isDragging = false
        initialPinchDistance = null
        lastZoom = cameraZoom
    }

    function onPointerMove(e) {
        if (isDragging) {
            cameraOffset.x = getEventLocation(e).x / cameraZoom - dragStart.x
            cameraOffset.y = getEventLocation(e).y / cameraZoom - dragStart.y
        }
    }

    function handleTouch(e, singleTouchHandler) {
        if (e.touches.length == 1) {
            singleTouchHandler(e)
        }
        else if (e.type == "touchmove" && e.touches.length == 2) {
            isDragging = false
            handlePinch(e)
        }
    }

    let initialPinchDistance = null
    let lastZoom = cameraZoom

    function handlePinch(e) {
        e.preventDefault()

        let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }

        // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
        let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2

        if (initialPinchDistance == null) {
            initialPinchDistance = currentDistance
        }
        else {
            adjustZoom(null, currentDistance / initialPinchDistance)
        }
    }

    function adjustZoom(zoomAmount, zoomFactor) {
        if (!isDragging) {
            if (zoomAmount) {
                cameraZoom += zoomAmount
            }
            else if (zoomFactor) {
                console.log(zoomFactor)
                cameraZoom = zoomFactor * lastZoom
            }

            cameraZoom = Math.min(cameraZoom, MAX_ZOOM)
            cameraZoom = Math.max(cameraZoom, MIN_ZOOM)

            console.log(zoomAmount)
        }
    }

    canvas.addEventListener('mousedown', onPointerDown)
    canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))
    canvas.addEventListener('mouseup', onPointerUp)
    canvas.addEventListener('touchend', (e) => handleTouch(e, onPointerUp))
    canvas.addEventListener('mousemove', onPointerMove)
    canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))
    canvas.addEventListener('wheel', (e) => adjustZoom(e.deltaY * SCROLL_SENSITIVITY))
    canvas.addEventListener("contextmenu", (e) => {
        e.preventDefault();

        let x = e.clientX;
        let y = e.clientY;

        city.push(new Hexagon(x, y, "purple"));
    })

    // Ready, set, go
    draw();

} else {
    // canvas-unsupported code here
}