import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Wrap from './Wrap.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Wrap />
  </StrictMode>,
)
