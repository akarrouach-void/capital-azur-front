# Changelog

## [3.0.0] - 03/03/2026

### [Next.js 16 Migration](https://bitbucket.org/adminvoid/vactory_next/pull-requests/320)

#### 1. Update Root Dependencies

```bash
yarn add next@16.1.6 react@19.2.4 react-dom@19.2.4 body-parser@2.2.2 dotenv@16.4.5 -W -E

yarn add -D @types/react@19.2.4 @babel/core@7.29.0 @babel/eslint-parser@7.28.6 @babel/plugin-transform-runtime@7.29.0 @babel/preset-env@7.29.0 @babel/preset-react@7.28.5 @storybook/addon-a11y@10.2.15 @storybook/addon-docs@10.2.15 @storybook/nextjs@10.2.15 @storybook/react@10.2.15 eslint-plugin-storybook@10.2.15 storybook@10.2.15 -W -E

yarn remove lru-cache -W
```

#### 2. Codemods

- **`next16-migration`**: Automates the main migration steps — renames root `babel.config.js` to `.babelrc.js`, replaces `.storybook/main.js` with the ESM shared config, adds `--webpack` flag to the build command, adds `dangerouslyAllowLocalIP: true` to images config, and deletes `themes/amp/`.
  ```bash
  node scripts/codemods/next16-migration.js apps/<your-workspace>
  ```
- **`remove-amp-files`**: Removes all AMP component files (`*AMP.jsx`) and cleans up any imports referencing deleted AMP files in sibling modules.
  ```bash
  node scripts/codemods/remove-amp-files.js apps/<your-workspace>
  ```

#### Changed

- **Framework Upgrade**: Migrated from Next.js 15.5.12 to Next.js 16.1.6
- **Custom Patch**: Replaced `next+15.5.12.patch` with `next+16.1.6.patch`

#### Removed APIs & Replacements

- **`publicRuntimeConfig` / `serverRuntimeConfig` removed** (dropped in Next.js 16):
  - Replaced with build-time `env` config in `next-config.js` (`VACTORY_I18N_CONFIG`, `VACTORY_MENUS_CONFIG`) which inlines values via webpack DefinePlugin
  - Removed `import getConfig from "next/config"` from `packages/core/src/lib/utils.js`; `getI18nConfig()`, `getEnabledLanguages()`, and `getEnabledMenus()` now read from `process.env` at build time
  - Removed runtime `nextConfig.publicRuntimeConfig` overrides from `packages/core/src/web-server/prod-server.js`
  - Updated storybook `next-config` override and `jest.setup.js` mock accordingly

#### Webpack & Module Resolution

- **Turbopack is now the default dev bundler in Next.js 16**: Added `webpack: true` to the `next()` programmatic API call in `dev-server.js` to force webpack in dev mode (required because the project uses extensive custom webpack plugins, CSS loaders, and `NormalModuleReplacementPlugin`)
- **Build uses `--webpack` flag**: `next build --webpack` in the build script
- **Fixed `NormalModuleReplacementPlugin`**: The old regex+string form (`/\/lib\/drupal\/client\.server\.js/, "./client.js"`) stopped working in webpack 5.101.3; replaced with a function callback that handles both `beforeResolve` (context-based) and `afterResolve` (resource-based) hooks to properly swap `client.server.js` with `client.js` on the client bundle
- **Expanded `resolve.fallback` list**: Added `net`, `tls`, `dns`, `dgram`, `child_process`, `cluster`, `http2`, `readline`, `os`, `stream`, `zlib`, `constants`, `module` as safety-net fallbacks for any server-only Node.js built-ins that may leak into the client bundle

#### AMP Support

- **Removed AMP theme loader and plugins**: Removed `WidgetPluginAmp`, `NodesPluginAmp`, and the AMP-specific `getGlobalCssLoader` configuration from the webpack plugin

#### Image Optimization

- **Private IP blocking** (new in Next.js 16): The image optimizer now blocks upstream images that resolve to private IPs (e.g. NAT64 `64:ff9b::/96`); added `dangerouslyAllowLocalIP: true` to `project.config.js` images config to allow images from internal/staging servers

#### Configuration Changes

