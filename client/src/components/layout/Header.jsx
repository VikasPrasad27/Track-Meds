import React,{ useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { backendUrl } from "../../App"
import { MenuIcon, SidebarCloseIcon, StethoscopeIcon } from "lucide-react"


const Header = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

 
  useEffect(() => {
    checkAuthStatus()
    const handleAuthChange = () => {
      checkAuthStatus()
    }

    window.addEventListener("storage", handleAuthChange)
    window.addEventListener("authChange", handleAuthChange)

    return () => {
      window.removeEventListener("storage", handleAuthChange)
      window.removeEventListener("authChange", handleAuthChange)
    }
  }, [])

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    } else {
      setIsAuthenticated(false)
      setUser(null)
    }
  }

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
        },
      )
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setIsAuthenticated(false)
      setUser(null)

      window.dispatchEvent(new Event("authChange"))

      navigate("/")
    }
  }

  const navLinks = [
    { name: "Features", to: "/features" },
    { name: "Dashboard", to: "/dashboard" },
    { name: "Records", to: "/records" },
    { name: "Reminders", to: "/reminder" },
    { name: "Insights", to: "/insights" },
  ]

  const authenticatedNavLinks = [
    { name: "Dashboard", to: "/dashboard" },
    { name: "Features", to: "/features" },
    { name: "Add Member", to: "/addmember" },
    { name: "Records", to: "/records" },
    { name: "Reminders", to: "/reminder" },
    { name: "Insights", to: "/insights" },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <StethoscopeIcon className="text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              TrackMeds
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated
              ? authenticatedNavLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ))
              : navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user?.profileimg && (
                    <img
                      src={user.profileimg || "/placeholder.svg"}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    />
                  )}
                  <span className="text-gray-700 font-medium">Welcome, {user?.name || "User"}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <SidebarCloseIcon/> : <MenuIcon/>}
          </button>
        </div>

        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-4 border-t border-gray-200 mt-4">
            {isAuthenticated
              ? authenticatedNavLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="block text-gray-600 hover:text-blue-600 font-medium transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))
              : navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="block text-gray-600 hover:text-blue-600 font-medium transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

            <div className="pt-4 space-y-3 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center justify-center space-x-2 py-2">
                    {user?.profileimg && (
                      <img
                        src={user.profileimg || "/placeholder.svg"}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                      />
                    )}
                    <span className="text-gray-700 font-medium">{user?.name || "User"}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center text-red-600 hover:text-red-700 font-medium transition-colors py-2 rounded-lg hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-center text-gray-600 hover:text-blue-600 font-medium transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
