//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RuntimeProvider } from "./runtime";
import { SettingsProvider } from "./settings";

createRoot(document.getElementById('root')!).render(
  <RuntimeProvider>
    <SettingsProvider>
       <App />
    </SettingsProvider>
  </RuntimeProvider>,
)
