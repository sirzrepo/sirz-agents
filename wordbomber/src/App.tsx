import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { FiHome, FiFolder, FiFileText, FiSettings } from 'react-icons/fi'
// import { HiLightBulb } from 'react-icons/hi'
import 'react-quill/dist/quill.snow.css';
import './App.css';

import { AuthProvider } from './context/AuthContext'
import Home from './pages/home';
import { ToastContainer } from 'react-toastify';

function App() {
  // Helper component to conditionally render Navbar and Footer
  function Layout() {

    return (
      <>
        <div 
          className={`
            transition-all 
            duration-300
          `}
        >
          <div className="">
            <Routes>
              <Route path="/" element={
                  <Home />
              } />
            </Routes>
          </div>
        </div>
      </>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <Layout />
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
