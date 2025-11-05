import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '../components/Components';

function Layout() {

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 w-full pt-20 pb-14">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout;
