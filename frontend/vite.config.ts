import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      vue: '@vue/compat',
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2
          }
        }
      }
    }),
  ],
  server: {
		port: 3001,
		proxy: {
			"^/api": {
				target: "http://127.0.0.1:3000"
			},
    }
	},
})
