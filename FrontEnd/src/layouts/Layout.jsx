import { Outlet } from 'react-router-dom'
import { Navbar, Footer } from '../components/Components'
import { AuthContext } from '../utils/authContext'
import { useState } from 'react'

function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Navbar />
      <main className="h-auto w-full bg-white">
        <Outlet />
      </main>
      <Footer />
    </AuthContext.Provider>
  )
}

export default Layout
