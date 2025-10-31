Running "npm run build"
> frontend_agentevirtualvoz@0.0.0 build
> vite build
vite v5.4.21 building for production...
transforming...
✓ 3 modules transformed.
x Build failed in 63ms
error during build:
[vite]: Rollup failed to resolve import "lucide-react" from "/vercel/path0/src/main.jsx".
This is most likely unintended because it can break your application at runtime.
If you do want to externalize this module explicitly add it to
`build.rollupOptions.external`
    at viteWarn (file:///vercel/path0/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:65855:17)
    at onwarn (file:///vercel/path0/node_modules/@vitejs/plugin-react/dist/index.js:90:7)
    at onRollupWarning (file:///vercel/path0/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:65885:5)
    at onwarn (file:///vercel/path0/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:65550:7)
    at file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:20951:13
    at Object.logger [as onLog] (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:22823:9)
    at ModuleLoader.handleInvalidResolvedId (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:21567:26)
    at file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:21525:26
Error: Command "npm run build" exited with 1