import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'npm',
  routes: [
    { path: '/', component: 'editor/index' },
  ],
  title: 'Rich Editor Demo',
  base: '/util/fullEdit',
  outputPath: 'dist/util/fullEdit/',
  publicPath: '/util/fullEdit/',
});
