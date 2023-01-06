const size = 50; //poloměr hexu v pixelech

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Hex {
    constructor(q, r, color = "black") {
        this.q = q;
        this.r = r;
        this.s = -q - r;

        this.color = color;
        this.size = size;

        this.x = hexToPixel({ q, r }).x;
        this.y = hexToPixel({ q, r }).y;
        this.center = new Point(this.x, this.y);

        this.corners = hexCorners({ x: this.x, y: this.y }, size);

        this.distance = Math.max(Math.abs(q), Math.abs(r), Math.abs(this.s));
    }
}

const height = Math.sqrt(3) * size; //výška hexu
const width = 2 * size; //šířka hexu

const verticalSpacing = height; //vertikální vzdálenost mezi středy hexů
const horizontalSpacing = 3 / 4 * width; //horizontální vzdálenost mezi středy hexů

function hexCorner(center, size, i) {
    let angle_deg = 60 * i;
    let angle_rad = Math.PI / 180 * angle_deg;

    return new Point(center.x + size * Math.cos(angle_rad), center.y + size * Math.sin(angle_rad));
}
//vezme střed (v pixelech, např. {0,0}), velikost (size) a pořadí vrcholu (0 až 5) a vrátí souřadnice daného vrcholu
//pomocná funkce pro hexCorners()

function hexCorners(center, size) {
    let output = [];

    for (let i = 0; i < 6; i++) {
        output.push(hexCorner(center, size, i));
    }

    return output;
}
//vrací array se všemi souřadnicemi vrcholů hexu (hexu se středem v center a velikostí size)

//TESTOVÁNÍ
//console.log(hexCorners({ x: 0, y: 0 }, 50));
//zde je problém se zaokrouhlováním sinu a cosinu - nevím, jak to zatím vyřešit

function hexToPixel(hex) {
    let x = size * (3 / 2 * hex.q);
    let y = size * ((Math.sqrt(3) / 2 * hex.q) + (Math.sqrt(3) * hex.r));

    return new Point(x, y);
}
//vezme hex, např. {q: 0, r: 0} a vrátí jeho souřanice jako {x: 0, y: 0}

function pixelToHex(point) {
    var q = (2. / 3 * point.x) / size;
    var r = (-1 / 3 * point.x + Math.sqrt(3) / 3 * point.y) / size;

    return axialRound({ q: q, r: r });
}
//vezme souřadnice středu, např. {x: 0, y: 0} a vrátí souřadnice (polohu) daného hexu, tj. objekt {q: 0, r: 0}, nikoli Hex
//funguje i pokud nezadáme souřadnice středu, ale jakéhokoli bodu (x, y), pak využije zaokrouhlení na nejbližší hex (axialRound)

function cubeToAxial(cube) {
    let q = cube.q;
    let r = cube.r;
    return { q: q, r: r };
}
//pomocná funkce pro axialRound

function axialToCube(hex) {
    let q = hex.q;
    let r = hex.r;
    let s = -q - r;
    return { q: q, r: r, s: s }
}
//pomocná funkce pro axialRound

function cubeRound(frac) {
    let q = Math.round(frac.q);
    let r = Math.round(frac.r);
    let s = Math.round(frac.s);

    let q_diff = Math.abs(q - frac.q);
    let r_diff = Math.abs(r - frac.r);
    let s_diff = Math.abs(s - frac.s);

    if ((q_diff > r_diff) && (q_diff > s_diff)) {
        q = -r - s;
    } else if (r_diff > s_diff) {
        r = -q - s;
    } else {
        s = -q - r;
    }

    return { q: q, r: r, s: s };
}
//pomocná funkce pro axialRound

function axialRound(hex) {
    return cubeToAxial(cubeRound(axialToCube(hex)))
}
//zaokrouhlování na nejbližší hex



//KRESLENÍ

/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

function drawHex(hex, offset) {
    ctx.fillStyle = hex.color;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        ctx.lineTo(hex.corners[i].x + offset, hex.corners[i].y + offset);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawHexes(hexes, offset) {
    for (let i = 0; i < hexes.length; i++) {
        drawHex(hexes[i], offset);
    }
}

function drawGrid(level, offset) {
    for (let q = -level; q < level; q++) {
        for (let r = -level; r < level; r++) {
            let hex = new Hex(q, r, "white");

            if (hex.distance < level) {
                drawHex(hex, offset);
            }
        }
    }
}

// TESTOVÁNÍ
let hexes = [
    new Hex(0, 3, "pink"),
    new Hex(1, 0, "blue"),
    new Hex(2, 0, "green"),
    new Hex(-3, -1, "yellow"),
    new Hex(-3, -1, "yellow")
];

drawGrid(5, 500);
drawHexes(hexes, 500);