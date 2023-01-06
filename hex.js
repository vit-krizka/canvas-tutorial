const size = 10;

const height = Math.sqrt(3) * size;
const width = 2 * size;

const verticalSpacing = height;
const horizontalSpacing = 3 / 4 * width;

function hexCorner(center, size, i) {
    let angle_deg = 60 * i;
    let angle_rad = Math.PI / 180 * angle_deg;

    return { x: center.x + size * Math.cos(angle_rad), y: center.y + size * Math.sin(angle_rad) }
}

function hexCorners(center, size) {
    let output = [];

    for (let i = 0; i < 6; i++) {
        output.push(hexCorner(center, size, i));
    }

    return output;
}

//console.log(hexCorners({ x: 0, y: 0 }, 50));

function hexToPixel(hex) {
    let x = size * (3 / 2 * hex.q);
    let y = size * ((Math.sqrt(3) / 2 * hex.q) + (Math.sqrt(3) * hex.r));

    return { x: x, y: y };
}

console.log(hexToPixel({ q: 0, r: 0 }));
console.log(hexToPixel({ q: 0, r: 1 }));
console.log(hexToPixel({ q: 0, r: 2 }));
console.log(hexToPixel({ q: 0, r: 3 }));

console.log(hexToPixel({ q: 0, r: 0 }));
console.log(hexToPixel({ q: 1, r: 0 }));
console.log(hexToPixel({ q: 2, r: 0 }));
console.log(hexToPixel({ q: 3, r: 0 }));
