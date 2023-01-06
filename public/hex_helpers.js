// https://www.redblobgames.com/grids/hexagons/#conversions
function cube_to_axial(cube) {
    var q = cube.q
    var r = cube.r
    return {q: q, r: r}
}
function axial_to_cube(hex) {
    var q = hex.q
    var r = hex.r
    var s = -q-r
    return {q: q, r: r, s: s}
}

// https://www.redblobgames.com/grids/hexagons/#rounding
function cube_round(frac) {
    var q = Math.round(frac.q)
    var r = Math.round(frac.r)
    var s = Math.round(frac.s)

    var q_diff = Math.abs(q - frac.q)
    var r_diff = Math.abs(r - frac.r)
    var s_diff = Math.abs(s - frac.s)

    if (q_diff > r_diff && q_diff > s_diff) {
        q = -r-s
    } else if (r_diff > s_diff) {
        r = -q-s
    } else {
        s = -q-r
    }
    return {q: q, r: r, s: s}
}
function axial_round(hex) {
    return cube_to_axial(cube_round(axial_to_cube(hex)))
}

// https://www.redblobgames.com/grids/hexagons/#pixel-to-hex
function pixel_to_flat_hex(point, hexSize) {
    var q = ( 2./3 * point.x                             ) / hexSize
    var r = (-1./3 * point.x  +  Math.sqrt(3)/3 * point.y) / hexSize
    return {q: q, r: r}
}

// https://www.redblobgames.com/grids/hexagons/#hex-to-pixel
function flat_hex_to_pixel(hex, hexSize) {
    var x = hexSize * (     3./2 * hex.q                              )
    var y = hexSize * (Math.sqrt(3)/2 * hex.q  +  Math.sqrt(3) * hex.r)
    return {x: x, y: y}
}

function axial_to_oddq(hex) {
    var col = hex.q
    var row = hex.r + (hex.q - (hex.q&1)) / 2
    return {col: col, row: row}
}
function oddq_to_axial(hex) {
    var q = hex.col
    var r = hex.row - (hex.col - (hex.col&1)) / 2
    return {q: q, r: r}
}

function getHexVertexOffset(i) {
    return [
        {x: - 1,     y: + 0},
        {x: - 1 / 2, y: + Math.sqrt(3) / 2},
        {x: + 1 / 2, y: + Math.sqrt(3) / 2},
        {x: + 1,     y: + 0},
        {x: + 1 / 2, y: - Math.sqrt(3) / 2},
        {x: - 1 / 2, y: - Math.sqrt(3) / 2}
    ][i % 6]
}
