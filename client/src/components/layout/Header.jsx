import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MenuIcon, SidebarCloseIcon, StethoscopeIcon } from "lucide-react"
import axios from "axios"
import { backendUrl } from "../../App"
import { useAuth } from "../../context/AuthContext"

const Header = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const isAuthenticated = !!user
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/users/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      logout()
      navigate("/")
    }
  }

  const navLinks = isAuthenticated
    ? [
        { name: "Dashboard", to: "/dashboard" },
        { name: "Features", to: "/features" },
        { name: "Add Member", to: "/addmember" },
        { name: "Records", to: "/records" },
        { name: "Reminders", to: "/reminder" },
        { name: "Insights", to: "/insights" },
      ]
    : [
        { name: "Features", to: "/features" },
        { name: "Dashboard", to: "/dashboard" },
        { name: "Records", to: "/records" },
        { name: "Reminders", to: "/reminder" },
        { name: "Insights", to: "/insights" },
      ]

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <StethoscopeIcon className="text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            TrackMeds
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Links */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700 font-medium">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
          {isMenuOpen ? <SidebarCloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden text-center px-6 pb-4">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <span className="text-gray-700 font-medium">Welcome, {user.name}</span>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="text-red-600 hover:text-red-700 px-4 py-2 rounded-lg text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 text-center"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
