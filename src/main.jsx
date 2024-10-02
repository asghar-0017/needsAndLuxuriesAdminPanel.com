import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import Loader from './components/loader/loader.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
    <App />
    </Suspense>
  </StrictMode>,
)
