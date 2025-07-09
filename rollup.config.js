import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import fs from 'fs';

const extensions = [".ts", ".js"];

const preventTreeShakingPlugin = () => {
  return {
    name: "no-treeshaking",
    resolveId(id, importer) {
      if (!importer) {
        // let's not treeshake entry points, as we're not exporting anything in App Scripts
        return { id, moduleSideEffects: "no-treeshake" };
      }
      return null;
    },
  };
};

const postBuildCleanupPlugin = () => {
  return {
    name: 'post-build-cleanup',
    writeBundle() {
      const filePath = 'build/index.js';
      let code = fs.readFileSync(filePath, 'utf8');
      // Remove any export or module.exports or exports.* lines
      code = code.replace(/module\.exports\s*=\s*\{[^}]*\};?/g, '');
      code = code.replace(/^export\s+\{[^}]*\};?$/gm, '');
      code = code.replace(/^exports\.[^=]+=[^;]+;?$/gm, ''); // Remove exports.* = ...;
      code = code.replace(/^exports\s*=\s*[^;]+;?$/gm, ''); // Remove exports = ...;
      code = code.replace(/^export default [^;]+;?$/gm, ''); // Remove export default ...;
      fs.writeFileSync(filePath, code, 'utf8');
    }
  };
};

export default {
  input: "./src/index.ts",
  output: {
    file: "build/index.js",
    format: "cjs", // Output as CommonJS, but we'll strip exports
  },
  plugins: [
    preventTreeShakingPlugin(),
    nodeResolve({
      extensions,
      mainFields: ["jsnext:main", "main"],
    }),
    babel({ extensions, babelHelpers: "bundled" }),
    postBuildCleanupPlugin(),
  ],
}; 