import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoutes from '../utils/ProtectedRoutes.jsx'
import Layout from '../layouts/Layout'
import { Login, Register, Landing, Home, Blogs, Contact, Events, Chats, Profile, Login_Required } from '../pages/Pages'
import { Suspense } from 'react'
import Loader from '../components/Loader/Loader'
import Dashboard from '../pages/Dashboard/Dashboard.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Suspense fallback={<Loader />}>
      <Layout />
    </Suspense>,
    children: [
      { index: true, element: <Landing /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login_erquired', element: <Login_Required /> },

      { path: 'home', element: <ProtectedRoutes><Home /></ProtectedRoutes> },
      { path: 'blogs', element: <ProtectedRoutes><Blogs /></ProtectedRoutes> },
      { path: 'events', element: <ProtectedRoutes><Events /></ProtectedRoutes> },
      { path: 'chats', element: <ProtectedRoutes><Chats /></ProtectedRoutes> },
      { path: 'profile', element: <ProtectedRoutes><Profile /></ProtectedRoutes> },
      { path: 'dashboard', element: <ProtectedRoutes><Dashboard /></ProtectedRoutes> },
    ]
  }
])

export default router
