import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import {
  FileText,
  Calendar,
  User,
  Upload,
  Stethoscope,
  Clock,
  Plus,
  Eye,
  Filter,
  Search,
  ArrowLeft,
} from "lucide-react"
import { backendUrl } from "../App"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
    success: "bg-green-600 hover:bg-green-700 text-white",
    outline: "border-2 border-gray-300 hover:border-gray-400 text-gray-700 bg-white",
  }
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = "" }) => {
  return <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>{children}</div>
}

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">{children}</div>
    </div>
  )
}

function Records() {
  const location = useLocation()
  const selectedMemberFromDashboard = location.state?.selectedMember

  const [diagnosis, setDiagnosis] = useState("")
  const [visitDate, setVisitDate] = useState("")
  const [nextVisitDate, setNextVisitDate] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [reportFile, setReportFile] = useState(null)
  const [selectedMember, setSelectedMember] = useState(selectedMemberFromDashboard?._id || "")

  const [familyMembers, setFamilyMembers] = useState([])
  const [medicalRecords, setMedicalRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTab, setActiveTab] = useState("view") // "view" or "add"
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMember, setFilterMember] = useState("")

  useEffect(() => {
    fetchFamilyMembers()
    fetchMedicalRecords()
  }, [])

  useEffect(() => {
    // Filter records based on search and member filter
    let filtered = medicalRecords

    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterMember) {
      filtered = filtered.filter((record) => record.memberId._id === filterMember)
    }

    setFilteredRecords(filtered)
  }, [medicalRecords, searchTerm, filterMember])

  const fetchFamilyMembers = async () => {
    try {
      const response = await fetch(`${backendUrl}/members/getmember`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setFamilyMembers(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching family members:", error)
    }
  }

  const fetchMedicalRecords = async () => {
    try {
      console.log("Fetching medical records from:", `${backendUrl}/records/getrecord`)

      const response = await fetch(`${backendUrl}/records/getrecord`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Medical records response:", data)

        setMedicalRecords(data.data || [])
      } else {
        console.error("Failed to fetch records:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("Error fetching medical records:", error)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setReportFile(file)
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      setIsLoading(true)

      const formData = new FormData()
      formData.append("memberId", selectedMember)
      formData.append("diagnosis", diagnosis)
      formData.append("visitDate", visitDate)
      formData.append("nextVisitDate", nextVisitDate)
      formData.append("doctorName", doctorName)

      if (reportFile) {
        formData.append("reportUrl", reportFile)
      }

      const response = await fetch(`${backendUrl}/records/addrecord`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Medical record added successfully:", result)

        setDiagnosis("")
        setVisitDate("")
        setNextVisitDate("")
        setDoctorName("")
        setReportFile(null)
        if (!selectedMemberFromDashboard) {
          setSelectedMember("")
        }

        const fileInput = document.getElementById("reportFile")
        if (fileInput) fileInput.value = ""

        fetchMedicalRecords()

        // alert("Medical record added successfully!")

        toast.success("Records Added Successfully!...", {
          position: "top-left",
        })
        setActiveTab("view")

      } else {
        toast.error("Failed to Add Record. Please try again.", {
          position: "top-right",
        })
      }
    } catch (error) {
      console.error("Error Adding Medical Record:", error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const downloadReport = (reportUrl, fileName) => {
    const link = document.createElement("a")
    link.href = reportUrl
    link.download = fileName
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl  shadow-xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6">
            <div className="md:flex  items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Medical Records</h1>
                  <p className="text-green-100">
                    {selectedMemberFromDashboard
                      ? `Managing records for ${selectedMemberFromDashboard.name}`
                      : "Manage your family's medical records"}
                  </p>
                </div>
              </div>

              <div className="flex mt-4 space-x-3">
                <Button
                  variant={activeTab === "view" ? "primary" : "outline"}
                  onClick={() => setActiveTab("view")}
                  className="text-black border-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Records
                </Button>
                <Button
                  variant={activeTab === "add" ? "primary" : "outline"}
                  onClick={() => setActiveTab("add")}
                  className="text-black border-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Record
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* View Records Tab */}
        {activeTab === "view" && (
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex items-center space-x-2 flex-1">
                <Search size={20} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by diagnosis or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={filterMember}
                  onChange={(e) => setFilterMember(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Members</option>
                  {familyMembers.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical Records Found</h3>
                <p className="text-gray-600 mb-6">
                  {medicalRecords.length === 0
                    ? "Start by adding your first medical record."
                    : "No records match your current filters."}
                </p>
                <Button onClick={() => setActiveTab("add")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Record
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div
                    key={record._id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{record.memberId?.name || "Unknown Member"}</h3>
                            <p className="text-sm text-gray-600">{record.memberId?.relation || "Unknown Relation"}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Diagnosis</p>
                            <p className="text-gray-900">{record.diagnosis}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Doctor</p>
                            <p className="text-gray-900">{record.doctorName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Visit Date</p>
                            <p className="text-gray-900">{formatDate(record.visitDate)}</p>
                          </div>
                          {record.nextVisitDate && (
                            <div>
                              <p className="text-sm font-medium text-gray-700">Next Visit</p>
                              <p className="text-gray-900">{formatDate(record.nextVisitDate)}</p>
                            </div>
                          )}
                        </div>

                        {record.reportUrl && (
                          <div className="flex items-center space-x-2 text-blue-600">
                            <FileText className="w-4 h-4" />
                            <button
                              onClick={() => downloadReport(record.reportUrl, `${record.memberId?.name}_report.pdf`)}
                              className="text-sm hover:underline"
                            >
                              Download Report
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Add Record Tab */}
        {activeTab === "add" && (
          <Card className="overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    Select Family Member *
                  </label>
                  <select
                    onChange={(e) => setSelectedMember(e.target.value)}
                    value={selectedMember}
                    required
                    disabled={!!selectedMemberFromDashboard}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white disabled:bg-gray-100"
                  >
                    <option value="">Select a family member</option>
                    {familyMembers.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name} ({member.relation})
                      </option>
                    ))}
                  </select>
                  {selectedMemberFromDashboard && (
                    <p className="text-sm text-blue-600 mt-1">Adding record for {selectedMemberFromDashboard.name}</p>
                  )}
                </div>

                {/* Visit Date */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-green-600" />
                    Visit Date *
                  </label>
                  <input
                    type="date"
                    onChange={(e) => setVisitDate(e.target.value)}
                    value={visitDate}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700"
                  />
                </div>

                {/* Next Visit Date */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-4 h-4 mr-2 text-orange-600" />
                    Next Visit Date
                  </label>
                  <input
                    type="date"
                    onChange={(e) => setNextVisitDate(e.target.value)}
                    value={nextVisitDate}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700"
                  />
                </div>

                {/* Doctor Name */}
                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Stethoscope className="w-4 h-4 mr-2 text-purple-600" />
                    Doctor Name *
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setDoctorName(e.target.value)}
                    value={doctorName}
                    placeholder="Enter doctor name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700"
                  />
                </div>

                {/* Diagnosis */}
                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-2 text-red-600" />
                    Diagnosis *
                  </label>
                  <textarea
                    onChange={(e) => setDiagnosis(e.target.value)}
                    value={diagnosis}
                    placeholder="Enter diagnosis details"
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-700 resize-none"
                  />
                </div>

                {/* Upload Report */}
                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Upload className="w-4 h-4 mr-2 text-indigo-600" />
                    Upload Report
                  </label>
                  <input
                    type="file"
                    id="reportFile"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: PDF, JPG, PNG, DOC, DOCX (Max size: 10MB)
                  </p>
                  {reportFile && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        Selected file: {reportFile.name} ({(reportFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex space-x-4">
                <Button variant="outline" onClick={() => setActiveTab("view")} type="button" className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Records
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Adding Record...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      ADD MEDICAL RECORD
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Medical Records</h3>
                <p className="text-green-700 text-sm">
                  Keep track of all medical visits, diagnoses, and treatments for your family members.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Upload className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Secure Storage</h3>
                <p className="text-blue-700 text-sm">
                  All uploaded reports are encrypted and stored securely with HIPAA compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Records
