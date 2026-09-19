import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import LandingPage from './pages/landing/Landing.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<LandingPage />} />
  </Routes>
  </BrowserRouter>
)
