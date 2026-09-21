import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import LandingPage from './pages/landing/Landing.tsx'
import Dashboard from './pages/dashboard/Dashboard.tsx'
import Lesson from './pages/lesson/Lesson.tsx'
import Matching from './pages/assessments/Matching.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/lesson/:id" element={<Lesson />} />
    <Route path="/lesson/:id/matching" element={<Matching />} />
  </Routes>
  </BrowserRouter>
)
