import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Library } from './pages/Library'
import { GamePage } from './pages/GamePage'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/games/lib/trending" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/games/lib" element={<Navigate to="/games/lib/trending" replace />} />
          <Route path="/games/lib/trending" element={<Library />} />
          <Route path="/games/lib/:slug/:igdbId" element={<GamePage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
