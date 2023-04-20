import reactRefresh from '@vitejs/plugin-react-refresh';
import tailwindcss from 'tailwindcss';
export default {
  plugins: [reactRefresh(), tailwindcss('./tailwind.config.js')],
};
