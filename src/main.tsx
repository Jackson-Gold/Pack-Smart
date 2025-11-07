import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Styleguide from './routes/Styleguide'
import Login from './routes/Login'
import ErrorPage from './routes/ErrorPage'
import HelloWorld from './routes/HelloWorld'
import './styles/tokens.css'
import './styles/global.css'

// Get base path from Vite config (same as vite.config.ts)
const base = import.meta.env.BASE_URL || '/Pack-Smart/'

const router = createBrowserRouter([
  { path: '/', element: <Login />, errorElement: <ErrorPage /> },
  { path: '/app', element: <App />, errorElement: <ErrorPage /> },
  { path: '/styleguide', element: <Styleguide />, errorElement: <ErrorPage /> },
  { path: '/hello-world', element: <HelloWorld />, errorElement: <ErrorPage /> },
], {
  basename: base
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
