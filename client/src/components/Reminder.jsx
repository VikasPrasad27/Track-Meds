import React,{ useState, useEffect } from "react"
import {
  Bell,
  Plus,
  Calendar,
  Clock,
  User,
  Edit,
  Trash2,
  Check,
  AlertCircle,
  Filter,
  Search,
  Stethoscope,
  Pill,
  FileText,
  Activity,
  X,
} from "lucide-react"
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
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
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

const Card = ({ children, className = "" }) => {
  return <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>{children}</div>
}

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">{children}</div>
    </div>
  )
}

function Reminder() {
  const [reminders, setReminders] = useState([])
  const [familyMembers, setFamilyMembers] = useState([])
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0, overdue: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingReminder, setEditingReminder] = useState(null)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [notificationPermission, setNotificationPermission] = useState("default")


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reminderType: "appointment",
    reminderDate: "",
    reminderTime: "",
    familyMemberId: "",
    isRecurring: false,
    recurringType: "",
    notificationMethods: ["browser"],
    priority: "medium",
  })

  const reminderTypes = [
    { value: "appointment", label: "Appointment", icon: Calendar },
    { value: "checkup", label: "Check-up", icon: Stethoscope },
    { value: "medication", label: "Medication", icon: Pill },
    { value: "test", label: "Medical Test", icon: FileText },
    { value: "visit", label: "Doctor Visit", icon: User },
    { value: "other", label: "Other", icon: Bell },
  ]

  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  }

  useEffect(() => {
    fetchReminders()
    fetchFamilyMembers()
    fetchStats()
    requestNotificationPermission()
  }, [])

  useEffect(() => {
    
    const interval = setInterval(checkDueReminders, 30000)
    return () => clearInterval(interval)
  }, [reminders])

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      console.log("Notification permission:", permission)

      if (permission === "granted") {
        
        new Notification("TrackMeds Notifications Enabled", {
          body: "You will now receive browser notifications for your reminders.",
          icon: "/favicon.ico",
        })
      }
    } else {
      console.log("This browser does not support notifications")
    }
  }

  const checkDueReminders = () => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return
    }

    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5)
    const currentDate = now.toISOString().split("T")[0]

    // console.log("Checking reminders at:", currentTime, currentDate)

    reminders.forEach((reminder) => {
      const reminderDate = new Date(reminder.reminderDate).toISOString().split("T")[0]
      const isTimeMatch = reminder.reminderTime === currentTime
      const isDateMatch = reminderDate === currentDate
      const shouldNotify = !reminder.isCompleted && reminder.isActive && !reminder.notificationSent

      // console.log("Reminder check:", {
      //   title: reminder.title,
      //   reminderDate,
      //   currentDate,
      //   reminderTime: reminder.reminderTime,
      //   currentTime,
      //   isTimeMatch,
      //   isDateMatch,
      //   shouldNotify,
      // }) 

      if (isDateMatch && isTimeMatch && shouldNotify) {
        showBrowserNotification(reminder)
        // Mark as notified locally to prevent duplicate notifications
        setReminders((prev) => prev.map((r) => (r._id === reminder._id ? { ...r, notificationSent: true } : r)))
      }
    })
  }

  const showBrowserNotification = (reminder) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const memberInfo = reminder.familyMemberId ? ` for ${reminder.familyMemberId.name}` : ""

      const notification = new Notification(`TrackMeds Reminder: ${reminder.title}`, {
        body: `${reminder.reminderType}${memberInfo} - ${reminder.description || "No description"}`,
        icon: "/favicon.ico",
        tag: reminder._id,
        requireInteraction: true, 
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      console.log("Browser notification sent for:", reminder.title)
    }
  }

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No token found")
        return
      }

      const response = await axios.get(`${backendUrl}/reminders/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReminders(response.data.data.reminders || [])
    } catch (error) {
      console.error("Error fetching reminders:", error)
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        window.location.href = "/signin"
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFamilyMembers = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await axios.get(`${backendUrl}/members/getmember`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFamilyMembers(response.data.members || [])
    } catch (error) {
      console.error("Error fetching family members:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await axios.get(`${backendUrl}/reminders/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStats(response.data.data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Please log in again")
        return
      }

      const submitData = {
        ...formData,
        // Convert empty string to null for familyMemberId
        familyMemberId:
          formData.familyMemberId && formData.familyMemberId.trim() !== "" ? formData.familyMemberId : null,
      }

      if (editingReminder) {
        await axios.put(`${backendUrl}/reminders/${editingReminder._id}`, submitData, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await axios.post(`${backendUrl}/reminders`, submitData, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }

      resetForm()
      fetchReminders()
      fetchStats()
      alert(editingReminder ? "Reminder updated successfully!" : "Reminder created successfully!")
    } catch (error) {
      console.error("Error saving reminder:", error)
      alert("Error saving reminder: " + (error.response?.data?.message || error.message))
    } finally {
      setIsLoading(false)
    }
  }

  const markCompleted = async (id) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      await axios.patch(
        `${backendUrl}/reminders/${id}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      fetchReminders()
      fetchStats()
    } catch (error) {
      console.error("Error marking reminder as completed:", error)
    }
  }

  const deleteReminder = async (id) => {
    if (!confirm("Are you sure you want to delete this reminder?")) return

    try {
      const token = localStorage.getItem("token")
      if (!token) return

      await axios.delete(`${backendUrl}/reminders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchReminders()
      fetchStats()
    } catch (error) {
      console.error("Error deleting reminder:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      reminderType: "appointment",
      reminderDate: "",
      reminderTime: "",
      familyMemberId: "",
      isRecurring: false,
      recurringType: "",
      notificationMethods: ["browser"],
      priority: "medium",
    })
    setShowCreateModal(false)
    setEditingReminder(null)
  }

  const startEdit = (reminder) => {
    setEditingReminder(reminder)
    setFormData({
      title: reminder.title,
      description: reminder.description || "",
      reminderType: reminder.reminderType,
      reminderDate: new Date(reminder.reminderDate).toISOString().split("T")[0],
      reminderTime: reminder.reminderTime,
      familyMemberId: reminder.familyMemberId?._id || "",
      isRecurring: reminder.isRecurring,
      recurringType: reminder.recurringType || "",
      notificationMethods: reminder.notificationMethods,
      priority: reminder.priority,
    })
    setShowCreateModal(true)
  }

  const filteredReminders = reminders.filter((reminder) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && reminder.isCompleted) ||
      (filter === "active" && !reminder.isCompleted && reminder.isActive) ||
      (filter === "overdue" && !reminder.isCompleted && new Date(reminder.reminderDate) < new Date())

    const matchesSearch =
      reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.description?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isOverdue = (reminder) => {
    const reminderDateTime = new Date(`${reminder.reminderDate.split("T")[0]}T${reminder.reminderTime}`)
    return reminderDateTime < new Date() && !reminder.isCompleted
  }

  if (isLoading && reminders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading reminders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Bell className="w-8 h-8 mr-3 text-blue-600" />
                Health Reminders
              </h1>
              <p className="text-gray-600 mt-1">Never miss an appointment or medication</p>
              {/* Notification Status */}
              <div className="mt-2">
                {notificationPermission === "granted" ? (
                  <span className="text-green-600 text-sm flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    Browser notifications enabled
                  </span>
                ) : (
                  <button
                    onClick={requestNotificationPermission}
                    className="text-orange-600 text-sm flex items-center hover:text-orange-700"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Enable browser notifications
                  </button>
                )}
              </div>
            </div>
            <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2">
              <Plus size={20} />
              <span>Add Reminder</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Rest of your component remains the same... */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reminders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Activity className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters & Searching part */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Reminders</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 flex-1">
              <Search size={20} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search reminders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </Card>

        {/* Reminders list part */}
        <Card className="p-6">
          {filteredReminders.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reminders Found</h3>
              <p className="text-gray-600 mb-6">
                {filter === "all" ? "You haven't created any reminders yet." : `No ${filter} reminders found.`}
              </p>
              <Button onClick={() => setShowCreateModal(true)}>Create Your First Reminder</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReminders.map((reminder) => {
                const TypeIcon = reminderTypes.find((t) => t.value === reminder.reminderType)?.icon || Bell
                const isReminderOverdue = isOverdue(reminder)

                return (
                  <div
                    key={reminder._id}
                    className={`border rounded-lg p-4 transition-all duration-200 ${
                      reminder.isCompleted
                        ? "bg-gray-50 border-gray-200"
                        : isReminderOverdue
                          ? "bg-red-50 border-red-200"
                          : "bg-white border-gray-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            reminder.isCompleted ? "bg-gray-200" : "bg-blue-100"
                          }`}
                        >
                          <TypeIcon className={`w-5 h-5 ${reminder.isCompleted ? "text-gray-500" : "text-blue-600"}`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3
                              className={`font-semibold ${
                                reminder.isCompleted ? "text-gray-500 line-through" : "text-gray-900"
                              }`}
                            >
                              {reminder.title}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                priorityColors[reminder.priority]
                              }`}
                            >
                              {reminder.priority}
                            </span>
                            {isReminderOverdue && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                Overdue
                              </span>
                            )}
                          </div>

                          {reminder.description && <p className="text-gray-600 text-sm mb-2">{reminder.description}</p>}

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(reminder.reminderDate)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {reminder.reminderTime}
                            </div>
                            {reminder.familyMemberId && (
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {reminder.familyMemberId.name} ({reminder.familyMemberId.relation})
                              </div>
                            )}
                            {reminder.isRecurring && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                {reminder.recurringType}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!reminder.isCompleted && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => markCompleted(reminder._id)}
                            title="Mark as completed"
                          >
                            <Check size={16} />
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => startEdit(reminder)} title="Edit reminder">
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteReminder(reminder._id)}
                          title="Delete reminder"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      <Modal isOpen={showCreateModal} onClose={resetForm}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingReminder ? "Edit Reminder" : "Create New Reminder"}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter reminder title"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                <select
                  value={formData.reminderType}
                  onChange={(e) => setFormData({ ...formData, reminderType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {reminderTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={formData.reminderDate}
                  onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time *</label>
                <input
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">For Family Member (Optional)</label>
                <select
                  value={formData.familyMemberId}
                  onChange={(e) => setFormData({ ...formData, familyMemberId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select family member (or leave blank for yourself)</option>
                  {familyMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.relation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details about this reminder"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
                    Make this a recurring reminder
                  </label>
                </div>

                {formData.isRecurring && (
                  <select
                    value={formData.recurringType}
                    onChange={(e) => setFormData({ ...formData, recurringType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Methods</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="browser"
                      checked={formData.notificationMethods.includes("browser")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            notificationMethods: [...formData.notificationMethods, "browser"],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            notificationMethods: formData.notificationMethods.filter((m) => m !== "browser"),
                          })
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="browser" className="text-sm text-gray-700">
                      Browser Notification
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="email"
                      checked={formData.notificationMethods.includes("email")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            notificationMethods: [...formData.notificationMethods, "email"],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            notificationMethods: formData.notificationMethods.filter((m) => m !== "email"),
                          })
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="email" className="text-sm text-gray-700">
                      Email Notification
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={resetForm} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {editingReminder ? "Updating..." : "Creating..."}
                  </>
                ) : editingReminder ? (
                  "Update Reminder"
                ) : (
                  "Create Reminder"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default Reminder
