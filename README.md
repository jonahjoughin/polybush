## PolyBush [![Build Status](https://api.travis-ci.com/jonahjoughin/kdbush.svg?branch=master)](https://travis-ci.com/jonahjoughin/kdbush)

Forked from [KDBush](https://github.com/mourner/kdbush):

A very fast static spatial index for 2D points based on a flat KD-tree.
Compared to [RBush](https://github.com/mourner/rbush):

- points only — no rectangles
- static — you can't add/remove items
- indexing is 5-8 times faster

```js
const index = new PolyBush(points);         // make an index
const ids1 = index.range(10, 10, 20, 20); // bbox search - minX, minY, maxX, maxY
const ids2 = index.within(10, 10, 5);     // radius search - x, y, radius
```

## Install

Install using NPM (`npm install polybush`) or Yarn (`yarn add polybush`), then:

```js
// import as a ES module
import PolyBush from 'polybush';

// or require in Node / Browserify
const PolyBush = require('polybush');
```

Or use a browser build directly:

```html
<script src="https://unpkg.com/polybush@1.0.0/polybush.min.js"></script>
```

## API

#### new PolyBush(points[, getX, getY, nodeSize, arrayType])

Creates an index from the given points.

- `points`: Input array of points.
- `getX`, `getY`: Functions to get `x` and `y` from an input point. By default, it assumes `[x, y]` format.
- `nodeSize`: Size of the 
-tree node, `64` by default. Higher means faster indexing but slower search, and vise versa.
- `arrayType`: Array type to use for storing coordinate values. `Float64Array` by default, but if your coordinates are integer values, `Int32Array` makes things a bit faster.

```js
const index = new PolyBush(points, p => p.x, p => p.y, 64, Int32Array);
```

#### index.range(minX, minY, maxX, maxY)

Finds all items within the given bounding box and returns an array of indices that refer to the items in the original `points` input array.

```js
const results = index.range(10, 10, 20, 20).map(id => points[id]);
```

#### index.within(x, y, radius)

Finds all items within a given radius from the query point and returns an array of indices.

```js
const results = index.within(10, 10, 5).map(id => points[id]);
```

#### index.poly(polygon)

Finds all items within a given turf polygon

```js
polygon = turf.polygon([[
    [-82.574787, 35.594087],
    [-82.574787, 35.615581],
    [-82.545261, 35.615581],
    [-82.545261, 35.594087],
    [-82.574787, 35.594087]
]]

const results = index.poly(polygon).map(id => points[id]);
```

#### index.multiPoly(multiPolygon)

Finds all items within a given turf multi-polygon

```js
multiPolygon = turf.multiPolygon([
  [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
  [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
  [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
]);

const results = index.multiPoly(multiPolygon).map(id => points[id]);
```

#### index.geoJSONFeature(polygon)

Finds all items within a given GeoJSON feature (polygon or multipolygon)

```js
feature = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [100.0, 0.0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0],
        [100.0, 0.0]
      ]
    ]
  },
  properties: {
    prop0: 'value0',
    prop1: { this: 'that' }
  }
};

const results = index.geoJSONFeature(feature).map(id => points[id]);
```

