const size = 10; //poloměr hexu v pixelech

const height = Math.sqrt(3) * size; //výška hexu
const width = 2 * size; //šířka hexu

const verticalSpacing = height; //vertikální vzdálenost mezi středy hexů
const horizontalSpacing = 3 / 4 * width; //horizontální vzdálenost mezi středy hexů

function hexCorner(center, size, i) {
    let angle_deg = 60 * i;
    let angle_rad = Math.PI / 180 * angle_deg;

    return { x: center.x + size * Math.cos(angle_rad), y: center.y + size * Math.sin(angle_rad) }
}
//vezme střed (v pixelech, např. {0,0}), velikost (size) a pořadí vrcholu (0 až 5) a vrátí souřadnice daného vrcholu

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

    return { x: x, y: y };
}
//vezme hex, např. {q: 0, r: 0} a vrátí jeho souřanice jako {x: 0, y: 0}

function pixelToHex(center) {
    var q = (2. / 3 * center.x) / size;
    var r = (-1 / 3 * center.x + Math.sqrt(3) / 3 * center.y) / size;

    return axialRound({ q: q, r: r });
}
//vezme souřadnice středu, např. {x: 0, y: 0} a vrátí souřadnice daného hexu, tj. {q: 0, r: 0}
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


//TESTOVÁNÍ
// console.log(hexToPixel({ q: 0, r: 0 }));
// console.log(hexToPixel({ q: 0, r: 1 }));
// console.log(hexToPixel({ q: 0, r: 2 }));
// console.log(hexToPixel({ q: 0, r: 3 }));

// console.log(pixelToHex({ x: 0, y: 0 }));
// console.log(pixelToHex({ x: 3, y: 4 }));
// console.log(pixelToHex({ x: 5, y: 17.32050807568877 }));
// console.log(pixelToHex({ x: 3, y: 15 }));
// console.log(pixelToHex({ x: 6, y: 34.64101615137754 }));
// console.log(pixelToHex({ x: 7, y: 32 }));
// console.log(pixelToHex({ x: -3, y: 51.96152422706632 }));
// console.log(pixelToHex({ x: 3, y: 48 }));