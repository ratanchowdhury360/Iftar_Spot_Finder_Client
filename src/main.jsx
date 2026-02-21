import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './Router/Router.jsx'
import { RouterProvider } from 'react-router'
import AuthProvider from './Context/AuthProvider'
import IftarSpotsProvider from './Context/IftarSpotsProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <IftarSpotsProvider>
        <RouterProvider router={router} />
      </IftarSpotsProvider>
    </AuthProvider>
  </StrictMode>,
)
