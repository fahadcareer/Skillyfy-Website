import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./components/translate/i8n/index.jsx";

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>,
)
