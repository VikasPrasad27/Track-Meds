import React,{ useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserPlus, User, Calendar, Users, Heart } from "lucide-react"
import { backendUrl } from "../App"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function AddMember() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [relation, setRelation] = useState("")
  const [gender, setGender] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const relationOptions = ["Spouse", "Child", "Parent", "Sibling", "Guardian", "Other"]
  const genderOptions = ["Male", "Female", "Other"]

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      setIsLoading(true)

      const memberData = {
        name,
        age: Number.parseInt(age),
        relation,
        gender,
      }

      console.log("Adding Family Member:", memberData)


      const response = await fetch(`${backendUrl}/members/addmember`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(memberData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Member added successfully:", result)

        setName("")
        setAge("")
        setRelation("")
        setGender("")

        toast.success("Member Added Successfully!...", {
                 position: "top-left",
               })
       
               setTimeout(() => {
                 navigate("/dashboard")
                 window.location.reload()
               }, 1500)
             } else {
               toast.error("Failed. Please try again.", {
                 position: "top-right",
               })
             }
    } catch (error) {
      console.error("Error Adding Family Member:", error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Add Family Member</h1>
                <p className="text-blue-100">Add a new member to your family health records</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  Full Name *
                </label>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Enter full name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-green-600" />
                  Age *
                </label>
                <input
                  type="number"
                  onChange={(e) => setAge(e.target.value)}
                  value={age}
                  placeholder="Enter age"
                  required
                  min="0"
                  max="120"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Users className="w-4 h-4 mr-2 text-purple-600" />
                  Relation *
                </label>
                <select
                  onChange={(e) => setRelation(e.target.value)}
                  value={relation}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white"
                >
                  <option value="">Select relation</option>
                  {relationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Heart className="w-4 h-4 mr-2 text-pink-600" />
                  Gender *
                </label>
                <select
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white"
                >
                  <option value="">Select gender</option>
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>


            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding Member...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>ADD MEMBER</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Heart className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Family Health Management</h3>
              <p className="text-blue-700 text-sm">
                Adding family members helps you manage everyone's health records, appointments, and medical history in
                one secure place. All information is encrypted and HIPAA compliant.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default AddMember
