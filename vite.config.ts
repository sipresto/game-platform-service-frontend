import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 5173,
        proxy: {
            '/auth': {
                target: 'http://0.0.0.0:8280',
                changeOrigin: true,
                rewrite: (path) => path,
                headers: {
                    'X-Forwarded-Host': 'localhost',
                    'X-Forwarded-Port': '80'
                },
                configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq) => {
                        const timeout = 600000;
                        proxyReq.setTimeout(timeout);
                    });
                }
            },
            '/api/platform': {
                target: 'http://0.0.0.0:8095',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/platform/, '/api'),
                headers: {
                    'X-Forwarded-Host': 'localhost'
                }
            },
            '/api/games/tictactoe': {
                target: 'http://0.0.0.0:8096',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/games\/tictactoe/, '/api/tictactoe'),
                headers: {
                    'X-Forwarded-Host': 'localhost'
                }
            },
            '/games/tictactoe': {
                target: 'http://0.0.0.0:5174',
                changeOrigin: true,
                ws: true,
                rewrite: (path) => path
            }
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
})