import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Styleguide from './routes/Styleguide'
import Login from './routes/Login'
import ErrorPage from './routes/ErrorPage'
import './styles/tokens.css'
import './styles/global.css'

const router = createBrowserRouter([
  { path: '/', element: <Login />, errorElement: <ErrorPage /> },
  { path: '/app', element: <App />, errorElement: <ErrorPage /> },
  { path: '/styleguide', element: <Styleguide />, errorElement: <ErrorPage /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
