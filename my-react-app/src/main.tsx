import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { SWRConfig } from 'swr'
import './i18n'
import './index.css'
import App from './App.tsx'

const swrFallback = (typeof window !== 'undefined' && (window as any).__SWR_DATA__) || {};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <SWRConfig value={{ fallback: swrFallback }}>
        <App />
      </SWRConfig>
    </HelmetProvider>
  </StrictMode>,
)
