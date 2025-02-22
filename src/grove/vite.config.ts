/**
 * @see {@link ../SETTINGS.md}
 * 
 * Settings:
 * - 'build-output-location'
 */

import { AliasOptions, defineConfig } from 'vite';
import { readFileSync } from 'fs';
import path from 'path';
import { workspaces } from '../../package.json'; // TODO - hard coupling

// We get configurable build parameters from README.md
// by scanning for links to SETTINGS.md#setting_name // TODO - hard coupling
// and reading the value of the linked text.
// See below for examples.
const settings = new Map<string, string>();
const README = readFileSync('../../README.md', { encoding: 'utf8' });
const pattern = /\[(.*?)\]\((?:.*\/)?SETTINGS\.md#(.*?)\)/g;
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
[...README.matchAll(pattern)]
    .reduce((list, [_, value, setting]) => list.set(setting, value), settings);


// During development, "@grove/package" imports are resolved to "/src/package/src/*"
// This is so we can live-reload across modules without having to rebuild each time.
const alias: AliasOptions = {};
for (const workspace of workspaces) {
    const moduleName = workspace.split('/')[1];
    alias['@grove/' + moduleName] = path.resolve(__dirname, '../../', workspace, 'src');  // TODO - hard coupling
}


export default defineConfig({
    base: './',
    resolve: {
        alias
    },
    optimizeDeps: {
        exclude: ['firearm', '3-AD']
    },
    build: {
        emptyOutDir: true,
        outDir: path.resolve(__dirname, '../..', settings.get('build-output-location') ?? 'dist'),
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                game: path.resolve(__dirname, 'game.html')
            },
        },
    },
    esbuild: {
        supported: {
            'top-level-await': true //browsers can handle top-level-await features
        },
    },
    worker: {
        format: 'es'
    },
});