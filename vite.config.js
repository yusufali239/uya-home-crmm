import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/uya-home-crm/', // Замени на имя твоего GitHub репозитория
})