- **packages/core/src/config/next-config.js**: Replaced `publicRuntimeConfig` with `env` block
- **packages/core/src/lib/utils.js**: Removed `next/config` dependency; reads config from `process.env`
- **packages/core/src/web-server/dev-server.js**: Added `webpack: true` to `next()` options
- **packages/core/src/web-server/prod-server.js**: Removed `publicRuntimeConfig` runtime overrides
- **packages/core/src/webpack/index.js**: Rewrote `NormalModuleReplacementPlugin`, expanded Node.js fallbacks, removed AMP plugins
- **packages/core/src/storybook/server/overrides/next-config/index.js**: Removed `publicRuntimeConfig` mock
- **apps/starter/jest.setup.js**: Replaced `next/config` mock with `process.env` setup
- **apps/starter/project.config.js**: Added `dangerouslyAllowLocalIP: true` to images config

#### Storybook 10 Migration

- **Framework Upgrade**: Migrated Storybook from 7.6.8 to 10.2.15
- **Package alignment**: Upgraded all Storybook packages to 10.2.15 (`storybook`, `@storybook/nextjs`, `@storybook/react`, `@storybook/addon-a11y`, `@storybook/addon-docs`, `@storybook/addon-links`, `@storybook/addon-onboarding`, `eslint-plugin-storybook`)
- **Removed deprecated addons**: Dropped `@storybook/addon-essentials`, `@storybook/addon-interactions`, `@storybook/blocks`, `@storybook/testing-library` (functionality is built into Storybook 10 or no longer exists)
- **Babel compatibility**: Upgraded `@babel/core`, `@babel/preset-env`, `@babel/preset-react`, `@babel/plugin-transform-runtime`, `@babel/eslint-parser` to 7.28–7.29 to match Storybook’s bundled Babel and fix `.inherits` validation errors
- **Dependency cleanup**: Removed unused root `lru-cache@10.1.0` (and from `@vactorynext/core` peerDependencies) to resolve conflict with Babel’s `lru-cache@5` requirement (`_lruCache is not a constructor`)
- **Babel config scope**: Renamed root `babel.config.js` to `.babelrc.js` so the root Babel config applies only within package boundaries and no longer affects Storybook (which uses its own Babel/SWC setup)
- **ESM-only config**: Converted `packages/core/src/storybook/server/main.js` to ESM (`import`/`export`); converted `apps/starter/.storybook/main.js` to ESM and used `createRequire` for `@vactorynext/core/storybook-server` to satisfy ESM directory-import rules

#### Breaking Changes

- `getConfig()` from `next/config` is no longer available. Any code that imported it directly must migrate to `process.env` or use the existing helpers (`getI18nConfig`, `getEnabledLanguages`, `getEnabledMenus`)
- AMP theme support has been removed

---

## [2.0.0] - 11/11/2025

### [Next.js 15 Migration](https://bitbucket.org/adminvoid/vactory_next/pull-requests/316/overview)

#### Changed

- **Framework Upgrade**: Migrated from Next.js 14 to Next.js 15.5.6
- **React Upgrade**: Updated React and React DOM from 18 to v19.2.0
- **Custom Patch**: Added `next+15.5.6.patch` for Next.js 15 compatibility
- **Custom LoadingOverlay**: Replaced `react-loading-overlay-nextgen` package with custom implementation
- **Custom Viewport Hook**: Replaced `react-in-viewport` package with custom hook implementation

#### Package Updates

- `react@19.2.0` (upgraded from React 18)
- `react-dom@19.2.0` (upgraded from React 18)
- `@types/react@19.2.0` (upgraded from React 18 types)
- `next@15.5.6` (upgraded from Next.js 14)
- `eslint-config-next@16.0.1` (upgraded to match Next.js 15)
- `react-toastify@11.0.5` (upgraded from 9.1.3 for React 19 compatibility - CSS import no longer required)
- `react-router-dom@7.9.5` (upgraded from 6.21.2 for React 19 compatibility)
- `@headlessui/react@2.2.9` (upgraded from 1.7.18 for React 19 compatibility)
- `dotenv@17.2.3` (added as dev dependency for build scripts)

#### Configuration Changes

- **packages/console/package.json**: Updated `peerDependencies` and `resolutions` to reflect new React 19 versions
- **project.config.js**: Added `images.quality` array configuration for optimized image quality settings used across the project
- **ESLint Configuration**: Migrated from legacy `.eslintrc.json` to ESLint flat config format (`eslint.config.mjs`)
  - Used official ESLint migration tool (`@eslint/migrate-config`) for proper conversion
  - Disabled new React 19 strict rules (`react-hooks/set-state-in-effect`, `react-hooks/refs`, `react-hooks/immutability`) to maintain backwards compatibility
  - Disabled React Compiler rules (`react-hooks/preserve-manual-memoization`, `react-hooks/incompatible-library`) introduced in Next.js 15
  - Updated lint script from deprecated `next lint` to `eslint .` in apps/starter/package.json
  - Migrated all `.eslintignore` patterns to flat config (including `*.spec.js` for test files)

