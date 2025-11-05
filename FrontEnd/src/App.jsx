import { RouterProvider } from 'react-router-dom'
import router from './routes/Routes'
import './index.css'
import Loader from './components/Loader/Loader'

function App() {
  return <RouterProvider router={router} />
}

export default App
