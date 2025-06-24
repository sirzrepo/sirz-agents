import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import 'react-quill/dist/quill.snow.css';
import './App.css'
import { useState, useEffect } from 'react'
import { IoHomeOutline, IoBookOutline } from 'react-icons/io5';

import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
// import OTPverification from './pages/auth/OTPverification'
import NavBar from './components/layout/nav'
import Sidebar from './components/layout/Sidebar'
import { AuthProvider } from './context/AuthContext'
import Profile from './pages/profile/Profile'
import Home from './pages/home'
import { ProtectedRoute } from './features/ProtectedRoute'
import AssetDetail from './pages/home/components/AssetDetail'

// Define navigation items that will be shared between Sidebar and NavBar
const navItems = [
  { 
    icon: <IoHomeOutline className="text-xl" />, 
    label: 'Dashboard', 
    path: '/' 
  },
  { 
    icon: <IoBookOutline className="text-xl" />, 
    label: 'Templates', 
    path: '/templates' 
  },
  // { 
  //   icon: <IoSettingsOutline className="text-xl" />, 
  //   label: 'Settings', 
  //   path: '/settings' 
  // },
];

function App() {
  // Helper component to conditionally render Navbar and Footer
  function Layout() {
    const location = useLocation();
    const hideNavbar = ['/login', '/register'].includes(location.pathname);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 768);
    
    // Handle sidebar collapse state changes
    const handleSidebarStateChange = (collapsed: boolean) => {
      setIsSidebarCollapsed(collapsed);
    };
    
    // Track window resize
    useEffect(() => {
      const handleResize = () => {
        setIsSidebarCollapsed(window.innerWidth < 768);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
      <>
        {!hideNavbar && <NavBar sidebarItems={navItems} />}
        {!hideNavbar && (
          <div className="hidden lg:block">
            <Sidebar onStateChange={handleSidebarStateChange} />
          </div>
        )}
        <div 
          className={`
            bg-[#FAFAFA] 
            ${!hideNavbar ? 'sm:pt-[70px] pt-[40px]' : ''} 
            ${!hideNavbar ? (isSidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]') : ''}
            min-h-screen 
            transition-all
            duration-300
          `}
        >
          <div className="px-6">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />
              {/* <Route path="/otp-verification" element={<OTPverification />} /> */}

              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/assets/:assetId" element={
                <ProtectedRoute>
                  <AssetDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Settings</h1>
                    <p className="text-gray-600">Configure your application settings here.</p>
                  </div>
                </ProtectedRoute>
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
      </Router>
    </AuthProvider>
  );
}

export default App;
