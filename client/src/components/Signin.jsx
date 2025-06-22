import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Stethoscope,
  Shield,
  Heart,
  LogIn,
} from "lucide-react"
import axios from "axios"
import { backendUrl } from "../App"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function Signin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSignIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }

      const result = await axios.post(
        `${backendUrl}/users/login`,
        { email, password },
        config
      )

      if (
        result.data.statusCode === 200 ||
        result.data.message === "User Logged in seccessfully"
      ) {
        if (result.data.data) {
          localStorage.setItem("user", JSON.stringify(result.data.data.user))
          localStorage.setItem("token", result.data.data.accessToken)
        }

        toast.success("Login successful! Welcome To TrackMeds!...", {
          position: "top-left",
        })

        setTimeout(() => {
          navigate("/dashboard")
          window.location.reload()
        }, 1500)
      } else {
        toast.error("Login failed. Please try again.", {
          position: "top-right",
        })
      }
    } catch (err) {
      console.error("Login error:", err)

      let message = "Login failed. Please try again."

      if (err.response?.status === 401) {
        message = "Incorrect email or password"
      } else if (err.response?.status === 404) {
        message = "Email does not exist"
      } else if (err.response?.status === 400) {
        message = "Email is required"
      } else if (err.code === "ERR_NETWORK") {
        message = "Network error. Please check if the server is running."
      } else if (err.response?.data?.message) {
        message = err.response.data.message
      }

      toast.error(message, { position: "top-right" })
      setErrors({ general: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-800">TrackMeds</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600">
            Sign in to access your family's health records
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSignIn} className="p-8">
            <div className="space-y-6">
              {/* Optionally keep inline errors */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm text-center">
                    {errors.general}
                  </p>
                </div>
              )}

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2 text-green-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Lock className="w-4 h-4 mr-2 text-blue-600" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>SIGN IN</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Secure Login
              </span>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-700">
                Trusted Platform
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3 text-center">
            Why Choose TrackMeds?
          </h3>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>Secure family health record management</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span>Appointment and medication reminders</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span>Encrypted storage</span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Signin
