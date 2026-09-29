import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // GitHub Pages: https://ceros9651.github.io/gomi-navi/
  base: '/gomi-navi/',
  plugins: [
    VitePWA({
      // 新しいバージョンは裏で取得し、次に開いたときに反映する
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'ごみナビ',
        short_name: 'ごみナビ',
        description: '春日井市 E地区の今日と明日のごみ出し日',
        lang: 'ja',
        start_url: '/gomi-navi/',
        scope: '/gomi-navi/',
        display: 'standalone',
        background_color: '#f4f5f7',
        theme_color: '#2a7bc4',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}'],
      },
    }),
  ],
})
