import sort from './sort';
import range from './range';
import { poly, multiPoly } from './poly';
import within from './within';

const defaultGetX = p => p[0];
const defaultGetY = p => p[1];

export default class PolyBush {
  constructor(
    points,
    getX = defaultGetX,
    getY = defaultGetY,
    nodeSize = 64,
    ArrayType = Float64Array
  ) {
    this.nodeSize = nodeSize;
    this.points = points;

    const IndexArrayType = points.length < 65536 ? Uint16Array : Uint32Array;

    const ids = (this.ids = new IndexArrayType(points.length));
    const coords = (this.coords = new ArrayType(points.length * 2));

    for (let i = 0; i < points.length; i++) {
      ids[i] = i;
      coords[2 * i] = getX(points[i]);
      coords[2 * i + 1] = getY(points[i]);
    }

    sort(ids, coords, nodeSize, 0, ids.length - 1, 0);
  }

  range(minX, minY, maxX, maxY) {
    return range(this.ids, this.coords, minX, minY, maxX, maxY, this.nodeSize);
  }

  poly(polygon) {
    return poly(this.ids, this.coords, polygon, this.nodeSize);
  }

  multiPoly(multiPolygon) {
    return multiPoly(this.ids, this.coords, multiPolygon, this.nodeSize);
  }

  geoJSONFeature(feature) {
    if (feature.geometry.type == 'Polygon') {
      return this.poly(feature.geometry.coordinates);
    } else if (feature.geometry.type == 'MultiPolygon') {
      return this.multiPoly(feature.geometry.coordinates);
    } else {
      return [];
    }
  }

  within(x, y, r) {
    return within(this.ids, this.coords, x, y, r, this.nodeSize);
  }
}
