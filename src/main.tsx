
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set default article ID to 1357 in the URL if no parameters are present
if (window.location.pathname === '/' && !window.location.search) {
  window.history.replaceState(null, '', '/?p=1357');
}

createRoot(document.getElementById("root")!).render(<App />);
