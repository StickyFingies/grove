import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const resolvePath = (str: string) => path.resolve(__dirname, str);

const postbuild = () => {
  return {
    name: 'Postbuild',
    closeBundle() {
      const path = './dist/index.es.js';

      fs.readFile(path, 'utf8', (err, data) => {
        if (err) return console.error(err);

        // Vite spits out WebWorkers with absolute paths, making them nearly impossible
        // to package with reusable liraries.  This script applies a patch to the WW paths,
        // making them relative to the script that loads them.
        const result = data.replace(/Worker\("(.+)",/g, 'Worker(new URL(".$1", impo' + 'rt.meta.url),');

        fs.writeFile('./dist/index.es.js', result, 'utf8', (err) => {
          if (err) console.error(err);
        });
      });
    },
  }
}

export default defineConfig({
  build: {
    assetsDir: '',
    target: 'esnext',
    lib: {
      entry: resolvePath('src/index.ts'),
      name: '3-AD',
      formats: ['es'],
      fileName: format => `index.${format}.js`
    },
    rollupOptions: {
      // input: {
      //   main: resolvePath('index.html'),
      // },
      external: ['three'],
    }
  },
  worker: {
    format: 'es'
  },
  plugins: [
    dts(),
    postbuild(),
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },
  ]
});