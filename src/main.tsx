// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/Layout.css'

createRoot(document.getElementById('root')!).render(
  // Habilitar StrictMode en desarrollo si en necesario para detectar efectos segundarios, 
  // Al quitar el StrictMode, el useEffect en FormInventario se ejecutará solo una vez como debería en producción.
  // <StrictMode> //
  <App />
  // </StrictMode>,
)
