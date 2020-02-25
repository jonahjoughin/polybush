export function poly(ids, coords, polygon, nodeSize) {
    const [minX, minY, maxX, maxY] = bbox(polygon);
    const stack = [0, ids.length - 1, 0];
    const result = [];
    let x, y;

    while (stack.length) {
        const axis = stack.pop();
        const right = stack.pop();
        const left = stack.pop();

        if (right - left <= nodeSize) {
            for (let i = left; i <= right; i++) {
                x = coords[2 * i];
                y = coords[2 * i + 1];
                if (
                    x >= minX &&
          x <= maxX &&
          y >= minY &&
          y <= maxY &&
          pointInPolygon(x, y, polygon)
                )
                    result.push(ids[i]);
            }
            continue;
        }

        const m = Math.floor((left + right) / 2);

        x = coords[2 * m];
        y = coords[2 * m + 1];

        if (
            x >= minX &&
      x <= maxX &&
      y >= minY &&
      y <= maxY &&
      pointInPolygon(x, y, polygon)
        )
            result.push(ids[m]);

        const nextAxis = (axis + 1) % 2;

        if (axis === 0 ? minX <= x : minY <= y) {
            stack.push(left);
            stack.push(m - 1);
            stack.push(nextAxis);
        }
        if (axis === 0 ? maxX >= x : maxY >= y) {
            stack.push(m + 1);
            stack.push(right);
            stack.push(nextAxis);
        }
    }

    return result;
}

export function multiPoly(ids, coords, polygons, nodeSize) {
    const [minX, minY, maxX, maxY] = bboxPolygons(polygons);
    const stack = [0, ids.length - 1, 0];
    const result = [];
    let x, y;

    while (stack.length) {
        const axis = stack.pop();
        const right = stack.pop();
        const left = stack.pop();

        if (right - left <= nodeSize) {
            for (let i = left; i <= right; i++) {
                x = coords[2 * i];
                y = coords[2 * i + 1];
                if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
                    for (const polygon of polygons) {
                        if (pointInPolygon(x, y, polygon)) {
                            result.push(ids[i]);
                            break;
                        }
                    }
                }
            }
            continue;
        }

        const m = Math.floor((left + right) / 2);

        x = coords[2 * m];
        y = coords[2 * m + 1];

        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
            for (const polygon of polygons) {
                if (pointInPolygon(x, y, polygon)) {
                    result.push(ids[m]);
                    break;
                }
            }
        }

        const nextAxis = (axis + 1) % 2;

        if (axis === 0 ? minX <= x : minY <= y) {
            stack.push(left);
            stack.push(m - 1);
            stack.push(nextAxis);
        }
        if (axis === 0 ? maxX >= x : maxY >= y) {
            stack.push(m + 1);
            stack.push(right);
            stack.push(nextAxis);
        }
    }

    return result;
}

function bbox(polygon) {
    const ring = polygon[0];
    let minX = ring[0][0],
        minY = ring[0][1],
        maxX = ring[0][0],
        maxY = ring[0][1];
    for (let i = 1; i < ring.length; i++) {
        if (minX > ring[i][0]) {
            minX = ring[i][0];
        } else if (maxX < ring[i][0]) {
            maxX = ring[i][0];
        }
        if (minY > ring[i][1]) {
            minY = ring[i][1];
        } else if (maxY < ring[i][1]) {
            maxY = ring[i][1];
        }
    }
    return [minX, minY, maxX, maxY];
}

function bboxPolygons(polygons) {
    let minX = polygons[0][0][0][0],
        minY = polygons[0][0][0][1],
        maxX = polygons[0][0][0][0],
        maxY = polygons[0][0][0][1];
    for (const polygon of polygons) {
        const ring = polygon[0];
        for (let i = 0; i < ring.length; i++) {
            if (minX > ring[i][0]) {
                minX = ring[i][0];
            } else if (maxX < ring[i][0]) {
                maxX = ring[i][0];
            }
            if (minY > ring[i][1]) {
                minY = ring[i][1];
            } else if (maxY < ring[i][1]) {
                maxY = ring[i][1];
            }
        }
    }
    return [minX, minY, maxX, maxY];
}

function pointInRing(x, y, ring) {
    let inside = false;

    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const xi = ring[i][0],
            yi = ring[i][1];
        const xj = ring[j][0],
            yj = ring[j][1];

        const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }

    return inside;
}

function pointInPolygon(x, y, polygon) {
    if (!pointInRing(x, y, polygon[0])) {
        return false;
    }

    for (const hole of polygon.slice(1)) {
        if (pointInRing(x, y, hole)) {
            return false;
        }
    }

    return true;
}
