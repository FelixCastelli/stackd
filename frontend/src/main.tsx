import React, { Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'

const queryClient = new QueryClient()

const Login = lazy(() =>
  import('./pages/Login').then((module) => ({ default: module.Login }))
)

const Register = lazy(() =>
  import('./pages/Register').then((module) => ({ default: module.Register }))
)

const Library = lazy(() =>
  import('./pages/Library').then((module) => ({ default: module.Library }))
)

const GamePage = lazy(() =>
  import('./pages/GamePage').then((module) => ({ default: module.GamePage }))
)

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Navigate to="/games/lib/trending" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/games/lib" element={<Navigate to="/games/lib/trending" replace />} />
            <Route path="/games/lib/trending" element={<Library />} />
            <Route path="/games/lib/:slug/:igdbId" element={<GamePage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
