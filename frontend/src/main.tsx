import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import { AuthProvider } from './lib/context/auth/AuthProvider.tsx'
import { RedirectIfAuthed } from './lib/context/auth/RedirectIfAuthed.tsx'
import { ProgressProvider } from './lib/context/progress/ProgressProvider.tsx'
import LandingPage from './pages/landing/Landing.tsx'
import Login from './pages/auth/Login.tsx'
import Signup from './pages/auth/Signup.tsx'
import Dashboard from './pages/dashboard/Dashboard.tsx'
import Lesson from './pages/lesson/Lesson.tsx'
import Matching from './pages/assessments/Matching.tsx'
import Recognition from './pages/assessments/Recognition.tsx';
import GuessTheSound from './pages/assessments/GuessTheSound.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <ProgressProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RedirectIfAuthed />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lesson/:id" element={<Lesson />} />
          <Route path="/lesson/:id/matching" element={<Matching />} />
          <Route path="/lesson/:id/recognition" element={<Recognition />} />
          <Route path="/lesson/:id/guess" element={<GuessTheSound />} />
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  </AuthProvider>
)
