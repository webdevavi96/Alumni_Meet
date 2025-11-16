import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthContextProvider } from './utils/authContext.jsx';
import ToastProvider from "./utils/toastProvider.jsx";

// import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthContextProvider>
  </StrictMode>,
)
