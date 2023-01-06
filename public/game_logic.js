gameCanvas = new GameCanvas()
ctx = gameCanvas.ctx

const hexSize = 50;

function drawHexagon(col, row, color = "rgb(255, 255, 255)", text = null) {
    ctx.fillStyle = color;
    ctx.beginPath();
    let pt = flat_hex_to_pixel(oddq_to_axial({col: col, row: row}), hexSize)
    for (var i = 0; i < 6; i++) {
        ctx.lineTo(
            (pt.x + getHexVertexOffset(i).x * hexSize), 
            (pt.y + getHexVertexOffset(i).y * hexSize)
        )
    }
    ctx.closePath();
    ctx.fill();
    if (text) {
        ctx.fillStyle = "black";
        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";
        ctx.font = "1em Arial";
        ctx.fillText(text, pt.x, pt.y);
    }
    ctx.strokeStyle = "black";
    ctx.stroke();
}

function pointToHexGrid(point, round) {
    let qr = pixel_to_flat_hex(point, hexSize)
    if (round) {
        qr = axial_round(qr)
    }
    return axial_to_oddq(qr)
}

class Hexagon {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
}

let mousePos = null

var gameBoard = new Map();

function drawGameBoard() {
    for (let [key, hex] of gameBoard) {
        drawHexagon(hex.x, hex.y, hex.color);
    }
}

//funkci drawGrid je třeba předělat tak, aby kreslila grid od středu a jediný paramter udával množství kružnic
// function drawGrid(width, height) {
//     for (let y = 0; y + hexSize * Math.sin(a) < height; y += hexSize * Math.sin(a)) {
//         for (let x = 0, j = 0; x + hexSize * (1 + Math.cos(a)) < (width + hexSize); x += hexSize * (1 + Math.cos(a)), y += (-1) ** j++ * hexSize * Math.sin(a)) {
//             drawHexagon(x, y);
//         }
//     }
// }

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height)
}

function drawText(text, x, y, size, font) {
    ctx.font = `${size}px ${font}`
    ctx.fillText(text, x, y)
}

function drawGrid(rect) {
    let minHex = pointToHexGrid(rect.min, true);
    let maxHex = pointToHexGrid(rect.max, true);

    if (rect.max.x - rect.min.x > 2500 || rect.max.y - rect.min.y > 2500) {
        drawRect(
            rect.min.x, rect.min.y, 
            rect.max.x - rect.min.x, 
            rect.max.y - rect.min.y, "rgb(220,220,220)"
        )
    } else {
        for (var c = minHex.col - 2; c < maxHex.col + 2; c += 1) {
            for (var r = minHex.row - 2; r < maxHex.row + 2; r += 1) {
                drawHexagon(c, r, "rgb(255,255,255)", c + ", " + r);
            }
        }
    }
}

//draw musí být parametr city
function draw() {
    //veliksot canvasu (celé okno - časem změnit)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // vyčistí canvas a nastaví posun / zoom
    gameCanvas.beginDraw()

    //samotné vykreslovní
    drawGrid(gameCanvas.getVisibleRect());
    drawGameBoard();

    if (mousePos) {
        let currentHexagonCoord = pointToHexGrid(mousePos, false)
        let nearestHexagonCoord = pointToHexGrid(mousePos, true)
        drawHexagon(currentHexagonCoord.col, currentHexagonCoord.row, "rgba(255,255,255,0.0)")
        drawHexagon(nearestHexagonCoord.col, nearestHexagonCoord.row, "rgba(127,127,255,0.3)")
    }

    requestAnimationFrame(draw)
}

function load() {
    fetch('api/load/board').then(function(response) {
        response.json().then(function(data) {
            gameBoard = new Map(Object.entries(data))
        });
    });
}

function save() {
    fetch('/api/save/board', {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(gameBoard))
    })
}

load()
var intervalId = setInterval(function() {
    load()
}, 1000);

gameCanvas.setClickCallback((pos, e) => 
{
    hexPos = pointToHexGrid(pos, true)
    let key = hexPos.row + "," + hexPos.col
    
    if (e.type == "mouseup") {
        if (e.button == 0) {
            const colors = ["purple", "blue", "pink", "yellow", "green", "cyan", "gray"]
            let color = colors[Math.floor(Math.random() * colors.length)]
            gameBoard.set(key, new Hexagon(hexPos.col, hexPos.row, color))
        }
        else if (e.button == 2) {
            gameBoard.delete(key)
        }

        save()
        draw()
    }
    
})

gameCanvas.setMoveCallback((pos, e) => {
    mousePos = pos
})

// Ready, set, go
draw();
