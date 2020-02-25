import {terser} from 'rollup-plugin-terser';
import buble from 'rollup-plugin-buble';

const config = (file, plugins) => ({
    input: 'src/index.js',
    output: {
        name: 'PolyBush',
        format: 'umd',
        indent: false,
        file
    },
   
    plugins
});

export default [
    config('polybush.js', [buble({
        transforms: { forOf: false },
    })]),
    config('polybush.min.js', [terser(), buble({
        transforms: { forOf: false },
    })])
];
