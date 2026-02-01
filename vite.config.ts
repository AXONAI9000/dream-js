import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    // 开发模式 - 运行 demo
    return {
      plugins: [react()],
      root: 'demo'
    }
  }

  // 构建模式 - 打包库
  return {
    plugins: [
      react(),
      dts({ include: ['src'] })
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es'],
        fileName: 'index'
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          },
          assetFileNames: 'styles[extname]'
        }
      },
      cssCodeSplit: false
    }
  }
})
