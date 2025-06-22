import React,{ useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Users, UserPlus, Activity, AlertCircle, Plus, FileText, User } from "lucide-react"
import axios from "axios"
import { backendUrl } from "../App"

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  ...props
}) => {
  const baseClasses = "font-semibold rounded-lg transition-all duration-300 flex items-center justify-center"
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    outline: "border-2 border-gray-300 hover:border-gray-400 text-gray-700 bg-white",
  }
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = "", onClick }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-200 ${onClick ? "cursor-pointer hover:shadow-xl transition-shadow" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [familyMembers, setFamilyMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }

    fetchFamilyMembers()

    const handleMemberAdded = () => {
      fetchFamilyMembers()
    }

    window.addEventListener("memberAdded", handleMemberAdded)

    return () => {
      window.removeEventListener("memberAdded", handleMemberAdded)
    }
  }, [])

  const fetchFamilyMembers = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching family members from:", `${backendUrl}/members/getmember`)

      const response = await axios.get(`${backendUrl}/members/getmember`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      // console.log("Full response:", response.data)

      if (response.data && response.data.success) {
        const members = response.data.data || []
        // console.log("Members found:", members)
        setFamilyMembers(members)
        setError(null)
      } else {
        console.log("No members found or unsuccessful response")
        setFamilyMembers([])
      }
    } catch (error) {
      console.error("Error fetching family members:", error)
      console.error("Error response:", error.response?.data)

      if (error.response?.status === 401) {
        setError("Please log in to view your family members")
      } else {
        setError("Failed to load family members. Please try again.")
      }
      setFamilyMembers([])
    } finally {
      setIsLoading(false)
    }
  }

  const generateAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`
  }

  const handleAddMemberClick = () => {
    navigate("/addmember")
  }

  const handleMemberClick = (member) => {
    navigate("/records", { state: { selectedMember: member } })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* User Welcome Section */}
          {currentUser && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  {currentUser.profileimg ? (
                    <img
                      src={currentUser.profileimg || "/placeholder.svg"}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Welcome back, {currentUser.name}!</h2>
                  <p className="text-gray-600">Manage your family's health records and appointments</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Family Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your family's health records</p>
            </div>
            <Button onClick={handleAddMemberClick} className="flex items-center space-x-2">
              <UserPlus size={20} />
              <span>Add Member</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
         
          <p className="text-xs text-blue-700">
            <strong>Members Count:</strong> {familyMembers.length}
          </p>
          
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-600" />
              Family Members ({familyMembers.length})
            </h2>
          </div>

          {error ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchFamilyMembers}>Try Again</Button>
            </div>
          ) : familyMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Family Members Yet</h3>
              <p className="text-gray-600 mb-6">
                Start by adding your first family member to manage their health records.
              </p>
              <Button onClick={handleAddMemberClick} className="flex items-center space-x-2">
                <UserPlus size={20} />
                <span>Add First Member</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {familyMembers.map((member) => (
                <Card
                  key={member._id || member.id}
                  className="p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => handleMemberClick(member)}
                >
                  <div className="text-center">
                    <img
                      src={member.avatar || generateAvatar(member.name)}
                      alt={member.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200"
                      onError={(e) => {
                        e.target.src = generateAvatar(member.name)
                      }}
                    />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Age:</span> {member.age}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Relation:</span> {member.relation}
                      </p>
                      {member.gender && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Gender:</span> {member.gender}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-center text-blue-600">
                        <FileText className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Click to add medical records</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {familyMembers.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className="p-6 text-center hover:shadow-xl transition-shadow cursor-pointer"
              onClick={handleAddMemberClick}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="text-blue-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Another Member</h3>
              <p className="text-gray-600">Add more family members to manage their health records</p>
            </Card>

            <Card
              className="p-6 text-center hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate("/reminder")}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="text-green-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Reminders</h3>
              <p className="text-gray-600">Set up reminders for appointments and medications</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
