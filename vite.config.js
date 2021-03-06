import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import WindiCSS from 'vite-plugin-windicss';

export default defineConfig({
  plugins: [reactRefresh(), WindiCSS()],
});