#### Dependencies Removed

- `react-loading-overlay-nextgen` - Removed due to usage of React 18 deprecated functionalities that throw errors in React 19. Replaced with custom loading overlay component for better control and lighter bundle size
- `react-in-viewport` - Removed due to usage of React 18 deprecated functionalities that throw errors in React 19. Replaced with custom viewport detection hook for better performance

#### Impact

- Improved application performance with React 19 optimizations
- Better build-time optimizations with Next.js 15
- Reduced bundle size by removing third-party packages
- Enhanced type safety with updated TypeScript definitions
- More control over loading states and viewport detection logic

---

## [1.0.0] - 23/10/2025

### [Performance Optimizations](https://bitbucket.org/adminvoid/vactory_next/commits/9ecaff1fe3f5d72dd0f39921e65a71ed50eef7bc)

#### [static-widgets.jsx]

##### Changed

- **Memoized grid arrays**: Used `useMemo` for grid arrays (12, 4, 3, 2 cols) to prevent recreation on every render
- **Optimized renderWidgetUI**: Moved function inside component and wrapped with `useCallback` to prevent recreation

##### Performance Impact

- Prevents unnecessary array recreation on every render
- Reduces memory allocation for grid system
- More efficient widget rendering

---

#### [_app.jsx]

##### Changed

-  **Memoized extraProviders**: Used `useMemo` to prevent recreation of providers array on every render
-  **Font optimization**: Added `variable` and `preload` properties to font configurations for better performance

##### Added

- Font CSS variables (`--font-poppins` and `--font-cairo`) for more efficient font loading

##### Performance Impact

- Better font loading performance with preload hints
- Prevents provider array recreation on every render (less memory allocation)

---

#### [index.jsx]
 
##### Changed

-  **Parallelized initialization operations**: Health check and redirects initialization now run concurrently using `Promise.all()`, eliminating sequential wait time
-  **Parallelized data fetching**: Translations, menus, and router logic now fetch simultaneously, significantly reducing server response time
-  **Improved deep cloning**: Replaced `JSON.parse(JSON.stringify())` with native `structuredClone()` for 10-15% faster performance
-  **Optimized class processing**: Replaced nested `forEach` loops with `for...of` loop and `filter(Boolean)` for more efficient array operations
-  **Memoized NodePage component**: Wrapped component with `React.memo` to prevent unnecessary re-renders

  

##### Added

- Default theme fallback: `node._theme` now defaults to `"default"` when not provided
- Custom React.memo comparison function to optimize re-render checks based on node ID, locale, and route status

  

##### Fixed

- Improved code formatting and readability

  

##### Performance Metrics

**Before Optimizations:**
- Waiting for server response: 901.34 ms
- Service Worker respondWith: 901.07 ms
- Content Download: 1.61 ms
- **Total: 975.05 ms**

**After Optimizations:**
- Waiting for server response: 54.24 ms ⚡
- Service Worker respondWith: 53.89 ms ⚡
- Content Download: 1.54 ms
- **Total: 56.84 ms**

**Improvement:**
- **94.17% faster** (918.21 ms saved)
- Server response time reduced from 901.34ms to 54.24ms
- Overall page load reduced from 975.05ms to 56.84ms

##### Technical Details (Operations Timeline)

```
Before (Sequential):

├─ Health Check: 396ms
├─ Redirects Init: 1ms
├─ Session: 6ms
├─ Translations: 4ms
├─ Menus: 4ms
├─ Router: 1ms
└─ Node Fetching: 56ms

Total: ~469ms (server-side processing)
Total with network: 975.05ms

  
After (Parallelized):

├─ Init (Health + Redirects): ~50ms ⚡ Parallel + Optimized
├─ Session: 6ms
├─ Parallel Fetch (Trans+Menus+Router): 7ms ⚡ Parallel
└─ Node Fetching: 10ms ⚡ Optimized

Total: ~73ms (server-side processing) 
Total with network: 56.84ms
```

  

##### Impact

- Better user experience with faster page loads
- Improved server efficiency under high traffic
- Significant performance gains during cache expiration
- Reduced client-side re-renders for smoother navigation
- More maintainable and modern codebase
  

##### Breaking Changes

None. All changes are backward compatible.
