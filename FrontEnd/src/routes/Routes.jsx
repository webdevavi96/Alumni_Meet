import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoutes from '../utils/ProtectedRoutes.jsx'
import Layout from '../layouts/Layout'
import { Login, Register, Landing, Home, Blogs, Comments, CreateBlog, Contact, Events, CreateEvents, Chats, Profile, EditProfile, Login_Required, ReadMore } from '../pages/Pages'
import { Suspense } from 'react'
import Loader from '../components/Loader/Loader'


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
      { path: 'login_required', element: <Login_Required /> },

      { path: 'home', element: <ProtectedRoutes><Home /></ProtectedRoutes> },
      { path: 'blogs', element: <ProtectedRoutes><Blogs /></ProtectedRoutes> },
      { path: 'comments/:id', element: <ProtectedRoutes><Comments /></ProtectedRoutes> },
      { path: 'readmore/:blogId', element: <ProtectedRoutes><ReadMore /></ProtectedRoutes> },
      { path: 'events', element: <ProtectedRoutes><Events /></ProtectedRoutes> },
      { path: 'chats', element: <ProtectedRoutes><Chats /></ProtectedRoutes> },
      { path: 'profile', element: <ProtectedRoutes><Profile /></ProtectedRoutes> },
      { path: 'profile/update', element: <ProtectedRoutes><EditProfile /></ProtectedRoutes> },
      { path: 'create_blog', element: <ProtectedRoutes><CreateBlog /></ProtectedRoutes> },
      { path: 'create_event', element: <ProtectedRoutes><CreateEvents /></ProtectedRoutes> },
    ]
  }
])

export default router
